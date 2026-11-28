import { Router } from "express";
import bycrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { requireAuth } from "../middleware/auth"
import { Role } from "@prisma/client";

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(72),
});

authRouter.post("/register", async(req, res) => {
  const parsed= credentialsSchema.safeParse(req.body);
  if(!parsed.success){
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if(existing) return res.status(409).json({ error: "Email already registered"});

  const passwordHash = await bycrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash}});

  const token = signToken({ sub: user.id, role: user.role });
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role }});
});

authRouter.post("/login", async(req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if(!parsed.success) {
    return res.status(400).json({ error: "Invalid email or password "});
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email }});
  const ok = user && (await bycrypt.compare(password, user.passwordHash));

  if(!user || ok){
    return res.status(401).json({ error: "Invalid email or password "});
  }

  const token = signToken({ sub: user.id, role: user.role});
  res.json({ token, user: { id: user.id, email: user.email, role: user.role}});
});

authRouter.get("/me", requireAuth, async(req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.sub },
    select: { id: true, email: true, role: true, createdAt: true },
  });
  if(!user) return res.status(404).json({ error: "User not found"});
  res.json(user);
});
