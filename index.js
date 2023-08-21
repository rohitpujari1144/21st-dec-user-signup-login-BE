const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohit10231:rohitkaranpujari@cluster0.kjynvxt.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)
const port=4500

// getting all userinfo
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = client.db("User_Login_Signup");
        let allUsers = await db.collection("Users").find({}).toArray()
        if (allUsers.length) {
            res.status(200).send(allUsers)
        }
        else {
            res.send({ message: "No user data found" })
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

// creating new user account
app.post('/signup', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = client.db("User_Login_Signup");
        let user = await db.collection("Users").aggregate([{ $match: { email: req.body.email } }]).toArray()
        if (user.length === 0) {
            await db.collection("Users").insertOne(req.body);
            res.status(201).send({ message: 'signup successful', data: req.body })
        }
        else {
            res.send({ message: `email Id already exist` })
        }
    }
    catch (error) {
        // console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// user login
app.get('/login/:email/:password', async (req, res) => {
    const client = await MongoClient.connect(dbUrl);
    try {
        const db = client.db("User_Login_Signup");
        let user = await db.collection("Users").aggregate([{ $match: { email: req.params.email, password: req.params.password } }]).toArray()
        if (user.length) {
            res.status(200).send({ message: 'Login successful', data: user })
        }
        else {
            res.send({ message: `Invalid login credentials` })
        }
    }
    catch (error) {
        // console.log(error)
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

app.listen(port, () => { console.log(`App is listening on ${port}`); })
