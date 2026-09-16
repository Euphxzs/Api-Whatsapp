import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedValue: string): Promise<boolean> {
  return bcrypt.compare(password, hashedValue);
}
