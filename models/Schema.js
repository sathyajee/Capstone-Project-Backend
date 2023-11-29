const mongoose=require('mongoose');

const data_schema = new mongoose.Schema({

    Name:{
        type: String,
        required: true,
        minlength: 3
    },
    UIDc:{
        type: String,
        required: true,
        minlength:4
    },
    UIDn:{
        type: String,
        required: true,
        minlength:4
    },
    Index:{
        type: String,
        default:-1
    },
    EncCid:{
        type: String,
        required: true
    },
    EncPri:{
        type: String,
        required: true
    },
    CrePubKey:{
        type: String,
        required:true
    },
    NomPubKey:{
        type: String,
        required:true
    }
})


module.exports = mongoose.model("Added_detail",data_schema);