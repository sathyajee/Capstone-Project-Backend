import { Web3Storage, getFilesFromPath } from "web3.storage";
import fs from "fs";
import dotenv from "dotenv";
import { encryption } from "./encryption.mjs";
import pkg from "../models/Schema.js";
import { UploadFile } from "./IPFS_upload.mjs";
import { update_encryption } from "./update_encryption.mjs";
import { delete_will } from "./deleteWill.mjs";

dotenv.config({ path: "./.env" });

const token = process.env.TOKEN;
const client = new Web3Storage({ token });
const willUploadDirectory = "./BusniessLogics/Will_Store/";

export const UpdateWill = async (req, res) => {
//   console.log(req.body);
  const check = await update_check(req.body.UIDc);
  // console.log(check)
  if (check != "") {
    //delte the existing file record
    try {
      let result = await delete_will(req, check);
      console.log("deleted successfuly....");
      if (result != "Incorrect Password") {
        //upload new file and getting cid
        const cid = await UploadFile(req);
        console.log("new cid received...");
        //encrypting cid and updating in DB

        const encid = await update_encryption(res, cid, req.body.UIDc);
        console.log("db updated successfuly.......");

        res.send({
          Message: "Deleted old file successfully and uploded new...",
          Enccid: encid,
        });
      } else {
        res.send({ Message: "Incorrect Password, Please try again" });
      }
    } catch (error) {
      console.log(error);
      res.send({ Message: `incorrect password` });
    }
  } else {
    const file = req.file;
    const Filename = file.originalname;
    fs.unlink(willUploadDirectory + Filename, (err) => {
      if (err) console.log(err);
      else console.log("Will File Deleted");
    });
    res.send({ Message: "ha ha ha first create to update" });
  }
};

async function update_check(UIDc) {
  const dbresult = await pkg.find();
  console.log("bd serch done......");
  const finalres = dbresult.filter((data) => data.UIDc == UIDc); // getting required detail
//   console.log(finalres.length);
  let l = finalres.length - 1;
  if (finalres.length > 0) {
    return finalres[l].EncCid;
  }
  return "";
}
