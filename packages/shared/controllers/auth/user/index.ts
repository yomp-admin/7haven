import { BackendMethod, remult } from 'remult';
import { generateRandomOTP, getAuthRepo } from '../../../index';
import { z } from 'zod';

export class UserController {
  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async initialize_seller_registration(
    email: string
  ): Promise<{ success: boolean; message?: string; userId?: string }> {
    if (!z.string().email().safeParse(email).success) {
      return { success: false, message: 'Invalid email format' };
    }

    const existingUser = await getAuthRepo().user.findFirst({
      email
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return { success: false, message: 'Email already registered' };
      }

      const result = await UserController.resend_verification(existingUser.id);

      if (!result.success) {
        return { success: false, message: result.message };
      }
      return { success: true, userId: existingUser.id, message: 'Verification code resent' };
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

    return { success: true, userId: user.id, message: 'Verification code sent' };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async verify_seller_email(
    userId: string,
    code: string
  ): Promise<{ success: boolean; message?: string }> {
    if (!userId || !code?.length) {
      return { success: false, message: 'Invalid input' };
    }

    const verification = await getAuthRepo().otp.findFirst({
      userId,
      code,
      verified: false
    });

    if (!verification || verification.expiresAt <= new Date()) {
      return { success: false, message: 'Invalid verification code' };
    }

    const updatedVerification = await getAuthRepo().otp.update(verification.id, {
      verified: true
    });

    if (!updatedVerification) {
      return { success: false, message: 'Failed to verify code' };
    }

    return { success: true, message: 'Email verified successfully' };
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

    return { success: true, message: 'Verification code resent' };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async complete_seller_registration(
    userId: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    if (!password || password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters' };
    }

    const verification = await getAuthRepo().otp.findFirst({
      userId,
      verified: true
    });

    if (!verification) {
      return { success: false, message: 'Email not verified' };
    }

    const user = await getAuthRepo().user.findId(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const updatedUser = await getAuthRepo().user.update(userId, {
      password,
      emailVerified: true
    });

    await getAuthRepo().otp.delete(verification.id);

    if (!updatedUser) {
      return { success: false, message: 'Failed to update user' };
    }

    return { success: true, message: 'Account created successfully' };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async is_email_available(email: string): Promise<boolean> {
    const user = await getAuthRepo().user.findFirst({
      email,
      emailVerified: true
    });
    return !user;
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async auth_user() {
    return remult.user;
  }
}
