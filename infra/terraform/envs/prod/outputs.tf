output "backend_url" {
  value = module.backend_service.load_balancer_dns
}

output "redis_endpoint" {
  value = module.redis.redis_endpoint
}

output "s3_bucket" {
  value = module.s3_storage.bucket_name
}
