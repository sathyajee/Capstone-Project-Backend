import PDFDocument from "pdfkit";
import crypto from "crypto";
import fs from "fs";

const keyDirectory = "./BusniessLogics/keys/";

export async function encryption(UIDc, data, passwordc, passwordn) {
  //--------------------------------------------creator key pair------------------------------------------------------
  const { publicKey: creator_publicKey, privateKey: creator_privateKey } =
    crypto.generateKeyPairSync("rsa", {
      // The standard secure default length for RSA keys is 2048 bits
      modulusLength: 1024,
    });

  //--------------------------nomini keys pair-----------------------------------------------------
  const { publicKey: nomini_publicKey, privateKey: nomini_privateKey } =
    crypto.generateKeyPairSync("rsa", {
      // The standard secure default length for RSA keys is 2048 bits
      modulusLength: 8192,
    });

  //--------------------------------------------------------------------------------------------------------------

  //-------------------encrypting cid with cerator private key------------------------------------------------------------

  const encryptedcid = crypto.publicEncrypt(
    {
      key: creator_publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(data)
  );

  //------------------------encrypting privte key of creator---------------------------------------------------------------

  const enCreatorPrivKey = crypto.publicEncrypt(
    {
      key: nomini_publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(
      creator_privateKey
        .export({ type: "pkcs1", format: "pem" })
        .toString("base64")
    )
  );

  //------------------------returning details-------------------------------------------------------------------------------

  const encrypted_data = {
    encid: encryptedcid.toString("base64"),
    enCreatorPrivKey: enCreatorPrivKey.toString("base64"),
    creator_publicKey: creator_publicKey
      .export({ type: "pkcs1", format: "pem" })
      .toString("base64"),
    nomini_publicKey: nomini_publicKey
      .export({ type: "pkcs1", format: "pem" })
      .toString("base64"),
  };

  //--------------------------------storing private key in pdf----------------------------------------------------->

  const nomini_privateKey_str = nomini_privateKey
    .export({ type: "pkcs1", format: "pem" })
    .toString("base64");
  const creator_privateKey_str = creator_privateKey
    .export({ type: "pkcs1", format: "pem" })
    .toString("base64");

  await makeFiles(
    UIDc,
    nomini_privateKey_str,
    creator_privateKey_str,
    passwordc,
    passwordn
  );

  //-------------------------------------------------------------

  //console.log(encrypted_data);
  return encrypted_data;
}
//-----------function to save key in pdf----------------------------------------------

async function makeFiles(UIDc, val1, val2, passwordc, passwordn) {
  // Set passwords for the documents
  // Set your desired password
  const optionsC = {
    userPassword: passwordc,
  };
  const optionsN = {
    userPassword: passwordn,
  };

  const doc2 = new PDFDocument(optionsC);
  const doc1 = new PDFDocument(optionsN);

  // Pipe the PDF content to a writable stream
  const writeStream1 = fs.createWriteStream(
    keyDirectory + UIDc + "NominiKey.pdf"
  );
  const writeStream2 = fs.createWriteStream(
    keyDirectory + UIDc + "CreatorKey.pdf"
  );
  doc1.pipe(writeStream1);
  doc2.pipe(writeStream2);

  // Add content to the PDF
  doc1.fontSize(12).text(val1, 50, 50);
  doc2.fontSize(12).text(val2, 50, 50);

  // End the document
  doc1.end();
  doc2.end();
  writeStream1.on("finish", () => {
    console.log("Nomini file has been written");
  });
  writeStream2.on("finish", () => {
    console.log("Creator file has been written");
  });
}
//----------------------------------------------------------------------
