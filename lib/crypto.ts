import crypto from 'crypto';

export function encrypt(text: string): string {
  const ALGORITHM = 'aes-256-gcm';
  const IV_LENGTH = 12; // Standard for GCM
  const AUTH_TAG_LENGTH = 16;
  const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
  
  if (!text) return "";
  
  // DEBUG: Check length in your Vercel logs
  console.log("DEBUG: Key Length is:", KEY.length);
  
  if (KEY.length !== 32) throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // We store the IV and AuthTag along with the encrypted data
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(hash: string): string {
  if (!hash) return "";
  
  const [ivHex, authTagHex, encryptedHex] = hash.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
