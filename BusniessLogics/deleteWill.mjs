import { Web3Storage, getFilesFromPath } from "web3.storage";
import fs from "fs";
import dotenv from "dotenv";
import { PdfReader } from "pdfreader";
import { encryption } from "./encryption.mjs";
import pkg from "../models/Schema.js";
import { UploadFile } from "./IPFS_upload.mjs";
import { update_encryption } from "./update_encryption.mjs";
// import {ipfsClient} from 'ipfs-http-client' ;

dotenv.config({ path: "./.env" });

const token = process.env.TOKEN;
const client = new Web3Storage({ token });
const keyDirectory = "./BusniessLogics/CrepriKey/";

// const ipfs = ipfs({
//     host: 'ipfs.infura.io',
//     port: 5001,
//     protocol: 'https'
//   })

export const delete_will = async (req, encid) => {
  // const file = req.file;
  // const fileName = file.originalname;
  const fileName = req.body.UIDc + "CreatorKey.pdf";
  const { password } = req.body;
  // console.log(password);
  let priCreator = await retriveCPK(keyDirectory + fileName, password);
  priCreator = priCreator.substring(1);
  // const cid=Decrypt(encid,priCreator);
  // console.log("cid decrypted.....");
  // //using cid delete file from ipfs
  // // deleteFileFromIpfs(cid);
  // console.log("file deleted successfully...");

  fs.unlink(keyDirectory + fileName, (err) => {
    if (err) console.log(err);
    else console.log("Will File Deleted");
  });

  return priCreator;
};

async function retriveCPK(filePath, password) {
  return new Promise((resolve, reject) => {
    let privateKey = "";
    try {
      new PdfReader({ password: password }).parseFileItems(
        filePath,
        (err, item) => {
          if (err) {
            console.error(err);
            // reject(err); // Reject the promise if there's an error
            privateKey = " Incorrect Password";
            resolve(privateKey);
          } else if (!item) {
            //   console.warn("end of file");
            resolve(privateKey); // Resolve the promise when parsing is complete
          } else if (item.text) {
            privateKey = privateKey + "\n" + item.text;
          }
        }
      );
    } catch {
      privateKey = " Incorrect Password";
      resolve(privateKey);
    }
  });
}

//   async function deleteFileFromIpfs(cid) {
//     try {
//       await ipfs.pin.rm(cid)
//       console.log(`File ${cid} successfully unpinned`)
//       await ipfs.pin.rm(cid, {recursive: true})
//       console.log(`File ${cid} successfully deleted`)
//     } catch (err) {
//       console.error(err)
//     }
//   }
