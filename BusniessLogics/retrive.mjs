import { Web3Storage, getFilesFromPath } from "web3.storage";
import { PdfReader } from "pdfreader";
import pkg from "../models/Schema.js";
import { Decrypt } from "./decryption.mjs";
import dotenv from "dotenv";
import fs from "fs";
import { retriveEncid } from "./retriveEncryptedCid.mjs";
dotenv.config({ path: "./.env" });

const token = process.env.TOKEN;
const client = new Web3Storage({ token });
const willDownloadDirectory = "./BusniessLogics/retrivedwill/";
const keyFilePath = "./BusniessLogics/prikey/";

export const retriveWill = async (req, res) => {
  try {
    const { UIDc, UIDn, password } = req.body;
    const check_n = await check_UIDn(UIDc, UIDn);
    // console.log();
    const file = req.file;
    const Filename = file.originalname;
    if (check_n === "No Data") {
      fs.unlink(keyFilePath + Filename, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log("File deleted successfully");
        }
      });
      res.send({ Message: "No Data Present" });
    } else if (check_n === "wrong UIDn") {
      fs.unlink(keyFilePath + Filename, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log("File deleted successfully");
        }
      });
      res.send({ Message: "UIDn not matching" });
    } else {
      // const password = req.body.password;
      console.log(`Inputs received.....`);

      let priNom = await retriveCPK(keyFilePath + Filename, password);
      // priNom = priNom.substring(0,31)+'\n'+priNom.substring(31)
      // priNom = priNom.substring(0,priNom.length - 29)+'\n'+priNom.substring(priNom.length-29)
      fs.unlink(keyFilePath + Filename, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log("File deleted successfully");
        }
      });

      if (priNom === " Incorrect Password") {
        res.send({ Message: "Wrong Password" });
      } else {
        priNom = priNom.substring(1);
        // console.log(priNom);
        console.log(`Got the enCrypted Private Key of Creator`);

        // Deleting the file that is taken as input

        const dbresult = await pkg.find();
        console.log("bd serch done......");
        const finalres = dbresult.filter((data) => data.UIDc == UIDc); // getting required detail

        console.log("result length  is:" + finalres.length);
        let cid, priCre;
        if (finalres.length != 0) {
          //decrypt the creator private key using nomini privatekey
          const l = finalres.length - 1;
          const index = finalres[l].Index; // we have stored the index
          // const encid= await retriveEncid(index);
          // console.log(`encid: `,encid);

          console.log("privkey of creator recived...............");

          priCre = await Decrypt(finalres[l].EncPri, priNom);
          cid = await Decrypt(finalres[l].EncCid, priCre);

          console.log("cid recived.................");
        }
        //retriveing file by using cid
        const fileName = await retrieveFiles(cid, UIDc);
        console.log("file retrived......");

        // File Delete from IPFS
        // await deleteFileFromIpfs(cid);
        // console.log('File Deleted from IPFS');

        res.status(200).send({ Message: "File retrived", fileName: fileName });
      }
    }
  } catch (error) {
    res.status(500).send(`Error occured: ${error}`);
  }
};

async function retriveCPK(filePath, password) {
  return new Promise((resolve, reject) => {
    let privateKey = "";

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
  });
}

async function retrieveFiles(cid, UIDc) {
  const res = await client.get(cid);
  const files = await res.files();
  // console.log('hi');
  let fileName;
  let fileN;
  for (const file of files) {
    const buffer = await file.arrayBuffer();
    fileN = file.name;
    fileName = UIDc + ".pdf";
    fs.writeFileSync(willDownloadDirectory + fileName, Buffer.from(buffer));
    // console.log(`Downloaded ${fileName} (${buffer.byteLength} bytes)`);
  }
  return fileN;
}

async function deleteFileFromIpfs(cid) {}
async function check_UIDn(UIDc, UIDn) {
  const dbresult = await pkg.find();
  console.log("bd serch done......");
  const finalres = dbresult.filter((data) => data.UIDc == UIDc); // getting required detail
  // console.log(finalres.length);
  let l = finalres.length - 1;
  if (finalres.length === 0) {
    return "No Data";
  } else if (finalres[l].UIDn != UIDn) {
    return "wrong UIDn";
  }
  return finalres[l].id;
}
