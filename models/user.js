const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema = mongoose.Schema;

let userSchema=new Schema({
    email:{
        type: String,
        required: true
    }
});
// Note username, password, hasing, solting default add kar deta ha  plugin(passportLocalMongoose); 
    userSchema.plugin(passportLocalMongoose);

let User=mongoose.model("User",userSchema);
module.exports=User;
