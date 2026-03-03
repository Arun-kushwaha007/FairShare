terraform {
  required_version = ">= 1.6.0"
}

provider "aws" {
  region = var.aws_region
}
