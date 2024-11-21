export const generateOtp = (): string => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateOtpExpiry = (): Date => {
    // Set OTP expiry time to 3 minutes from now
    return new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
};
