import { coseAlgorithmES256, coseAlgorithmRS256 } from '@oslojs/webauthn';
import {
  decodePKIXECDSASignature,
  decodeSEC1PublicKey,
  p256,
  verifyECDSASignature
} from '@oslojs/crypto/ecdsa';
import {
  decodePKCS1RSAPublicKey,
  sha256ObjectIdentifier,
  verifyRSASSAPKCS1v15Signature
} from '@oslojs/crypto/rsa';
import { getAuthRepo } from '@repo/shared';
import { encodeHexLowerCase } from '@oslojs/encoding';

const challengeBucket = new Set<string>();

export function createWebAuthnChallenge(): Uint8Array {
  const challenge = new Uint8Array(20);
  crypto.getRandomValues(challenge);
  const encoded = encodeHexLowerCase(challenge);
  challengeBucket.add(encoded);
  return challenge;
}

export function verifyWebAuthnChallenge(challenge: Uint8Array): boolean {
  const encoded = encodeHexLowerCase(challenge);
  return challengeBucket.delete(encoded);
}

export async function getUserPasskeyCredentials(userId: string): Promise<WebAuthnUserCredential[]> {
  const credentials = await getAuthRepo().passkey.find({ where: { userId } });
  return credentials.map((c) => ({
    id: c.id,
    userId: c.userId,
    name: c.name,
    algorithmId: c.algorithm,
    publicKey: c.publicKey
  }));
}

export async function getUserPasskeyCredential(
  userId: string,
  credentialId: Uint8Array
): Promise<WebAuthnUserCredential | null> {
  const credential = await getAuthRepo().passkey.findFirst({ id: credentialId, userId });
  if (!credential) {
    return null;
  }
  return {
    id: credential.id,
    userId: credential.userId,
    name: credential.name,
    algorithmId: credential.algorithm,
    publicKey: credential.publicKey
  };
}

export async function getPasskeyCredential(
  credentialId: Uint8Array
): Promise<WebAuthnUserCredential | null> {
  const credential = await getAuthRepo().passkey.findFirst({ id: credentialId });
  if (!credential) {
    return null;
  }
  return {
    id: credential.id,
    userId: credential.userId,
    name: credential.name,
    algorithmId: credential.algorithm,
    publicKey: credential.publicKey
  };
}

export async function createPasskeyCredential(credential: WebAuthnUserCredential): Promise<void> {
  await getAuthRepo().passkey.insert({
    id: credential.id,
    userId: credential.userId,
    name: credential.name,
    algorithm: credential.algorithmId,
    publicKey: credential.publicKey
  });
}

export async function deletePasskeyCredential(credentialId: Uint8Array): Promise<void> {
  await getAuthRepo().passkey.delete({ id: credentialId });
}

export async function getUserSecurityKeyCredential(
  userId: string,
  credentialId: Uint8Array
): Promise<WebAuthnUserCredential | null> {
  const credential = await getAuthRepo().securityKey.findFirst({ id: credentialId, userId });
  if (!credential) {
    return null;
  }
  return {
    id: credential.id,
    userId: credential.userId,
    name: credential.name,
    algorithmId: credential.algorithm,
    publicKey: credential.publicKey
  };
}

export async function createSecurityKeyCredential(
  credential: WebAuthnUserCredential
): Promise<void> {
  await getAuthRepo().securityKey.create({
    id: credential.id,
    userId: credential.userId,
    name: credential.name,
    algorithm: credential.algorithmId,
    publicKey: credential.publicKey
  });
}

export async function deleteSecurityKeyCredential(credentialId: Uint8Array): Promise<void> {
  await getAuthRepo().securityKey.delete({ id: credentialId });
}

export const verifySignature = (
  algorithmId: number,
  publicKey: Uint8Array,
  hash: Uint8Array,
  signatureBytes: Uint8Array
): boolean => {
  switch (algorithmId) {
    case coseAlgorithmES256:
      const ecdsaSignature = decodePKIXECDSASignature(signatureBytes);
      const ecdsaPublicKey = decodeSEC1PublicKey(p256, publicKey);
      return verifyECDSASignature(ecdsaPublicKey, hash, ecdsaSignature);
    case coseAlgorithmRS256:
      const rsaPublicKey = decodePKCS1RSAPublicKey(publicKey);
      return verifyRSASSAPKCS1v15Signature(
        rsaPublicKey,
        sha256ObjectIdentifier,
        hash,
        signatureBytes
      );
    default:
      return false;
  }
};

export interface WebAuthnUserCredential {
  id: Uint8Array;
  userId: string;
  name: string;
  algorithmId: number;
  publicKey: Uint8Array;
}
