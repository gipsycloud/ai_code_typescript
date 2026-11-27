# digital-tools-shop
# npm publish --registry=https://npm.pkg.github.com ``for uploading npm package``

docker compose exec app npx prisma migrate dev --name init
docker compose run --rm app npx prisma generate

docker compose up -d --build
# or
docker build -t myapp:1.0 . && docker run -d -p 3000:3000 myapp:1.0

docker run -d \
  --name digital-tools-app \
  -p 3000:3000 \
  --restart unless-stopped \
  YOUR_DOCKERHUB_USERNAME/digital-tools-shop:latest

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"supersecret123"}'


curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Logo Maker","slug":"logo-maker","description":"Design logos fast","priceCents":1900}'

docker compose exec db psql -U postgres -d digital_shop \
  -c "UPDATE \"User\" SET role='ADMIN' WHERE email='admin@example.com';"  
