import { MongoClient } from "mongodb";

export default async function getPremium(req, res) {

  const url_mongo =
    "mongodb+srv://shivam:shivam@cluster0.auqwa.mongodb.net/disasterInsurance?retryWrites=true&w=majority";

  const client = await MongoClient.connect(url_mongo);

  const db = client.db();

  const userCollection = db.collection("usersData");

  const user = await userCollection.findOne({walletId : req.body.walletId});
  const premiumAmount = user.premiumAmount;
  console.log(premiumAmount)

 res.status(200).json({amount: premiumAmount});
}

