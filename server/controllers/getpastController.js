const Past=require('../models/PastEvent')

const getpast=async(req,res)=>{
    try{
        const data=await Past.aggregate([
            {$sort:{createdAt:-1}},
            {$limit:5}
        ])
        if(!data){
            res.status(400).json({message:"no past events are there"});
        }
        res.status(200).json({message:"data get sucessfully",data:data})
    }
    catch{
        res.status(500).json({message:"server error in the get past event"})
    }

}

module.exports=getpast