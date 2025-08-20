const mongoose=require('mongoose');

const db=()=>{
    mongoose.connect(process.env.mongouri)
    .then(()=>{
        console.log("db is connected");
    }) 
    .catch((error)=>{
        console.log("error in the db");
    })
}
module.exports=db;