import { Router } from 'express';
import { z } from 'zod';
import prisma  from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth";

export const productsRouter = Router();

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  priceCents: z.number().int().positive(),
  currency: z.string().length(3).default("USD"),
});

productsRouter.get("/", async(_req, res) => {
  const products = await prisma.product.findMany({
    where: { isActive: true},
    orderBy: { createdAt: "desc"},
    select: {
      id: true, name: true, slug: true,
      description: true, priceCents: true, currency: true,
    },
  });
  res.json(products);
});

productsRouter.get("/:slug", async(req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, isActive: true },
    select: {
      id: true, name: true, slug: true,
      description: true, priceCents: true, currency: true,
    },
  });
  if(!product) return res.status(404).json({ error: "Not Found"});
  res.json(product);
});

productsRouter.post("/", async(req, res) => {
  const parsed = createProductSchema.safeParse(req.body);
  if(!parsed.success) {
    return res.status(404).json({ error: parsed.error.flatten() });
  }
  try {
    const product = await prisma.product.create({ data: parsed.data });
    res.status(201).json(product);
  } catch (e: any) {
    if (e.code == "P2002") {
      return res.status(409).json({ error: "Slug already exists"});
    }
    throw e;
  }
});