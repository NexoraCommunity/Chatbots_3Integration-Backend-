#!/bin/sh
set -e

echo "🚀 Application Starting..."
echo "Waiting for database to be ready..."
sleep 5

echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

echo "✅ Starting NestJS application..."
exec node dist/main.js
