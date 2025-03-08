#!/bin/zsh

rm prisma/migrations/*.sql
bunx wrangler d1 migrations create discord-stripe-database-dev create_tables --env dev
bunx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output prisma/migrations/0001_create_tables.sql
bunx wrangler d1 migrations apply discord-stripe-database-dev --env dev
