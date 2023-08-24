const fetch = require('node-fetch');
/////////////////////////////////////////////
/////////////////////////////////////////////
// Get All Records
async function GetAllRecords(url){
    try {
        const response = await fetch(url,{
            method: 'GET',
            headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
                      },                    
        })
        const data = await response.json();
        return(data);
    } catch (error) {
        console.log(error);
    }
}
// Create a New Wallet List record
async function CreateNewListRecord(url,listName,walletList){
    try {
        var walletListString = ""
        walletList.map((item,i) => {
            i === 0 ? walletListString += item : walletListString += ("\n" + item)             
        })
        const response = await fetch(url, {  
            method: 'POST',
            body: JSON.stringify({
                "records":[{
                    "fields": {
                        "List Name": listName,
                        "Holders List": walletListString
                    }
                }                    
                ]                
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
            },
          });

          const data = await response.json();
          return data;
        
    } catch (error) {
        console.log(error.message);
    }
}

// Delete Wallet List Record from List of Wallets
async function DeleteListRecord(url){
    try {
        const response = await fetch(url, {  
            method: 'DELETE',            
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
            },
          });
        
          const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}

// Delete Wallet List Record from List of Wallets
async function UpdateListRecord(url,walletList){

    try {
        const response = await fetch(url, {  
            method: 'PATCH',
            body:JSON.stringify({
                "fields":{
                    "Holders List": walletList
                    }
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
            },
          });
        
          const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}

/////////////////////////////////////////////
/////////////////////////////////////////////

module.exports = { GetAllRecords, CreateNewListRecord, DeleteListRecord, UpdateListRecord };    



// Others
// Get All Tables
// async function GetAllTables(url){
//     try {
//         const response = await fetch(url,{
//             method: 'GET',
//             headers: {
//                         'Content-type': 'application/json; charset=UTF-8',
//                         'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
//                       },
//             });

//         const data = await response.json();
//         return(data);
        
//     } catch (error) {
//         console.log(error.message);
//     }        
// }

// //Check Table Exist
// async function GetTables(url,tableName){
//     try {
//         const response = await fetch(url,{
//             method: 'GET',
//             headers: {
//                         'Content-type': 'application/json; charset=UTF-8',
//                         'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
//                       },
//             });

//         const data = await response.json();
//         return(data);
        
//     } catch (error) {
//         console.log(error.message);
//     }        
// }


// // Create New Table
// async function CreateTable(url,tableName){
//     try {
//         const response = await fetch(url, {  
//             method: 'POST',
//             body: JSON.stringify({
//               "name": tableName,
//               "fields": [
//                   {
//                       "name": "Holder Address",
//                       "type": "singleLineText"
//                   },
//               ]
//             }),
//             headers: {
//               'Content-type': 'application/json; charset=UTF-8',
//               'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
//             },
//           });

//           const data = await response.json();
//           return data;
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }


/////////////////////////////////////////////
/////////////////////////////////////////////
//Get Records from Table
// async function GetHolderAdressesFromTable(base,table){
//     var AllHolderAddresses = [];
//     const tableUrl = `https://api.airtable.com/v0/${base}/${table}`;
//     try {        
//         const response = await fetch(tableUrl, {  
//             method: 'GET',
//             headers: {
//               'Content-type': 'application/json; charset=UTF-8',
//               'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
//             },
//           });
//         const data = await response.json();                    
//         if(data.hasOwnProperty("offset")){
//             AllHolderAddresses = data.records;
//             var dataAvailable = true;
//             var currentOffset = data.offset;
//             // Loop Till Offset Exists
//             while(dataAvailable){
//                 const response = await fetch(`${tableUrl}?offset=${currentOffset}`, {  
//                     method: 'GET',
//                     headers: {
//                     'Content-type': 'application/json; charset=UTF-8',
//                     'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
//                     },
//                 });
//                 const nextData = await response.json();               
//                 nextData.records.map((item) => {
//                     AllHolderAddresses.push(item);
//                 });
                
//                 if(nextData.hasOwnProperty("offset")){
//                     currentOffset = nextData.offset;
//                 }
//                 else{
//                     dataAvailable = false;
//                 }            
//             }
//             return {"records": AllHolderAddresses};
//         }
//         else{
//         return data;
//         }          
//     } catch (error) {
//         console.log(error);
//     }
// }

//Create / Add Record to Table
// async function AddHolderAddressToTable(records,base,table){
//     try {
//         // Since only 10 records can be written per request 
//         //divide objects into 10 per requests and 
//         //create an array of POST requests
//         var postRequests = []
//         var writeFields = [];
//         records.map((item,i) => {
//             const data = { "fields": {"Holder Address": item}}            
//             writeFields.push(data)   
//             if(i % 9 === 0){    
//                 const writeRecords = {"records" : writeFields};            
//                 postRequests.push(writeRecords);
//                 writeFields = [];
//             }                     
//         });
//         if(writeFields.length > 0){
//             const writeRecords = {"records" : writeFields};            
//                 postRequests.push(writeRecords);
//                 writeFields = [];
//         }
    
//         // Create URL to Table
//         const tableUrl = `https://api.airtable.com/v0/${base}/${table}`;

//         //Loop Create Records from postRequests that have been bunched together
//         postRequests.map(async function (data,loop) {
//             const response = await fetch(tableUrl, {  
//                 method: 'POST',
//                 body: JSON.stringify(
//                     data
//                 ),
//                 headers: {
//                   'Content-type': 'application/json; charset=UTF-8',
//                   'Authorization': 'Bearer ' + process.env.AIRTABLE_API_KEY
//                 },
//               });
//               if(loop === postRequests.length -1){
//                 return "List Created";
//               }
                
//         })
        
//     } catch (error) {
//         console.log(error.message);
//     }   
// }