import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import { aws_elasticloadbalancingv2 as elbv2 } from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

interface TransformedStackProps extends cdk.StackProps {
    readonly appName: string;
    readonly envName: string;
}

export class TransformedStack extends cdk.Stack {
    public readonly template: cdk.cloudformation_include.CfnInclude;
    public readonly appName: string;
    public readonly envName: string;

    constructor (scope: cdk.App, id: string, props: TransformedStackProps) {
        super(scope, id, props);
        this.template = new cdk.cloudformation_include.CfnInclude(this, 'Template', {
            templateFile: path.join('.build', 'in.yml'),
        });
        this.appName = props.appName;
        this.envName = props.envName;
        this.transformPublicNetworkLoadBalancer();
    }

    /**
     * transformPublicNetworkLoadBalancer removes the "Subnets" properties from the NLB,
     * and adds a SubnetMappings with predefined elastic IP addresses.
     */
    transformPublicNetworkLoadBalancer() {
        const elasticIPs = [new ec2.CfnEIP(this, 'ElasticIP1'), new ec2.CfnEIP(this, 'ElasticIP2')];
        const publicSubnets = cdk.Fn.importValue(`${this.appName}-${this.envName}-PublicSubnets`);

        // Apply the override.
        const nlb = this.template.getResource("PublicNetworkLoadBalancer") as elbv2.CfnLoadBalancer;
        nlb.addDeletionOverride('Properties.Subnets');
        nlb.subnetMappings = [{
            allocationId: elasticIPs[0].attrAllocationId,
            subnetId: cdk.Fn.select(0, cdk.Fn.split(",", publicSubnets)),
        }, {
            allocationId: elasticIPs[1].attrAllocationId,
            subnetId: cdk.Fn.select(1, cdk.Fn.split(",", publicSubnets)),
        }]
    }
}