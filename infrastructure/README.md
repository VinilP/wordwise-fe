# Frontend Infrastructure Terraform

This project contains Terraform configurations for deploying frontend infrastructure on AWS. It sets up a static website hosted on S3, with a CloudFront distribution for global content delivery and HTTPS support. Additionally, it manages custom domain and SSL certificate configurations using AWS Route 53 and AWS Certificate Manager.

## Project Structure

```
frontend-infra-terraform
├── modules
│   ├── s3
│   │   └── main.tf          # S3 bucket configuration for static website hosting
│   ├── cloudfront
│   │   └── main.tf          # CloudFront distribution configuration
│   ├── acm
│   │   └── main.tf          # ACM configuration for SSL certificates
│   ├── route53
│   │   └── main.tf          # Route 53 configuration for DNS management
│   └── variables.tf          # Input variables for modules
├── main.tf                   # Entry point for Terraform configuration
├── variables.tf              # Global input variables for the project
├── outputs.tf                # Outputs of the Terraform configuration
├── provider.tf               # AWS provider configuration
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Install Terraform**: Ensure you have Terraform installed on your machine. You can download it from the [Terraform website](https://www.terraform.io/downloads.html).

2. **Configure AWS Credentials**: Set up your AWS credentials using the AWS CLI or by creating a `~/.aws/credentials` file.

3. **Clone the Repository**: Clone this repository to your local machine.

   ```
   git clone <repository-url>
   cd frontend-infra-terraform
   ```

4. **Modify Variables**: Update the `variables.tf` file with your desired configuration, including AWS region, bucket names, and custom domain.

5. **Initialize Terraform**: Run the following command to initialize the Terraform configuration.

   ```
   terraform init
   ```

6. **Plan the Deployment**: Generate an execution plan to see what resources will be created.

   ```
   terraform plan
   ```

7. **Apply the Configuration**: Deploy the infrastructure by applying the Terraform configuration.

   ```
   terraform apply
   ```

8. **Access Your Website**: Once the deployment is complete, you can access your static website using the S3 bucket URL or the CloudFront distribution domain.

## Outputs

After deployment, the following outputs will be available:

- S3 Bucket URL
- CloudFront Distribution Domain Name

## Additional Information

For more details on each module, refer to the respective `main.tf` files within the `modules` directory.