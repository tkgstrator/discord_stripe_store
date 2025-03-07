variable "environment" {
  type        = string
  description = "The environment to deploy the Cloudflare Worker script"
  validation {
    condition     = can(regex("^(dev|staging|prod)$", var.environment))
    error_message = "The environment must be one of dev, staging, or prod"
  }
}

variable "api_token" {
  type        = string
  sensitive   = true
  description = "The Cloudflare API token"
}

variable "account_id" {
  type        = string
  description = "The ID of the Cloudflare account"
}

variable "zone_id" {
  type        = string
  description = "The ID of the Cloudflare zone"
}

# variable "script_name" {
#   type        = string
#   description = "The name of the Cloudflare Worker script"
# }

variable "d1_database_name" {
  type        = string
  description = "The name of the Cloudflare Durable Object database"
}

variable "r2_bucket_name" {
  type        = string
  description = "The name of the Cloudflare R2 bucket"
}

variable "kv_namespace" {
  type        = string
  description = "The name of the Cloudflare Workers KV namespace"
}

variable "compatibility_date" {
  type        = string
  description = "The compatibility date for the Cloudflare Worker script"
}

variable "compatibility_flags" {
  type        = list(string)
  description = "The compatibility flags for the Cloudflare Worker script"
}
