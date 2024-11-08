import {
  parseClientDataJSON,
  coseAlgorithmES256,
  coseAlgorithmRS256,
  ClientDataType,
  parseAuthenticatorData,
  createAssertionSignatureMessage,
  parseAttestationObject,
  AttestationStatementFormat,
  coseEllipticCurveP256
} from '@oslojs/webauthn';
import { p256, ECDSAPublicKey } from '@oslojs/crypto/ecdsa';
import { decodeBase64, decodeBase64urlIgnorePadding } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { RSAPublicKey } from '@oslojs/crypto/rsa';
import { result } from '@/utils/responseHandler';
import { StatusCode } from '@/utils/statusCode';
import {
  createPasskeyCredential,
  deletePasskeyCredential,
  getPasskeyCredential,
  getUserPasskeyCredential,
  getUserPasskeyCredentials,
  verifySignature,
  verifyWebAuthnChallenge,
  type WebAuthnUserCredential
} from '@/lib/auth/webauthn';
import { authRepo, remult } from '@repo/shared';
import { config } from '@/config/config';
import type { Context } from 'hono';
import { createSession, generateSessionToken, setSessionCookie } from '@/services/auth/session';

const MAX_CREDENTIALS = 1;

async function decodeAndValidateFields(body: any, fields: string[]): Promise<Uint8Array[] | null> {
  const decoded = fields.map((field) => decodeBase64(body[field]));
  if (decoded.some((field) => !field)) {
    return null;
  }
  return decoded as Uint8Array[];
}

function validateAuthenticatorData(authData: any): boolean {
  return (
    authData.verifyRelyingPartyIdHash(config.RELYING_PARTY_ID) &&
    authData.userPresent &&
    authData.userVerified
  );
}

function validateClientData(clientData: any, expectedType: ClientDataType): boolean {
  return (
    clientData.type === expectedType &&
    verifyWebAuthnChallenge(clientData.challenge) &&
    config.CORS_ORIGIN.includes(clientData.origin) &&
    !clientData.crossOrigin
  );
}

export async function signInWithPasskey(c: Context): Promise<Response> {
  if (remult.user) {
    return c.json(result('Already signed in'), StatusCode.OK);
  }

  const requestBody = await c.req.json();
  const decodedFields = await decodeAndValidateFields(requestBody, [
    'authenticator_data',
    'client_data_json',
    'credential_id',
    'signature'
  ]);

  if (!decodedFields) {
    return c.json(result('Invalid or missing fields'), StatusCode.BAD_REQUEST);
  }

  const [authenticatorDataBytes, clientDataJSON, credentialId, signatureBytes] = decodedFields;
  const authenticatorData = parseAuthenticatorData(authenticatorDataBytes);

  if (!validateAuthenticatorData(authenticatorData)) {
    return c.json(result('Invalid data'), StatusCode.BAD_REQUEST);
  }

  const clientData = parseClientDataJSON(clientDataJSON);

  if (!validateClientData(clientData, ClientDataType.Create)) {
    return c.json(result('Invalid client data'), StatusCode.BAD_REQUEST);
  }

  const credential = await getPasskeyCredential(credentialId);

  if (!credential?.algorithmId || !credential.publicKey) {
    return c.json(
      result(credential ? 'Credential missing required properties' : 'Invalid credential'),
      StatusCode.BAD_REQUEST
    );
  }

  const hash = sha256(createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON));

  if (!verifySignature(credential.algorithmId, credential.publicKey, hash, signatureBytes)) {
    return c.json(result('Invalid signature'), StatusCode.BAD_REQUEST);
  }

  await authRepo.user.update(credential.userId, { twoFactorVerified: true });

  const token = generateSessionToken();
  const session = await createSession(token, credential.userId);
  setSessionCookie(c, token);

  const user = await authRepo.user.findId(credential.userId);
  if (!user) {
    return c.json(result('Error fetching user'), StatusCode.INTERNAL_SERVER_ERROR);
  }

  const userInfo = {
    id: user.id,
    name: user.username,
    roles: user.roles,
    session: {
      id: session.id,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      twoFactorVerified: user.twoFactorVerified
    }
  };

  remult.user = userInfo;

  return c.json(result({ userInfo: remult.user }), StatusCode.OK);
}

export async function registerPasskey(c: Context): Promise<Response> {
  if (!remult.user) {
    return c.json(result('Unauthorized'), StatusCode.UNAUTHORIZED);
  }

  const { name, attestation_object, client_data_json } = await c.req.json();
  const decodedAttestation = decodeBase64(attestation_object);
  const decodedClientData = decodeBase64(client_data_json);

  if (!decodedAttestation || !decodedClientData) {
    return c.json(result('Invalid or missing fields'), StatusCode.BAD_REQUEST);
  }

  const { authenticatorData, attestationStatement } = parseAttestationObject(decodedAttestation);

  if (
    attestationStatement.format !== AttestationStatementFormat.None ||
    !validateAuthenticatorData(authenticatorData) ||
    !authenticatorData.credential
  ) {
    return c.json(result('Invalid authenticator data'), StatusCode.BAD_REQUEST);
  }

  const clientData = parseClientDataJSON(decodedClientData);

  if (!validateClientData(clientData, ClientDataType.Create)) {
    return c.json(result('Invalid client data'), StatusCode.BAD_REQUEST);
  }

  const pubKey = authenticatorData.credential.publicKey;
  let credential: WebAuthnUserCredential;

  switch (pubKey.algorithm()) {
    case coseAlgorithmES256: {
      const cosePublicKey = pubKey.ec2();

      if (cosePublicKey.curve !== coseEllipticCurveP256) {
        return c.json(result('Unsupported algorithm'), StatusCode.BAD_REQUEST);
      }

      const encodedPublicKey = new ECDSAPublicKey(
        p256,
        cosePublicKey.x,
        cosePublicKey.y
      ).encodeSEC1Uncompressed();

      credential = {
        id: authenticatorData.credential.id,
        userId: remult.user.id,
        algorithmId: coseAlgorithmES256,
        name,
        publicKey: encodedPublicKey
      };
      break;
    }
    case coseAlgorithmRS256: {
      const cosePublicKey = pubKey.rsa();
      const encodedPublicKey = new RSAPublicKey(cosePublicKey.n, cosePublicKey.e).encodePKCS1();

      credential = {
        id: authenticatorData.credential.id,
        userId: remult.user.id,
        algorithmId: coseAlgorithmRS256,
        name,
        publicKey: encodedPublicKey
      };
      break;
    }
    default:
      return c.json(result('Unsupported algorithm'), StatusCode.BAD_REQUEST);
  }

  const userCredentials = await getUserPasskeyCredentials(remult.user.id);
  if (userCredentials.length >= MAX_CREDENTIALS) {
    return c.json(result('Too many credentials'), StatusCode.BAD_REQUEST);
  }

  await createPasskeyCredential(credential);
  await authRepo.user.update(credential.userId, { twoFactorVerified: true });

  return c.json(result('Passkey registered successfully'), StatusCode.OK);
}

export async function verifyPasskey(c: Context): Promise<Response> {
  if (!remult.user) {
    return c.json(result('Unauthorized'), StatusCode.UNAUTHORIZED);
  }

  if (!remult.user.session.twoFactorVerified) {
    return c.json(result('Two-factor verification required'), StatusCode.UNAUTHORIZED);
  }

  const requestBody = await c.req.json();
  const decodedFields = await decodeAndValidateFields(requestBody, [
    'authenticator_data',
    'client_data_json',
    'credential_id',
    'signature'
  ]);

  if (!decodedFields) {
    return c.json(result('Invalid or missing fields'), StatusCode.BAD_REQUEST);
  }

  const [authenticatorDataBytes, clientDataJSON, credentialId, signatureBytes] = decodedFields;
  const authenticatorData = parseAuthenticatorData(authenticatorDataBytes);

  if (!validateAuthenticatorData(authenticatorData)) {
    return c.json(result('Invalid authenticator data'), StatusCode.BAD_REQUEST);
  }

  const clientData = parseClientDataJSON(clientDataJSON);

  if (!validateClientData(clientData, ClientDataType.Get)) {
    return c.json(result('Invalid client data'), StatusCode.BAD_REQUEST);
  }

  const credential = await getUserPasskeyCredential(remult.user.id, credentialId);

  if (!credential) {
    return c.json(result('Invalid credential'), StatusCode.BAD_REQUEST);
  }

  const hash = sha256(createAssertionSignatureMessage(authenticatorDataBytes, clientDataJSON));

  if (!verifySignature(credential.algorithmId, credential.publicKey, hash, signatureBytes)) {
    return c.json(result('Invalid signature'), StatusCode.BAD_REQUEST);
  }

  await authRepo.user.update(credential.userId, { twoFactorVerified: true });

  return c.json(result('Passkey verified successfully'), StatusCode.OK);
}

export async function deletePasskey(c: Context): Promise<Response> {
  const encodedCredentialId = c.req.param('id');
  const user = remult.user;

  if (!user?.id) {
    return c.json(result('Unauthorized'), StatusCode.UNAUTHORIZED);
  }

  const credentialId = decodeBase64urlIgnorePadding(encodedCredentialId);
  if (!credentialId) {
    return c.json(result('Invalid credential ID'), StatusCode.NOT_FOUND);
  }

  const credential = await getUserPasskeyCredential(user.id, credentialId);
  if (!credential) {
    return c.json(result('Credential not found'), StatusCode.NOT_FOUND);
  }

  await deletePasskeyCredential(credentialId);

  return c.json(result('Passkey deleted successfully'), StatusCode.NO_CONTENT);
}
