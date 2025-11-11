const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const { ServerApiVersion, MongoClient } = require('mongodb');
const port =process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4tewlt.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors());
app.use(express.json());

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Database
    let db=client.db("billManagement_db");
    let myBillCollection=db.collection("bills");

    // Bills API
    app.post('/recentBills',async(req,res)=>{
        let newBill=req.body;
        let result=await myBillCollection.insertOne(newBill);
        res.send(result);
    })

    app.get('/recentBills',async(req,res)=>{
        let result=await myBillCollection.find({}).sort({date:-1}).limit(6).toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
