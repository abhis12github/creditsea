const express=require("express");

const router=express.Router();

router.get('/test',function(req,res){
    return res.json({"test":true});
});

module.exports=router;