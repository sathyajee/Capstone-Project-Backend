import { Web3Storage, getFilesFromPath } from 'web3.storage';
import fs from 'fs';
import dotenv from 'dotenv'
import {encryption} from "./encryption.mjs" 
import pkg from '../models/Schema.js';
import { UploadFile } from './IPFS_upload.mjs';
import { update_encryption } from './update_encryption.mjs';
import {delete_will} from './deleteWill.mjs';

dotenv.config({path:"./.env"})

const token = process.env.TOKEN
const client = new Web3Storage({ token });
const willUploadDirectory = './BusniessLogics/Will_Store/';

export const UpdateWill = async (req,res)=>{
    const check = update_check(req.body.UIDc);
    if(check!= ''){
        //delte the existing file record
        // delete_will(req,check);
        console.log("deleted successfuly....")
        //upload new file and getting cid
        const cid= await UploadFile(req);
        console.log("new cid received...",cid);
        //encrypting cid and updating in DB

        await update_encryption(res,cid, req.body.UIDc);
        console.log("db updated successfuly.......");


        res.send({Message : "Deleted old file successfully and uploded new..."})

    }
    else{

        res.send("ha ha ha first create to update");
    }
}

async function update_check(UIDc) {
    const dbresult=await pkg.find();
        console.log("bd serch done......")
        const finalres=dbresult.filter(data=>data.UIDc==UIDc);// getting required detail
        if(finalres[0].length>0){ return finalres[0].EncCid;}
       return '';
    
}