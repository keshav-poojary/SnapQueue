module "snap_queue_dynamo_infrastructure_development" {
  source = "./dynamo-infra"
  environment = "dev"
}

module "snap_queue_dynamo_infrastructure_production" {
  source = "./dynamo-infra"
  environment = "prod"
}