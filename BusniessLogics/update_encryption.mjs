import { Web3Storage, getFilesFromPath } from "web3.storage";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { encryption } from "./encryption.mjs";
import pkg from "../models/Schema.js";
dotenv.config({ path: "./.env" });

export const update_encryption = async (res, cid, UIDc) => {
  const dbresult = await pkg.find();
  const finalres = dbresult.filter((data) => data.UIDc == UIDc); // getting required detail
  let encid;
  if (finalres.length) {
    //decrypt the creator private key using nomini privatekey
    let l = finalres.length - 1;
    const pubKeyCre = finalres[l].CrePubKey;
    const id = finalres[l]._id;
    console.log("pubkey of creator recived...............");
    const encryptedcid = crypto.publicEncrypt(
      {
        key: pubKeyCre,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(cid)
    );

    encid = encryptedcid.toString("base64");
    //update in mongo db

    pkg
      .findByIdAndUpdate(id, { EncCid: encid })
      // .then(res.send("encid Updated Successfully..."))
      .catch((err) => console.log(err));
    return encid;
  } else {
    console.log("no record found to update!!!");
  }
};

//encrypting cid

//}
