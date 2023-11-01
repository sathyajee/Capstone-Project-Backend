
import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { PdfReader } from 'pdfreader';
import pkg from '../models/Schema.js';
import {Decrypt} from './decryption.mjs';
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config({path:"./.env"})

const token = process.env.TOKEN
const client = new Web3Storage({ token });
const willDownloadDirectory = './BusniessLogics/retrivedwill/';
const keyFilePath = './BusniessLogics/prikey/'

export const retriveWill = async (req,res)=>{
    try {
        const {UIDc} = req.body;
        const file = req.file;
        const Filename = file.originalname;
        console.log(`Inputs received.....`);

        let priNom = await retriveCPK(keyFilePath+Filename);
        // priNom = priNom.substring(0,31)+'\n'+priNom.substring(31)
        // priNom = priNom.substring(0,priNom.length - 29)+'\n'+priNom.substring(priNom.length-29)
        priNom = priNom.substring(1)
       // console.log(priNom);
        console.log(`Got the enCrypted Private Key of Creator`);

        const dbresult=await pkg.find();
        console.log("bd serch done......")
        const finalres=dbresult.filter(data=>data.UIDc==UIDc);// getting required detail

        console.log("result length  is:"+finalres.length);
        let cid,priCre;
        if(finalres.length){
            //decrypt the creator private key using nomini privatekey

           priCre= Decrypt(finalres[0].EncPri,priNom);
           console.log("privkey of creator recived...............");
           cid=Decrypt(finalres[0].EncCid,priCre);

           console.log("cid recived.................")


        }
           //retriveing file by using cid
        const fileName = await retrieveFiles(cid);
        console.log("file retrived......");

        res.status(200).send({CreaterPrivateKey: priCre,CID: cid});
        // res.download(willDownloadDirectory, fileName, (err)=>{
        //     if(err){
        //         console.log(`Error downloading file:`, err);
        //         res.status(500).send('Internal Server Error');
        //     }else{
        //         fs.unlink(willDownloadDirectory+fileName, (unlinkErr) => {
        //             if (unlinkErr) {
        //               console.log('Error deleting file:', unlinkErr);
        //             } else {
        //               console.log('File deleted successfully');
        //             }
        //           })
        //     }
        // })
    } catch (error) {
        res.status(500).send(`Error occured: ${error}`)
    }
}

async function retriveCPK(filePath) {
    return new Promise((resolve, reject) => {
      let privateKey='';
  
    new PdfReader().parseFileItems(filePath, (err, item) => {
      if (err) {
        console.error(err);
        reject(err); // Reject the promise if there's an error
      } else if (!item) {
      //   console.warn("end of file");
        resolve(privateKey); // Resolve the promise when parsing is complete
      } else if (item.text) {
        privateKey = privateKey+'\n'+item.text;
      }
    });
  });
  }

  async function retrieveFiles(cid) {
    const res = await client.get(cid);
    const files = await res.files();
    // console.log('hi');
    let fileName;
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      fileName = file.name;
      fs.writeFileSync(willDownloadDirectory+fileName, Buffer.from(buffer));
      console.log(`Downloaded ${fileName} (${buffer.byteLength} bytes)`);
    }
    return fileName
  }