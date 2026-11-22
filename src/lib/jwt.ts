import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is not set");

export type TokenPayload = { sub: string; role: "CUSTOMER" | "ADMIN"};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, secret as string, { expiresIn: "7d"});
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, secret as string) as TokenPayload
}