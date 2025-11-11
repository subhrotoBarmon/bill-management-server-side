const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const { ServerApiVersion, MongoClient, ObjectId } = require('mongodb');
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
    let myUserCollection=db.collection('addBills');
    let myPayBillCollection=db.collection('payBills');

        // Add Bills API

    app.post('/addBills',async(req,res)=>{
       let newUser=req.body;     
           let result=await myUserCollection.insertOne(newUser);
           res.send(result);      
    })


    // Bills API
    app.post('/bills',async(req,res)=>{
        let newBill=req.body;
        let result=await myBillCollection.insertOne(newBill);
        res.send(result);
    })

    app.get('/recentBills',async(req,res)=>{
        let result=await myBillCollection.find({}).sort({date:-1}).limit(6).toArray();
        res.send(result);
    })

    app.get('/bills',async(req,res)=>{
        let category=req.query.category;
        let query={};
        if(category){
            query.category=category;
        }
        let products=(await myBillCollection.find(query).toArray());
        res.send(products);
    })

    app.get('/billsDetails/:id',async(req,res)=>{
       const id = req.params.id;
       const query = { _id: new ObjectId(id) };
       const result = await myBillCollection.findOne(query);
       res.send(result);
    })

       // My Pay Bill API

    app.get('/myPayBills', async(req,res)=>{
        // console.log("headers" ,req); 
        let bids=await myPayBillCollection.find({}).sort({date:-1}).toArray();
        res.send(bids);
    })


    app.post('/myPayBills',async(req,res)=>{
        let newBids=req.body;
        let result=await myPayBillCollection.insertOne(newBids);
        res.send(result);
    })

    app.delete('/bids/:id',async(req,res)=>{
        let id=req.params.id;
        let query={_id:new ObjectId(id)};
        let result=await myPayBillCollection.deleteOne(query);
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
