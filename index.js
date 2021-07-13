const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { MongoClient } = require('mongodb');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.85cmi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("order");
    // console.log('connected database');
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // console.log(product);
        productsCollection.insertOne(products)
            .then(result => {
                // console.log(result);
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    // for red----
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/products/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys } })
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
});


app.get('/', (req, res) => {
    res.send('Hello emaWatson!')
})

app.listen(port);