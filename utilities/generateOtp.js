import crypto from 'crypto';

export const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  return { otp, hashedOtp };
};
