// Customers Pays Premium EMI  for disaster Insurance  via Credit Card Details

/* Request Body
{
    "walletId" : "5f9f1b9b9b9b9b9b9b9b9b9b", // Metamask public ID Used for Claim Processing Details
    "cardNumber" : "4007410000000006", 
    "CVV" : 123,
    "billingDetails": {
     "name": "Satoshi Nakamoto",
   "city": "Boston",
     "country": "US",
     "line1": "100 Money Street",
     "postalCode": "01234",
     "district": "MA"
   },   "metadata": {
     "email": "satoshi@circle.com",
     "sessionId": "xyz",
     "ipAddress": "244.28.239.130"
   },"expMonth": 1,
   "expYear": 2025,
   "amount" : {"amount": "200", "currency": "USD"}
}

// Hardcoded values are email, sessionId, IpAddress, and Currency : USD, Other values will be passed 
*/

/* Response Body {
    "status": "success",
    "message": "Premium EMI Paid Successfully , will be deducted every month {amount} from your card",}",
}
*/

const fetch = require("node-fetch");
const crypto = require("crypto");
const CIRCLE_API_KEY =
  "QVBJX0tFWTo4ZDQwNjU1YzEyM2E0NjE1ZWM4YmM0OTc2ZWEwYWQ4YTo4NDQ3ZTVmNTNmYmQxN2U5YzJhN2I2Mzk3YThkYWI2ZA";


import { MongoClient } from "mongodb";
export default async function payPremiumByCC(req, res) {

  const url_mongo =
    "mongodb+srv://shivam:shivam@cluster0.auqwa.mongodb.net/disasterInsurance?retryWrites=true&w=majority";

  const client = await MongoClient.connect(url_mongo);

  const db = client.db();

  const userCardCollection = db.collection("userCreditCardDetails");
  const userCollection = db.collection("usersData");

  const user = await userCollection.findOne({walletId : req.body.walletId});
  const premiumAmount = user.premiumAmount;
  console.log(premiumAmount)
  console.log(user)

  const url = "https://api-sandbox.circle.com/v1/cards";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: "Bearer " + CIRCLE_API_KEY,
    },
    body: JSON.stringify({
      billingDetails: {
        name: "Satoshi Nakamoto",
        city: "Boston",
        line1: "100 Money Street",
        country: "US",
        line2: "Suite 1",
        district: "MA",
        postalCode: "01234",
      },
      metadata: {
        email: "satoshi@circle.com",
        sessionId: "DE6FA86F60BB47B379307F851E238617",
        ipAddress: "244.28.239.130",
      },
      idempotencyKey: crypto.randomUUID(),
      keyId: "key1",
      encryptedData:
        "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2J2bVVkNG5LZ3dkbExKVTlEdEFEK0p5c0VOTUxuOUlRUWVGWnZJUWEKMGgzQklpRFNRU0RMZmI0NEs2SXZMeTZRbm54bmFLcWx0MjNUSmtPd2hGWFIrdnNSMU5IbnVHN0lUNWJECmZzeVdleXlNK1JLNUVHV0thZ3NmQ2tWamh2NGloY29xUnlTTGtJbWVmRzVaR0tMRkJTTTBsTFNPWFRURQpiMy91eU1zMVJNb3ZiclNvbXkxa3BybzUveWxabWVtV2ZsU1pWQlhNcTc1dGc1YjVSRVIraXM5ckc0cS8KMXl0M0FOYXA3UDhKekFhZVlyTnVNZGhGZFhvK0NFMC9CQnN3L0NIZXdhTDk4SmRVUEV0NjA5WFRHTG9kCjZtamY0YUtMQ01xd0RFMkNVb3dPdE8vMzVIMitnVDZKS3FoMmtjQUQyaXFlb3luNWcralRHaFNyd3NKWgpIdEphQWVZZXpGQUVOaFo3Q01IOGNsdnhZVWNORnJuNXlMRXVGTkwwZkczZy95S3loclhxQ0o3UFo5b3UKMFVxQjkzQURKWDlJZjRBeVQ2bU9MZm9wUytpT2lLall4bG1NLzhlVWc3OGp1OVJ5T1BXelhyTzdLWTNHClFSWm8KPXc1dEYKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo",
      expMonth: 1,
      expYear: 2020,
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
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
          amount: { currency: "USD", amount: premiumAmount },
          autoCapture: true,
          source: { id: json.data.id, type: "card" },
          idempotencyKey: crypto.randomUUID(),
          keyId: "key1",
          verification: "none",
          description: "Payment",
          encryptedData:
            "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2J2bVVkNG5LZ3dkbExKVTlEdEFEK0p5c0VOTUxuOUlRUWVGWnZJUWEKMGgzQklpRFNRU0RMZmI0NEs2SXZMeTZRbm54bmFLcWx0MjNUSmtPd2hGWFIrdnNSMU5IbnVHN0lUNWJECmZzeVdleXlNK1JLNUVHV0thZ3NmQ2tWamh2NGloY29xUnlTTGtJbWVmRzVaR0tMRkJTTTBsTFNPWFRURQpiMy91eU1zMVJNb3ZiclNvbXkxa3BybzUveWxabWVtV2ZsU1pWQlhNcTc1dGc1YjVSRVIraXM5ckc0cS8KMXl0M0FOYXA3UDhKekFhZVlyTnVNZGhGZFhvK0NFMC9CQnN3L0NIZXdhTDk4SmRVUEV0NjA5WFRHTG9kCjZtamY0YUtMQ01xd0RFMkNVb3dPdE8vMzVIMitnVDZKS3FoMmtjQUQyaXFlb3luNWcralRHaFNyd3NKWgpIdEphQWVZZXpGQUVOaFo3Q01IOGNsdnhZVWNORnJuNXlMRXVGTkwwZkczZy95S3loclhxQ0o3UFo5b3UKMFVxQjkzQURKWDlJZjRBeVQ2bU9MZm9wUytpT2lLall4bG1NLzhlVWc3OGp1OVJ5T1BXelhyTzdLWTNHClFSWm8KPXc1dEYKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo",
        }),
      };


      fetch(url_payment, options_payment)
        .then((res_body) => res_body.json())      
        .then((json_payment) => {
           const query = { walletId: req.body.walletId };
           const update = {
             $set: {
               walletId: req.body.walletId,
               metadata: req.body.metadata,
               source: { id: json.data.id, type: "card" },
               encryptedData: "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2J2bVVkNG5LZ3dkbExKVTlEdEFEK0p5c0VOTUxuOUlRUWVGWnZJUWEKMGgzQklpRFNRU0RMZmI0NEs2SXZMeTZRbm54bmFLcWx0MjNUSmtPd2hGWFIrdnNSMU5IbnVHN0lUNWJECmZzeVdleXlNK1JLNUVHV0thZ3NmQ2tWamh2NGloY29xUnlTTGtJbWVmRzVaR0tMRkJTTTBsTFNPWFRURQpiMy91eU1zMVJNb3ZiclNvbXkxa3BybzUveWxabWVtV2ZsU1pWQlhNcTc1dGc1YjVSRVIraXM5ckc0cS8KMXl0M0FOYXA3UDhKekFhZVlyTnVNZGhGZFhvK0NFMC9CQnN3L0NIZXdhTDk4SmRVUEV0NjA5WFRHTG9kCjZtamY0YUtMQ01xd0RFMkNVb3dPdE8vMzVIMitnVDZKS3FoMmtjQUQyaXFlb3luNWcralRHaFNyd3NKWgpIdEphQWVZZXpGQUVOaFo3Q01IOGNsdnhZVWNORnJuNXlMRXVGTkwwZkczZy95S3loclhxQ0o3UFo5b3UKMFVxQjkzQURKWDlJZjRBeVQ2bU9MZm9wUytpT2lLall4bG1NLzhlVWc3OGp1OVJ5T1BXelhyTzdLWTNHClFSWm8KPXc1dEYKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo"
             }
           };
           const options = { upsert: true };
           console.log(json_payment);
           userCardCollection.updateOne(query, update, options);
            res.status(200).json({ status: "success", message: "Premium EMI Paid Successfully , Amount of $" +json_payment.data.amount.amount +" will be deducted from your card every month 30th " });
        })
        .catch((err) => console.error("error:" + err));
    })
    .catch((err) => console.error("error:" + err));
}