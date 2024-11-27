import { BackendMethod, remult } from 'remult';
import { generateRandomOTP, getAuthRepo } from '../../../index';

export class userController {
  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async initialize_seller_registration(
    email: string
  ): Promise<{ success: boolean; message?: string; userId?: string }> {
    const existingUser = await getAuthRepo().user.findFirst({
      email
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return { success: false, message: 'Email already registered' };
      }

      const result = await userController.resend_verification(existingUser.id);
      if (!result.success) {
        return { success: false, message: result.message };
      }
      return { success: true, userId: existingUser.id };
    }

    const user = await getAuthRepo().user.insert({
      email,
      roles: ['pending_seller'],
      emailVerified: false
    });

    const code = generateRandomOTP();

    await getAuthRepo().otp.insert({
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    // TODO: Send verification email
    console.log(`Verification code for ${email}: ${code}`);

    return { success: true, userId: user.id };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async verify_seller_email(
    userId: string,
    code: string
  ): Promise<{ success: boolean; message?: string }> {
    const verification = await getAuthRepo().otp.findFirst({
      userId,
      code
    });

    if (!verification || verification.expiresAt <= new Date()) {
      return { success: false, message: 'Invalid verification code' };
    }

    return { success: true };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async resend_verification(
    userId: string
  ): Promise<{ success: boolean; message?: string }> {
    const user = await getAuthRepo().user.findFirst({
      id: userId,
      roles: ['pending_seller']
    });

    if (!user) {
      return { success: false, message: 'Invalid user' };
    }

    const existingVerification = await getAuthRepo().otp.findFirst({
      userId
    });

    if (!existingVerification) {
      return { success: false, message: 'No pending verification found' };
    }

    const lastResendTime = existingVerification.updatedAt || existingVerification.createdAt;
    const timeSinceLastResend = Date.now() - lastResendTime.getTime();
    if (timeSinceLastResend < 60 * 1000) {
      return { success: false, message: 'Please wait before requesting another code' };
    }

    const code = generateRandomOTP();

    await getAuthRepo().otp.update(existingVerification.id, {
      code,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    console.log(`New verification code for ${user.email}: ${code}`);

    return { success: true };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async complete_seller_registration(userId: string, password: string) {
    const verification = await getAuthRepo().otp.findFirst({
      userId
    });

    if (!verification) {
      return { success: false, message: 'Email not verified' };
    }

    await getAuthRepo().user.update(userId, {
      password,
      emailVerified: true
    });

    return { success: true };
  }

  @BackendMethod({ allowed: true })
  static async current_user() {
    return await remult.user;
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async is_email_available(email: string): Promise<boolean> {
    const user = await getAuthRepo().user.findFirst({
      email,
      emailVerified: true
    });
    return !user;
  }
}
