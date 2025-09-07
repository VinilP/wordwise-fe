variable "aws_region" {
  description = "The AWS region where the resources will be deployed."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment for the deployment (e.g., dev, staging, prod)."
  type        = string
  default     = "prod"
}

variable "bucket_name" {
  description = "The name of the S3 bucket for static website hosting."
  type        = string
}

variable "custom_domain" {
  description = "The custom domain name for the website."
  type        = string
}

variable "certificate_arn" {
  description = "The ARN of the SSL certificate for the custom domain."
  type        = string
}

variable "cloudfront_aliases" {
  description = "The aliases for the CloudFront distribution."
  type        = list(string)
}