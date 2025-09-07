variable "s3_bucket_name" {
  description = "The name of the S3 bucket for static website hosting"
  type        = string
}

variable "cloudfront_distribution_name" {
  description = "The name of the CloudFront distribution"
  type        = string
}

variable "custom_domain" {
  description = "The custom domain name for the website"
  type        = string
}

variable "acm_certificate_arn" {
  description = "The ARN of the ACM certificate for the custom domain"
  type        = string
}

variable "route53_zone_id" {
  description = "The Route 53 hosted zone ID for the custom domain"
  type        = string
}

variable "environment" {
  description = "The environment for the deployment (e.g., dev, prod)"
  type        = string
  default     = "dev"
}