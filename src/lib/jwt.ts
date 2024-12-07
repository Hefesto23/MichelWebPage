import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "minha-chave-secreta";

export function generateToken(adminId: number) {
  return jwt.sign({ adminId }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error: unknown) {
    return error;
  }
}
