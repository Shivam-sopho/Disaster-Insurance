// Payment of Amout using Wallet

/*
Request 
{

    "walletId" : "5f9f1b9b9b9b9b9b9b9b9b9b", // Metamask public ID Used for Claim Processing Details
Response

{
    "data": {
        "premiumAmount": 1000,
        "address": "0xab45573660e67b84743cd3abf4de43d36f45bb95", // Address of the Wallet to transfer the amount
        "currency": "USD",
        "chain": "ETH"
    }
}     
}
}



*/



const fetch = require("node-fetch");
const crypto = require("crypto");
import { MongoClient } from "mongodb";
export default async function payPremiumByWallet(req, res) {

    const url_mongo =
      "mongodb+srv://shivam:shivam@cluster0.auqwa.mongodb.net/disasterInsurance?retryWrites=true&w=majority";

    const client = await MongoClient.connect(url_mongo);

    const db = client.db();

    const userCardCollection = db.collection("userCreditCardDetails");
    const userCollection = db.collection("usersData");

    const user = await userCollection.findOne({ walletId: req.body.walletId });
    const premiumAmount = user.premiumAmount;
  const url = "https://api-sandbox.circle.com/v1/wallets/1000870888/addresses";
  const CIRCLE_API_KEY =
    "QVBJX0tFWTo4ZDQwNjU1YzEyM2E0NjE1ZWM4YmM0OTc2ZWEwYWQ4YTo4NDQ3ZTVmNTNmYmQxN2U5YzJhN2I2Mzk3YThkYWI2ZA";

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Bearer " + CIRCLE_API_KEY
    },
    body: JSON.stringify({
      idempotencyKey: crypto.randomUUID(),
      currency: "USD",
      chain: "ETH",
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => res.status(200).json({ data :{
        premiumAmount : premiumAmount * 12,
        address : json.data.address,
        currency : json.data.currency,
        chain : json.data.chain
    } }))
    .catch((err) => console.error("error:" + err));
res.status(200);
}
