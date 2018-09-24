<h2>Instructions on how to use this loopback connector with COS + APIC </h2>

<p><i>Prerequisites: </i> 
	<ul>
			<li> 1) an APIC app set up</li>
			<li> 2) an instance of Cloud Object Storage created</li>
			<li> 3) service credentials generated for your COS instance </li>
			<li> 4) an instance of Key Protect created </li>
			<li> 5) a Key Protect root key created inside</li>
			<li> 6) A bucket created inside your instance of COS </li>
	</ul>

<p>Add a new datasource to your APIC app by editing the <b>server/datasources.json</b> file</p>

<p>The new datasource added must be created in the following format for the cos connector to work </p>

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
