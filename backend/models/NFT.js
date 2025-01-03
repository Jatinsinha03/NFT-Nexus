const mongoose = require('mongoose');
const { Schema } = mongoose;

const NFTSchema = new Schema ({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    blockchain:{
        type:String,
        required:true,
    },
    contractAddress:{
        type:String,
        required:true,
        
    },
    chainId:{
        type:String,
        required:true,
    },
    
});

module.exports = mongoose.model('NFT',NFTSchema);