output "kv_namespace_id" {
  value = cloudflare_workers_kv_namespace.kv_store.id
}

output "r2_bucket_id" {
  value = cloudflare_r2_bucket.r2_bucket.id
}

output "d1_database_id" {
  value = cloudflare_d1_database.d1_database.id
}
