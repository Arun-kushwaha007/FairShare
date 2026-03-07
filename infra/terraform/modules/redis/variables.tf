variable "name_prefix" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

variable "node_type" {
  type    = string
  default = "cache.t4g.micro"
}
