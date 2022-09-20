// Regular Installments of EMI Payments for Premium


import { MongoClient } from "mongodb";
const fetch = require("node-fetch");
const crypto = require("crypto");
export default async function payPremiumByCC(req, res) {

  const url =
    "mongodb+srv://shivam:shivam@cluster0.auqwa.mongodb.net/disasterInsurance?retryWrites=true&w=majority";

  const client = await MongoClient.connect(url);

  const db = client.db();


  const userCardCollection = db.collection("userCreditCardDetails");
  const usersData = db.collection("usersData");

  const userData = await usersData.find({}).toArray();

  console.log(userData);

    userData.forEach(async (element) => {
      console.log(element)
    const url_payment = "https://api-sandbox.circle.com/v1/payments";
    const options_payment = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization:
          "Bearer QVBJX0tFWTo4ZDQwNjU1YzEyM2E0NjE1ZWM4YmM0OTc2ZWEwYWQ4YTo4NDQ3ZTVmNTNmYmQxN2U5YzJhN2I2Mzk3YThkYWI2ZA",
      },
      body: JSON.stringify({
        metadata: {
          email: "satoshi@circle.com",
          sessionId: "DE6FA86F60BB47B379307F851E238617",
          ipAddress: "244.28.239.130",
        },
        amount: {amount : element.premiumAmount, currency: "USD"} ,
        autoCapture: true,
        source: { id: '31391780-a2e9-40d5-a101-cc75a11c0d92', type: "card" },
        idempotencyKey: crypto.randomUUID(),
        keyId: "key1",
        verification: "none",
        description: "Payment",
        encryptedData:
          "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2J2bVVkNG5LZ3dkbExKVTlEdEFEK0p5c0VOTUxuOUlRUWVGWnZJUWEKMGgzQklpRFNRU0RMZmI0NEs2SXZMeTZRbm54bmFLcWx0MjNUSmtPd2hGWFIrdnNSMU5IbnVHN0lUNWJECmZzeVdleXlNK1JLNUVHV0thZ3NmQ2tWamh2NGloY29xUnlTTGtJbWVmRzVaR0tMRkJTTTBsTFNPWFRURQpiMy91eU1zMVJNb3ZiclNvbXkxa3BybzUveWxabWVtV2ZsU1pWQlhNcTc1dGc1YjVSRVIraXM5ckc0cS8KMXl0M0FOYXA3UDhKekFhZVlyTnVNZGhGZFhvK0NFMC9CQnN3L0NIZXdhTDk4SmRVUEV0NjA5WFRHTG9kCjZtamY0YUtMQ01xd0RFMkNVb3dPdE8vMzVIMitnVDZKS3FoMmtjQUQyaXFlb3luNWcralRHaFNyd3NKWgpIdEphQWVZZXpGQUVOaFo3Q01IOGNsdnhZVWNORnJuNXlMRXVGTkwwZkczZy95S3loclhxQ0o3UFo5b3UKMFVxQjkzQURKWDlJZjRBeVQ2bU9MZm9wUytpT2lLall4bG1NLzhlVWc3OGp1OVJ5T1BXelhyTzdLWTNHClFSWm8KPXc1dEYKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo",
      })}

    fetch(url_payment, options_payment)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error("error:" + err));
  })
    res.status(200).json({ message: "success" });

};

