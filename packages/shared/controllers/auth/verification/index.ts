import { BackendMethod, remult } from 'remult';
import { getAuthRepo } from '../../../index';
import { generateRandomOTP, hashPassword } from '../../../backendOnly/backend';

export class VerificationController {
  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async initializeSellerRegistration(email: string) {
    // Create temporary user record with pending status
    const user = await getAuthRepo().user.insert({
      email,
      roles: ['pending_seller'],
      emailVerified: false
    });

    // Create email verification record
    const code = generateRandomOTP();
    await getAuthRepo().emailReset.insert({
      userId: user.id,
      email,
      code,
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      email_verified: false
    });

    // TODO: Send verification email with code
    console.log(`Verification code for ${email}: ${code}`);

    return { userId: user.id };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async verifySellerEmail(userId: string, code: string) {
    const verification = await getAuthRepo().emailReset.findFirst({
      userId,
      code,
      email_verified: false
    });

    if (!verification || verification.expires_at < new Date()) {
      throw new Error('Invalid or expired verification code');
    }

    // Mark email as verified
    await getAuthRepo().emailReset.update(verification.id, {
      email_verified: true
    });

    return { success: true };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async completeSellerRegistration(userId: string, password: string) {
    const verification = await getAuthRepo().emailReset.findFirst({
      userId,
      email_verified: true
    });

    if (!verification) {
      throw new Error('Email not verified');
    }

    // Update user record with password and proper role
    await getAuthRepo().user.update(userId, {
      passwordHash: await hashPassword(password),
      roles: ['seller'],
      emailVerified: true
    });

    return { success: true };
  }
}
