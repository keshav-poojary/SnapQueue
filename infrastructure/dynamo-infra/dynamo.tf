provider "aws" {
  region = "us-east-1"
}

resource "aws_dynamodb_table" "tenant_table" {
  name         = "tenant-table-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "tenantId"

  attribute {
    name = "tenantId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "queue_table" {
  name         = "queue-table-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "queueId"

  attribute {
    name = "queueId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "job_table" {
  name         = "job-table-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "jobId"

  attribute {
    name = "jobId"
    type = "S"
  }

}