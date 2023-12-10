import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as fs from 'fs';


export class CdkSimpleAlbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2 // Default is all AZs in the region
    });

    // Create an Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'MyALB', {
      vpc,
      internetFacing: true
    });

    // Add an HTTP Listener
    const listener = alb.addListener('MyListener', {
      port: 80
    });

    // Create a Target Group
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'MyTargetGroup', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.INSTANCE
    });

    // Associate Target Group with Listener
    listener.addTargetGroups('TargetGroup', {
      targetGroups: [targetGroup]
    });

    const userDataScript = fs.readFileSync('./lib/ec2-user-data.sh', 'utf-8');


    // Create an AutoScaling Group with a single EC2 instance
    const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'MyAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux2023({}),
      desiredCapacity: 1,
      minCapacity: 1,
      maxCapacity: 3,
      userData: ec2.UserData.custom(userDataScript),
      associatePublicIpAddress: true, // Ensure instances have a public IP
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC // Use public subnets
      }
    });

    // Setup autoscaling based on CPU utilization
    autoScalingGroup.scaleOnCpuUtilization('KeepSpareCPU', {
      targetUtilizationPercent: 50
    });

    // Add AutoScaling Group to the Target Group
    targetGroup.addTarget(autoScalingGroup);



  }
}
