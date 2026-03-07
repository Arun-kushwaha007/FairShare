terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source             = "../../modules/vpc"
  name_prefix        = var.environment
  cidr_block         = var.vpc_cidr
  availability_zones = var.availability_zones
}

module "logs" {
  source         = "../../modules/cloudwatch_logs"
  name           = "/fairshare/${var.environment}/backend"
  retention_days = 14
}

module "ecs_cluster" {
  source = "../../modules/ecs_cluster"
  name   = "fairshare-${var.environment}"
}

module "redis" {
  source      = "../../modules/redis"
  name_prefix = var.environment
  subnet_ids  = module.vpc.private_subnet_ids
  vpc_id      = module.vpc.vpc_id
}

module "s3_storage" {
  source      = "../../modules/s3_storage"
  bucket_name = var.s3_bucket_name
}

module "backend_service" {
  source            = "../../modules/ecs_service_backend"
  name_prefix       = var.environment
  cluster_id        = module.ecs_cluster.cluster_id
  cluster_name      = module.ecs_cluster.cluster_name
  vpc_id            = module.vpc.vpc_id
  subnet_ids        = module.vpc.private_subnet_ids
  container_image   = var.backend_image
  desired_count     = var.backend_desired_count
  min_capacity      = var.backend_min_capacity
  max_capacity      = var.backend_max_capacity
  health_check_path = "/health"
  log_group_name    = module.logs.log_group_name
  aws_region        = var.aws_region
  environment = {
    NODE_ENV = var.environment
    REDIS_URL = "redis://${module.redis.redis_endpoint}:6379"
  }
}
