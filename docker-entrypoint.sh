#!/bin/sh
set -e

echo "[entrypoint] Menunggu database tersedia & menjalankan migrasi..."

i=0
until npx prisma migrate deploy; do
  i=$((i + 1))
  if [ "$i" -ge 10 ]; then
    echo "[entrypoint] Database tidak tersedia setelah 10 percobaan."
    exit 1
  fi
  echo "[entrypoint] Menunggu database... (percobaan $i/10)"
  sleep 5
done

echo "[entrypoint] Seed akun admin..."
npx tsx prisma/seed.ts

echo "[entrypoint] Memulai Next.js..."
exec npm run start
