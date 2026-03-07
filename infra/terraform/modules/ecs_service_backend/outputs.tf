output "service_name" {
  value = aws_ecs_service.this.name
}

output "load_balancer_dns" {
  value = aws_lb.this.dns_name
}

output "service_security_group_id" {
  value = aws_security_group.service.id
}
