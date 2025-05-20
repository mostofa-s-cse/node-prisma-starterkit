const crypto = require('crypto');

// Generate a secure random string
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate both access and refresh secrets
const accessSecret = generateSecret();
const refreshSecret = generateSecret();

console.log('JWT_ACCESS_SECRET:', accessSecret);
console.log('JWT_REFRESH_SECRET:', refreshSecret); 