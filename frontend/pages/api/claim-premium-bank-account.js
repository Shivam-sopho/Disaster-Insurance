// Payment to Bank Account using Accounts API powered by Circle

/*


Request{

    // Bank Account Details
    {
        "walletId" : "5f9f1b9b9b9b9b9b9b9b9b9b", // Metamask public ID Used for Claim Processing Details
    }
}
}
Response Body{
    {
    "data": {
        "id": "5e4c1b20-d0e2-4326-9d20-4e635356b62a",
        "amount": {
            "amount": "150.00",
            "currency": "USD"
        },
        "status": "pending",
        "sourceWalletId": "1000870888",
        "destination": {
            "type": "wire",
            "id": "cfc2d7f9-6936-46bd-9ac5-3b0e6b688504",
            "name": "JPMORGAN CHASE BANK, NA ****6789"
        },
        "createDate": "2022-09-18T15:11:50.291Z",
        "updateDate": "2022-09-18T15:11:50.291Z"
    }
}
}
// Below is for backend reference




*/

const fetch = require("node-fetch");
const crypto = require("crypto");

import { MongoClient } from "mongodb";
const CIRCLE_API_KEY =
  "QVBJX0tFWTo4ZDQwNjU1YzEyM2E0NjE1ZWM4YmM0OTc2ZWEwYWQ4YTo4NDQ3ZTVmNTNmYmQxN2U5YzJhN2I2Mzk3YThkYWI2ZA";

const WALLET_ID = "1000870888";
const url = "https://api-sandbox.circle.com/v1/banks/wires";



export default async function transfer(req, res) {

// Create Wire Account for the Insurance Company with your API Key


  const url_mongo =
    "mongodb+srv://shivam:shivam@cluster0.auqwa.mongodb.net/disasterInsurance?retryWrites=true&w=majority";

  const client = await MongoClient.connect(url_mongo);

  const db = client.db();

  const userCollection = db.collection("usersData");

  const user = await userCollection.findOne({walletId : req.body.walletId});
  const maxSumInsured = user.maxSumInsured;
  console.log(user);
const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization: "Bearer "+ CIRCLE_API_KEY,
  },
  body: JSON.stringify({
    billingDetails: user.bankDetails.billingDetails,
    bankAddress: user.bankDetails.bankAddress,
    idempotencyKey: crypto.randomUUID(),
    accountNumber: user.bankDetails.accountNumber,
    routingNumber: user.bankDetails.routingNumber,
  }),
};

await fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));

const url_payouts = "https://api-sandbox.circle.com/v1/payouts";
const options_payouts = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization:
      "Bearer " + CIRCLE_API_KEY,
  },
  body: JSON.stringify({
    source: { type: "wallet", id: WALLET_ID },
    destination: { type: "wire", id: "cfc2d7f9-6936-46bd-9ac5-3b0e6b688504" },
    amount: { currency: "USD", amount: maxSumInsured },
    metadata: { beneficiaryEmail: "chotu.kv@gmail.com" },
    idempotencyKey: crypto.randomUUID(),
  }),
};

await fetch(url_payouts, options_payouts)
  .then((res) => res.json())
  .then((json) => res.status(200).json(json))
  .catch((err) => console.error("error:" + err));

}