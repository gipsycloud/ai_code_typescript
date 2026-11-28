import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD ?? "customer12345";

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@example.com",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: await bcrypt.hash(customerPassword, 12),
      role: "CUSTOMER",
    },
  });

  const products = [
    {
      name: "Invoice Generator Pro",
      slug: "invoice-generator-pro",
      description: "Create professional PDF invoices in seconds.",
      priceCents: 2900,
      fileKey: "products/invoice-generator-pro.zip",
    },
    {
      name: "Logo Maker",
      slug: "logo-maker",
      description: "Design clean logos with ready-made templates.",
      priceCents: 1900,
      fileKey: "products/logo-maker.zip",
    },
    {
      name: "SEO Audit Toolkit",
      slug: "seo-audit-toolkit",
      description: "Scan your site and get a prioritized list of SEO fixes.",
      priceCents: 4900,
      fileKey: "products/seo-audit-toolkit.zip",
    },
    {
      name: "Password Vault Lite",
      slug: "password-vault-lite",
      description: "Lightweight offline password manager.",
      priceCents: 1500,
      fileKey: null, // license-key-only product, no download
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        fileKey: p.fileKey,
      },
      create: p,
    });
  }

  console.log("Seed complete: 2 users, 4 products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(()=> prisma.$disconnect());