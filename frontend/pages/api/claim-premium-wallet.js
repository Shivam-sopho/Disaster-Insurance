// Payout of Insurance Amount using Wallet

/*
Request 
{

{
    "walletId" : "5f9f1b9b9b9b9b9b9b9b9b9b", // Metamask public ID Used for Claim Processing Details
    "destinationAddress" : "0x5f9f1b9b9b9b9b9b9b9b9b9b", Destination Address of the Wallet
    "amount" : {
        "amount" : 1000,
        "currency" : "USD"
    }
}

// The above will be the request
Response
Response
{
 Response Body {
    "status": "success",
    "message": "Insurance Claim has been Paid Successfully , Amount is credited to your Wallet"}"
    "amount" : "20000USDC", this will be decided by the backend smart contract, just show on the UI
}  
}
}

*/
const fetch = require('node-fetch');
const crypto = require("crypto");
const url = 'https://api-sandbox.circle.com/v1/transfers';


import { MongoClient } from "mongodb";


const CIRCLE_API_KEY =
  "QVBJX0tFWTo4ZDQwNjU1YzEyM2E0NjE1ZWM4YmM0OTc2ZWEwYWQ4YTo4NDQ3ZTVmNTNmYmQxN2U5YzJhN2I2Mzk3YThkYWI2ZA"

export default async function handler(req, res){

    const url_mongo =
      "mongodb+srv://shivam:shivam@cluster0.auqwa.mongodb.net/disasterInsurance?retryWrites=true&w=majority";

    const client = await MongoClient.connect(url_mongo);

    const db = client.db();

    const userCollection = db.collection("usersData");

    const user = await userCollection.findOne({ walletId: req.body.walletId });
const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization: "Bearer " + CIRCLE_API_KEY,
  },
  body: JSON.stringify({
    source: { type: "wallet", id: "1000870888" },
    destination: {
      type: "blockchain",
      address:req.body.walletId,
      chain: "ETH",
    },
    amount: { amount: user.maxSumInsured, currency: "USD" },
    idempotencyKey: crypto.randomUUID(),
  }),
};

fetch(url, options)
  .then(res => res.json())
  .then(json => res.status(200).json({
    status: "success",
    message: "Insurance Claim has been Paid Successfully , Amount is credited to your Wallet address @" + json.data.destination.address + " Please check your wallet after 2 minutes",
    amount: json.data.amount.amount + json.data.amount.currency
  }))
  .catch(err => res.status(500).json({status: "error", message: "Error in Claiming Insurance " + err }));


  
}

