terraform {
  backend "s3" {
    bucket = "snap-queue-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}