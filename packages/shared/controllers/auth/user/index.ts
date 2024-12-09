import { BackendMethod, remult } from 'remult';
import { getAuthRepo } from '../../../index';
import { z } from 'zod';
import { createOTP, verifyOTP, resendOTP } from '../../../utils/otp';
import { OtpType } from '../../../entities/auth/otp';
import { User } from '../../../entities/auth/user';

type AuthResponse = {
  success: boolean;
  message?: string;
  userId?: string;
};

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

export class UserController {
  private static async validateUser(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await getAuthRepo().user.findFirst({ id: userId });

    if (!user) {
      return { success: false, message: 'Invalid user' };
    }
    return { success: true, message: 'Valid user' };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async initialize_seller_registration(email: string): Promise<AuthResponse> {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      return { success: false, message: 'Invalid email format' };
    }

    const existingUser = await getAuthRepo().user.findFirst({ email });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return { success: false, message: 'Email already registered' };
      }

      const result = await UserController.resend_2fa(existingUser.id, 'join');
      return result.success
        ? { success: true, userId: existingUser.id, message: result.message }
        : { success: false, message: result.message };
    }

    const user = await getAuthRepo().user.insert({
      email,
      roles: ['pending_seller'],
      emailVerified: false
    });

    const res = await UserController.create_2fa(user.id, 'join');

    if (!res.success) {
      return { success: false, message: res.message };
    }

    return { success: true, userId: user.id, message: res.message };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async create_2fa(userId: string, type: OtpType): Promise<AuthResponse> {
    const code = await createOTP(userId, type);
    if (!code) {
      return { success: false, message: 'Failed to create OTP' };
    }

    // TODO: Send verification email
    console.log(`Verification code ${code}`);
    return { success: true, message: code };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async verify_2fa(userId: string, code: string): Promise<AuthResponse> {
    const result = await verifyOTP(userId, code);
    return {
      success: result.success,
      message: result.message || 'Verification successful'
    };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async resend_2fa(userId: string, type: OtpType): Promise<AuthResponse> {
    const userResult = await UserController.validateUser(userId);
    if (!userResult.success) {
      return userResult;
    }

    const result = await resendOTP(userId, type);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    // TODO: Send verification email
    console.log(`New verification code ${result.code}`);
    return { success: true, message: result.message };
  }

  @BackendMethod({ allowed: true, apiPrefix: 'auth' })
  static async complete_seller_registration(
    userId: string,
    password: string
  ): Promise<AuthResponse> {
    if (!userId || !password) {
      return { success: false, message: 'Invalid request params' };
    }

    const passwordResult = passwordSchema.safeParse(password);

    if (!passwordResult.success) {
      return { success: false, message: 'Invalid password' };
    }

    const userResult = await UserController.validateUser(userId);
    if (!userResult.success) {
      return userResult;
    }

    const updatedUser = await getAuthRepo().user.update(userId, {
      password,
      emailVerified: true
    });

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
