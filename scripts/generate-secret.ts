import { randomBytes } from 'crypto';

// Generate a secure random string
const generateSecret = (): string => {
  return randomBytes(32).toString('hex');
};

// Generate both access and refresh secrets
const accessSecret = generateSecret();
const refreshSecret = generateSecret();

console.log('JWT_ACCESS_SECRET:', accessSecret);
console.log('JWT_REFRESH_SECRET:', refreshSecret); 