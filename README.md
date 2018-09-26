# loopback-connector-cos

IBM Cloud Object Storage connector for LoopBack

##Instructions on how to use this loopback connector with COS + APIC

_Prerequisites_

1. an APIC app set up<
2. an instance of Cloud Object Storage created
3. service credentials generated for your COS instance 
4. an instance of Key Protect created
5. a Key Protect root key created inside
6. a bucket created inside your instance of COS


Add a new datasource to your APIC app by editing the **server/datasources.json** file

The new datasource added must be created in the following format for the cos connector to work

```
"cos": {
	"name": "cos",
	"connector": "loopback-connector-cos",
	"endpoint": "<endpoint-of-your-COS-instance>",
	"apiKeyId": "<api-key-of-your-COS-instance>",
	"serviceInstanceId": "<resource-instance-id-of-COS>",
	"IBMSSEKPCustomerRootKeyCrn": "<root-key-crn>",
	"location": "<LocationConstraint-of-bucket-that-will-be-generated>",
	"bucket": "<name-of-your-cos-bucket>"
}
```
