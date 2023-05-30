const express = require('express');
const mongoose = require('mongoose');
const router = require('./router.js');
const path = require('path');

const dbUrl = "mongodb+srv://<login>:<password>@cluster0.dsa44a.mongodb.net/?retryWrites=true&w=majority"

const app = express();
app.use(express.json());
app.use('/api', router);
app.use('/assets',express.static(path.join(__dirname, '/dist/assets')))

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

async function startApp(){
    try {
        await mongoose.connect(dbUrl);
        app.listen(80, () => console.log('server is running...'));
    } catch (e) {
        console.log(e)
    }
}

startApp();
