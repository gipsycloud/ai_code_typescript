# digital-tools-shop
# npm publish --registry=https://npm.pkg.github.com ``for uploading npm package``

docker compose exec app npx prisma migrate dev --name init
docker compose run --rm app npx prisma generate

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"supersecret123"}'


curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Logo Maker","slug":"logo-maker","description":"Design logos fast","priceCents":1900}'

docker compose exec db psql -U postgres -d digital_shop \
  -c "UPDATE \"User\" SET role='ADMIN' WHERE email='admin@example.com';"  
