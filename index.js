const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors=require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohitpujari:rohitkaranpujari@cluster0.inae9ih.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)


// getting userinfo
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = await client.db("UserLoginSignup");
        let allUsers = await db.collection("User Registration").find().toArray()
        res.status(200).send({ message: 'Welcome to express', data: allUsers })
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
        if (req.body.userName && req.body.userEmail && req.body.userPassword) {
            const db = await client.db("UserLoginSignup");
            let user = await db.collection("User Registration").findOne({ userEmail: req.body.userEmail })
            if (!user) {
                await db.collection("User Registration").insertOne(req.body);
                res.status(201).send({ message: 'User signup successful', data: req.body })
            }
            else {
                res.status(400).send({ message: `User with email id ${req.body.userEmail} already exist` })
            }
        }
        else {
            res.status(400).send({ message: 'userName, userEmail, userPassword are mandatory' })
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
app.get('/userLogin/:userEmail/:userPassword', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        if (req.params.userEmail && req.params.userPassword) {
            const db = await client.db("UserLoginSignup");
            let user = await db.collection("User Registration").findOne({ userEmail: req.params.userEmail, userPassword: req.params.userPassword })
            if (user) {
                res.status(200).send({ message: 'Login successful', data: user })
            }
            else {
                res.status(400).send({ message: `User not found with email id ${req.params.userEmail} and password ${req.params.userPassword}` })
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
