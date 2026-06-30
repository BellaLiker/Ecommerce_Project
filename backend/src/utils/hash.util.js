import bcrypt from "bcrypt";

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

export const hashPassword = (plain) => bcrypt.hash(plain, ROUNDS);
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);
