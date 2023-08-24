
//Import File for Functions
const airtable = require('./airtableFunctions');

const fetch = require('node-fetch');
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

// Global Variables
const baseID = process.env.AIRTABLE_COMMON_WALLET_BASE;
const tableID = process.env.AIRTABLE_WALLETS_LIST;

//Temp Endpoint
app.get("/api", (req,res) => {
    const data = {users: ["userOne","userTwo","userThree","userOne","userTwo","userThree"]};   
    res.json(data);    
})

// NEW
// Create a New List in Table "Wallet Lists"
app.post("/api/add-wallets-list", (req,res) => {
    const listName = req.body.listName;
    const walletList = req.body.walletList;

    const url = `https://api.airtable.com/v0/${baseID}/${tableID}`;
    
   // Check if List Already Exists in the same name
   var currentAvailableLists = []
   airtable.GetAllRecords(url).then(
       result => {
           var data = {message: "Error!"};   
           var tableAlreadyExist = "None";
           currentAvailableLists = result.records;
           currentAvailableLists.map(item => {
               if(item.fields['List Name'] === listName){
                   tableAlreadyExist = listName;
               }
           })
        //    If List Doesn't Exit Then Create One
           if(tableAlreadyExist === "None"){
               airtable.CreateNewListRecord(url,listName,walletList).then(
                   result => {                    
                    data["message"] = "List Created Successfully!";   
                    data["response"] = result;
                    res.status(200).json(data);                  
                   }
               );
           }
           else{
               data["message"] = "List with same name already exists!";  
               res.status(200).json(data); 
           }
       });
});

// NEW
//Get Wallet List From Wallet Lists Tables
app.get("/api/get-list", (req,res) => {
    // const baseID = process.env.AIRTABLE_COMMON_WALLET_BASE;
    // const tableID = process.env.AIRTABLE_WALLETS_LIST;
    const url = `https://api.airtable.com/v0/${baseID}/${tableID}`;

    airtable.GetAllRecords(url).then( result => {
        res.status(200).json(result);        
    })
})

// Delete Wallet List From Wallet Lists Table
app.post("/api/delete-list",(req,res) => {
    const listID = req.body.listID;
    const url = `https://api.airtable.com/v0/${baseID}/${tableID}/${listID}`;

    airtable.DeleteListRecord(url).then( result => {
        console.log(result)
        res.status(200).json(result);
    })
    
})

// Update Wallet List From Wallet Lists Table
app.post("/api/update-list",(req,res) => {
    const listID = req.body.listID;
    const walletList = req.body.walletList;
    const url = `https://api.airtable.com/v0/${baseID}/${tableID}/${listID}`;

    airtable.UpdateListRecord(url,walletList).then( result => {
        res.status(200).json(result);
    })
    
})

//Contract Detail For CSV Upload
app.post("/api/token",(req,res) => {
    const apiKey = process.env.API_KEY;
    const contractAddress = req.body.contractAddress;
    const walletAddress = req.body.walletAddress;
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${walletAddress}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKey}`;
    fetch(url)
    .then(response => response.json())
    .then(jsonData => {
        const tokenData = {tokenName: jsonData.result[0].tokenName, tokenSymbol: jsonData.result[0].tokenSymbol}
        res.status(200).json(tokenData);
    })
})

app.listen(port, () => {console.log("Server started on port ", process.env.PORT)})