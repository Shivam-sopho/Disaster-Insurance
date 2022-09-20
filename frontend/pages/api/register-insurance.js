// Register for insurance

/*
Request :- 
{
    "walletId" : "5f9f1b9b9b9b9b9b9b9b9b9b", // Metamask public ID Used for Claim Processing Details 
    "locationDetails" : {
        "latitude" : "12.9716",
        "longitude" : "77.5946"
    },
    "premiumAmount" : 1000,
    "maxSumInsured" : 10000,
    "premiumType" : "Premium" or "Basic",
    "disasterType" : "Flood" or "Earthquake" or "Fire" or "Cyclone" or "Tsunami" or "Landslide" or "Drought" or "Storm" or "Tornado" or "Volcano" or "Wildfire" or "Other",
    
{
    "bankDetails": {
        "beneficiaryName": "John Smith",
        "accountNumber": "12340010",
        "routingNumber": "121000248",
        "billingDetails": {
            "name": "John Smith",
            "city": "Boston",
            "country": "US",
            "line1": "1 Main Street",
            "district": "MA",
            "postalCode": "02201"
        },
        "bankAddress": {
            "country": "US"
        }
    }
}
}

//Response {
//     "status": "success"
}

*/

import { MongoClient } from "mongodb";

export default async function register(req, res) {
  const url =
    "mongodb+srv://shivam:shivam@cluster0.auqwa.mongodb.net/disasterInsurance?retryWrites=true&w=majority";

  const client = await MongoClient.connect(url);

  const db = client.db();

  const userCollection = db.collection("usersData");

  const query = { walletId: req.body.walletId };
  const update = {
    $set: {
      walletId: req.body.walletId, // Metamask public ID Used for Claim Processing Details
    locationDetails: {
      latitude: req.body.locationDetails.latitude,
      longitude: req.body.locationDetails.longitude,
    },
    premiumAmount: req.body.premiumAmount,
    policyType: req.body.policyType,
    disasterType: req.body.disasterType,
    maxSumInsured: req.body.maxSumInsured,
    bankDetails: {
      beneficiaryName: req.body.bankDetails.beneficiaryName,
      accountNumber: req.body.bankDetails.accountNumber,
      routingNumber: req.body.bankDetails.routingNumber,
      billingDetails: {
        name: req.body.bankDetails.billingDetails.name,
        city: req.body.bankDetails.billingDetails.city,
        country: req.body.bankDetails.billingDetails.country,
        line1: req.body.bankDetails.billingDetails.line1,
        district: req.body.bankDetails.billingDetails.district,
        postalCode: req.body.bankDetails.billingDetails.postalCode,
      },
      bankAddress: {
        country: req.body.bankDetails.bankAddress.country,
      },
    }
  }
}
  const options = { upsert: true };
  await userCollection.updateOne(query, update, options);

  res.status(200).json({ status: "success" });
}
