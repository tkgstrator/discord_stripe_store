variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "script_name" {
  type        = string
  description = "The name of the Cloudflare Worker script"
}
