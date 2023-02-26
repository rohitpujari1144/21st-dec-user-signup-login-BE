const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors=require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohitpujari:rohitkaranpujari@cluster0.inae9ih.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)

// getting all userinfo
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("UserLoginSignup");
        let allUsers = await db.collection("User Registration").find().toArray()
        res.status(200).send(allUsers )
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// creating new user account
app.post('/userSignup', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        if (req.body.name && req.body.username && req.body.email && req.body.password) {
            const db = await client.db("UserLoginSignup");
            let user = await db.collection("User Registration").findOne({ email: req.body.email })
            if (!user) {
                await db.collection("User Registration").insertOne(req.body);
                res.status(201).send({ message: 'User signup successful', data: req.body })
            }
            else {
                res.status(400).send({ message: `User with email id ${req.body.email} already exist` })
            }
        }
        else {
            res.status(400).send({ message: 'name, username, email, password are mandatory' })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// user login
app.get('/userLogin/:username/:password', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        if (req.params.username && req.params.password) {
            const db = await client.db("UserLoginSignup");
            let user = await db.collection("User Registration").findOne({ username: req.params.username, password: req.params.password })
            if (user) {
                res.status(200).send({ message: 'Login successful', data: user })
            }
            else {
                res.status(400).send({ message: `User not found with username ${req.params.username} and password ${req.params.password}` })
            }
        }
        else {
            res.status(400).send({ message: 'userEmail and userPassword are mandatory' })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

app.listen(4000, () => { console.log('App is listening on 4000'); })
