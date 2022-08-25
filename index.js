const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require('dotenv').config();



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.df6pdph.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() { 
    try { 
        await client.connect();
        // console.log('connected');
        const addBillCollection = client.db("billing_page").collection("addBills");

        // <--------------  get method -------------->
        app.get('/api/allBill', async (req, res) => {
            const query = {};
            // console.log(query);
            const cursor = await addBillCollection.find(query).toArray();
            res.send(cursor);
            // console.log(cursor);
        })
        // <-------------- get method -------------->


        // <-------------- post method ------------->
        app.post('/api/addBill', async (req, res) => {
            const addOne = req.body;
            console.log(addOne);
            const cursor = await addBillCollection.insertOne(addOne);
            res.send(cursor);
            console.log(cursor);
        })
        // <-------------- post method ------------->


        // <-------------- delete method ------------->
        app.delete('/api/deleteBill/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const cursor = await addBillCollection.deleteOne(query);
            res.send(cursor);
            // console.log(cursor);
        })
        // <-------------- delete method ------------->


        // <-------------- put/update method ------------->
        app.put('/api/updateBill/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            // const query = { _id: ObjectId(id) };
            // console.log((filter));
            
            const oneBill = req.body
            // console.log(oneBill);
            const { name, email, phone, amount } = oneBill;
            const updateDoc= {
                $set: {
                    name, email, phone, amount 
                }
            }
            // console.log(updateDoc);

            const options = { upsert: true };
            const cursor = await addBillCollection.updateOne(filter, updateDoc, options);
            res.send(cursor);
            // console.log(cursor);
        })
        // <-------------- put/update method ------------->


    }
    finally {
        // client.close(); 
    }
}

run().catch(console.dir);













app.get('/', (req, res) => {
  res.send('Bill please!')
})

app.listen(port, () => {
  console.log(`billing page listening on port ${port}`)
})