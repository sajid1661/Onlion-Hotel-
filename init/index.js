const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData=require('./Data.js');
//database connection
let MongoURL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MongoURL);
}
main().then(()=>{
    console.log("DataBase connected");
}).catch((err)=>{
    console.log(err);
})
let initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=> {return {...obj, owner:'66e5aa8c29b45ae518c6e0fb'}});
    await Listing.insertMany(initData.data);
    console.log("inserted All data");
}

initDB();
