import { getAuthRepo } from '../../../index';
import { BackendMethod } from 'remult';

export class SecurityKeyController {
  @BackendMethod({ apiPrefix: 'auth/2fa/security-key', allowed: true })
  static async credentials(userId: string): Promise<WebAuthnUserCredential[]> {
    const credentials = await getAuthRepo().securityKey.find({ where: { userId } });
    const result = credentials.map(
      (c): WebAuthnUserCredential => ({
        id: c.id,
        userId: c.userId,
        name: c.name,
        algorithmId: c.algorithm,
        publicKey: c.publicKey
      })
    );
    console.log(result);
    return result;
  }
}

export interface WebAuthnUserCredential {
  id: Uint8Array;
  userId: string;
  name: string;
  algorithmId: number;
  publicKey: Uint8Array;
}
