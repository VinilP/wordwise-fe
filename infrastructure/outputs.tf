output "s3_bucket_url" {
  value = module.s3.bucket_url
}

output "cloudfront_distribution_domain_name" {
  value = module.cloudfront.domain_name
}

output "acm_certificate_arn" {
  value = module.acm.certificate_arn
}

output "route53_record_name" {
  value = module.route53.record_name
}