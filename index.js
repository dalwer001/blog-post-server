const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const PORT = process.env.PORT || 9999;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u97y4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const blogCollection = client.db("blogPost").collection("posts");
    const adminCollection = client.db("blogPost").collection("admins");
    const feedbackCollection = client.db("blogPost").collection("feedbacks");


    app.post('/addBlog', (req, res) => {
        const newBlog = req.body;
        blogCollection.insertOne(newBlog)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/blog', (req, res) => {
        blogCollection.find()
            .toArray((err, blogs) => {
                res.send(blogs);
            })
    })


    app.get('/showBlog/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        blogCollection.find({ _id: id })
            .toArray((err, blogs) => {
                res.send(blogs[0]);
            })
    })


    app.post('/checkAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })


    app.post('/addFeedback', (req, res) => {
        const newFeedback = req.body;
        feedbackCollection.insertOne(newFeedback)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/feedback', (req, res) => {
        feedbackCollection.find()
            .toArray((err, feedbacks) => {
                res.send(feedbacks);
            })
    })


    app.delete('/deleteBlog/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        blogCollection.deleteOne({ _id: id })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })



});

app.get('/', (req, res) => {
    res.send('Welcome to my world');
})


app.listen(PORT);
