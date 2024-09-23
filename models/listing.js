const mongoose=require('mongoose');
const Review = require('./review');
const User= require('./user');
const ErrorHandler = require('../utility func/ErrorHandler');

const Schema=mongoose.Schema;

let listingSchema= new Schema({
    title:{
        type:String,
        required: true,
    },
    description: String,
    image:{
        filename: String,
        url:{
            type:String,
            default:"https://images.surferseo.art/fdb08e2e-5d39-402c-ad0c-8a3293301d9e.png",
            set:(v)=> v==="" ? "https://images.surferseo.art/fdb08e2e-5d39-402c-ad0c-8a3293301d9e.png" : v,
            }
    },
    price: Number,
    location:String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    // jis listing ko ham delete kary gay us ka object listing ma store ho ga.
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;