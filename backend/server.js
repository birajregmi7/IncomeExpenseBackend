const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';

app.get('/api/transactions', async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db();
    const collection = db.collection('transactions');
    const transactions = await collection.find({}).toArray();
    client.close();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching transactions');
  }
});


app.post('/api/transactions', async (req, res) => {
  const { type, name, amount } = req.body;
  const newTransaction = { type, name, amount, date: new Date().toDateString() };

  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    const db = client.db(); 
    const collection = db.collection('transactions');
    await collection.insertOne(newTransaction);
    client.close();
    console.log('Transaction added successfully to the database');
    res.json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting transaction');
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
