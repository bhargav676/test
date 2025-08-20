const Electromazine = require('../models/GoverningTeam');

const dsps=async(req,res)=>{
    try{
        const data=await Electromazine.find()
        if(data.length===0){
            return res.status(400).json({message:"faild to fetch the data"});
        }
        return res.status(200).json({message:"data is fectch sucessfully",data:data})
    }
    catch{
       return res.status(500).json({message:"server errror"});
    }
}

module.exports = dsps
