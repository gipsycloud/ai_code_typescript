#!/bin/sh
set -e
echo "Running migrations..."
npx prisma migrate deploy   # replace with your migrate command
echo "Starting app..."
exec "$@"