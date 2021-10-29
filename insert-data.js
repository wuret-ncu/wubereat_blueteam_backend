const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://Ru:0918@cluster0.jpcuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "WUbeREaT";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);

         // Use the collection "UserProfile", "SoreProfile"
         const col = db.collection("UserProfile");
         const Store_col = db.collection("StoreProfile");

         // Construct a document                                                                                                                                                              
         let personDocument = {
             "User_id": 1,
             "UserName": "YTWU",                                                                                                                                 
             "Password": 35415,                                                                                                                                 
             "TotalSpend": 50
         }
         let storeDocument = {
             "Store_id": 1,
             "StoreType": { "StoreType_id": 1, "TypeName": "Foods" }
         }

         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(personDocument);
         // Find one document
         const myDoc = await col.findOne();
         // Print to the console
         console.log(myDoc);

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);