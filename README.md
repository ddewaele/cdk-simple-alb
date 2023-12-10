# CdkSimpleAlbStack

## Overview
`CdkSimpleAlbStack` is an AWS Cloud Development Kit (CDK) stack designed to create a scalable and accessible web application infrastructure on AWS. It automates the provisioning of several AWS services and resources, making it easier to set up and manage the infrastructure for a web application.

```
                       Internet
                           |
                           |
                   +---------------+
                   |   Load        |
                   |  Balancer     |
                   +---------------+
                           |
                           |
                    +------v------+
                    |             |
                    |   Target    |
                    |   Groups    |
                    |             |
                    +------^------+
                           |
                           |
                    +------v--------+
                    |               |
                    |  AutoScaling  |
                    |               |
                    +---------------+
                     /            \
                    /              \
           +--------v-+            +--v-------+
           |   EC2    |            |   EC2    |
           | Instance |            | Instance |
           +----------+            +----------+


```

## Details
The stack initiates by setting up a Virtual Private Cloud (VPC) with a configuration to utilize up to two Availability Zones, ensuring high availability and fault tolerance.

Within this VPC, it deploys an internet-facing Application Load Balancer (ALB). This ALB is configured to listen to HTTP requests on port 80. The ALB acts as the entry point for incoming web traffic, distributing it across the instances in the target group.

The stack also creates an Application Target Group and associates it with the ALB's listener. This target group is designed to handle web traffic on port 80 and uses EC2 instances as its targets. 

Furthermore, the stack establishes an AutoScaling Group within the VPC. This group is configured with EC2 `t2.micro` instances, using the latest Amazon Linux 2023 image. The AutoScaling Group is set to have a minimum of one and a maximum of three instances, with the desired capacity starting at one. It also utilizes a custom user data script to bootstrap these instances. The AutoScaling Group automatically adjusts the number of EC2 instances based on CPU utilization, maintaining efficient operation under varying loads.

Finally, the EC2 instances in the AutoScaling Group are added to the Application Target Group. This ensures that the ALB can distribute incoming traffic among these instances, providing a scalable and resilient web hosting environment.

## Deployment
To deploy this stack, AWS CDK needs to be installed and configured with appropriate AWS credentials. The stack is deployed by executing the `cdk deploy` command in the environment where the stack code is located. This command builds and deploys the resources defined in the stack to the AWS account.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
