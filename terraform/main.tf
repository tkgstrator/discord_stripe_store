resource "cloudflare_workers_kv_namespace" "kv_store" {
  account_id = var.account_id
  title      = "${var.kv_namespace}-${var.environment}"
}

resource "cloudflare_r2_bucket" "r2_bucket" {
  account_id = var.account_id
  name       = "${var.r2_bucket_name}-${var.environment}"
  location   = "APAC"
}

resource "cloudflare_d1_database" "d1_database" {
  account_id = var.account_id
  name       = "${var.d1_database_name}-${var.environment}"
}
