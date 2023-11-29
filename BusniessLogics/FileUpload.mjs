import { Web3Storage, getFilesFromPath } from "web3.storage";
import fs from "fs";
import dotenv from "dotenv";
import { encryption } from "./encryption.mjs";
import pkg from "../models/Schema.js";
dotenv.config({ path: "./.env" });

const token = process.env.TOKEN;
const client = new Web3Storage({ token });
const willUploadDirectory = "./BusniessLogics/Will_Store/";

export const CreateAndUploadFile = async (req, res) => {
//   console.log(req.body);
  try {
    const check = await add_check(req.body.UIDc);
    // console.log(`check`, check);
    if (check === 0) {
      const { Name, UIDc, UIDn, passwordc, passwordn } = req.body;
      const file = req.file;
      const Filename = file.originalname;
    //   console.log(`${Name}, ${UIDc}, ${UIDn}`);
      console.log("input recived...");

      const fileHash = await storeFiles(willUploadDirectory + Filename);
      console.log("ipfs Hash Received.....");

      fs.unlink(willUploadDirectory + Filename, (err) => {
        if (err) console.log(err);
        else console.log("Will File Deleted");
      });

      //encrypting cid
      const crypto_details = await encryption(UIDc, fileHash, passwordc, passwordn);

      // console.log(crypto_details);
      console.log("encryption done....");

      //Uploading to MongoDB
      const new_input = new pkg({
        Name: Name,
        UIDc: UIDc,
        UIDn: UIDn,
        EncCid: crypto_details.encid,
        EncPri: crypto_details.enCreatorPrivKey,
        CrePubKey: crypto_details.creator_publicKey,
        NomPubKey: crypto_details.nomini_publicKey,
      });

      await new_input.save();

      console.log(`Data added to Mongodb`);

      res
        .status(200)
        .send({
          Message: `Data added to Database Successfully....`,
          encid: crypto_details.encid,
        });
    } else {
      const file = req.file;
      const Filename = file.originalname;
      fs.unlink(willUploadDirectory + Filename, (err) => {
        if (err) console.log(err);
        else console.log("Will File Deleted");
      });
      res.send({ Message: "UIDc already present" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in uploading" });
  }
};

//---------------saving file to ipfs-----------------------------------

async function storeFiles(filePath) {
  const files = await getFilesFromPath(filePath);
  const cid = await client.put(files);

  return cid;
}

async function add_check(UIDc) {
  const dbresult = await pkg.find();
  console.log("bd serch done......");
  const finalres = dbresult.filter((data) => data.UIDc == UIDc); // getting required detail
//   console.log(finalres.length);
  return finalres.length;
}
