variable "name_prefix" {
  type = string
}

variable "cluster_id" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "container_image" {
  type = string
}

variable "container_port" {
  type    = number
  default = 3001
}

variable "desired_count" {
  type    = number
  default = 1
}

variable "min_capacity" {
  type    = number
  default = 1
}

variable "max_capacity" {
  type    = number
  default = 3
}

variable "health_check_path" {
  type    = string
  default = "/health"
}

variable "log_group_name" {
  type = string
}

variable "environment" {
  type    = map(string)
  default = {}
}

variable "aws_region" {
  type = string
}
