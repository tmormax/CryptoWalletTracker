
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const port = process.env.PORT;
app.use(express.static("dist"));

//File Upload Function


//Temp Endpoint
app.get("/api", (req,res) => {
    const data = {users: ["userOne","userTwo","userThree","userOne","userTwo","userThree"]};   
    res.json(data);
})

//Contract Detail
app.post("/token",(req,res) => {
    const apiKey = process.env.API_KEY;
    const contractAddress = req.body.contractAddress;
    const walletAddress = req.body.walletAddress;
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKey}`;
    fetch(url)
    .then(response => response.json())
    .then(jsonData => {
        // console.log(jsonData.result[0].tokenName);
        // console.log(jsonData.result[0].tokenSymbol);
        const tokenData = {tokenName: jsonData.result[0].tokenName, tokenSymbol: jsonData.result[0].tokenSymbol}
        res.status(200).json(tokenData);
    })
})

app.listen(port, () => {console.log("Server started on port ", process.env.PORT)})