import { OtpType } from '../../entities/auth/otp';
import { generateRandomOTP, getAuthRepo } from '../../index';

/**
 * Generates and stores a new OTP (One-Time Password) for a user.
 * @param userId - The unique identifier of the user.
 * @param type - The category of OTP verification (e.g., join, auth, reset).
 * @param expiryMinutes - Duration in minutes before the OTP expires (default is 30 minutes).
 * @returns A Promise that resolves to the generated OTP code as a string.
 */
export async function createOTP(
  userId: string,
  type: OtpType,
  expiryMinutes: number = 30
): Promise<string> {
  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  const existingOTP = await getAuthRepo().otp.findFirst({
    userId,
    type
  });

  if (existingOTP) {
    await getAuthRepo().otp.update(existingOTP.id, {
      code,
      expiresAt
    });
  } else {
    await getAuthRepo().otp.insert({
      userId,
      code,
      type,
      expiresAt
    });
  }

  return code;
}

/**
 * Validates a user's OTP code.
 * @param userId - The unique identifier of the user.
 * @param code - The OTP code to be validated.
 * @returns A Promise that resolves to an object containing:
 *  - success: A boolean indicating if the verification was successful.
 *  - verification: A boolean indicating if the code was marked as verified.
 *  - message: An optional error message if the verification failed.
 */
export async function verifyOTP(
  userId: string,
  code: string
): Promise<{
  success: boolean;
  message?: string;
}> {
  if (!userId || !code?.length) {
    return { success: false, message: 'Invalid request params' };
  }

  const res = await getAuthRepo().otp.findFirst({
    userId,
    code,
    verified: false
  });

  if (!res || res.expiresAt <= new Date()) {
    return { success: false, message: 'Invalid verification code' };
  }

  await getAuthRepo().otp.delete(res.id);

  return { success: true, message: 'Verified' };
}

/**
 * Resends an OTP code to a user.
 * @param userId - The unique identifier of the user.
 * @param type - The category of OTP verification (e.g., join, auth, reset).
 * @returns A Promise that resolves to an object containing:
 *  - success: A boolean indicating if the resend was successful.
 *  - code: The newly generated OTP code as a string.
 *  - message: An optional error message if the resend failed.
 */
export async function resendOTP(
  userId: string,
  type: OtpType
): Promise<{
  success: boolean;
  code?: string;
  message?: string;
}> {
  if (!userId) {
    return { success: false, message: 'Invalid user ID' };
  }

  const existingOTP = await getAuthRepo().otp.findFirst({
    userId,
    type,
    verified: false
  });

  if (!existingOTP) {
    return { success: false, message: 'No pending verification found' };
  }

  const lastResendTime = existingOTP.updatedAt || existingOTP.createdAt;
  const timeSinceLastResend = Date.now() - lastResendTime.getTime();

  if (timeSinceLastResend < 60 * 1000) {
    return { success: false, message: 'Please wait before requesting another code' };
  }

  const code = generateRandomOTP();

  await getAuthRepo().otp.update(existingOTP.id, {
    code,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
  });

  return { success: true, code };
}
