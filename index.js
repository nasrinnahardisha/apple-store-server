const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;



//middleware
app.use(cors());
app.use(express.json());





console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);




const uri = "mongodb+srv://appleMaster:IbtKLpxagqojPBhu@cluster0.xnsnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    //1.3 
    const appleCollection = client.db('appleDB').collection('apple')
      
     //1.2 create:insertOne: and server receive data
     app.post('/apple', async(req, res) =>{
      const newApple = req.body;
      console.log(newApple);
      //1.4 data server send to database or mongodb
      const result = await appleCollection.insertOne(newApple);
      res.send(result);
     })


    //2.1 [find multi to array ]=read : toArray: localhost /5001/apple data send
    app.get('/apple', async(req, res) =>{
      const cursor = appleCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    //3.2 delete : [delete document] deleteOne
    app.delete('/apple/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) }
      const result =await appleCollection.deleteOne(query);
      res.send(result);
    })


     //4.1 update : [update and replace]

     app.get('/apple/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) }
      const result =await appleCollection.findOne(query);
      res.send(result);
    })



   //4.5 
   app.put('/apple/:id', async(req, res) =>{
    const id  = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const updateApple = req.body;
    const updateDoc ={
      $set: {
        name:updateApple.name,
        email: updateApple.email,
        number: updateApple.number,
      },
    };
    const result = await appleCollection.updateOne(filter, updateDoc, options);
    res.send(result);
    

   })


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('apple making server is running')
})


app.listen(port, () =>{
    console.log(`apple server is running on port ${port}`);
}) 