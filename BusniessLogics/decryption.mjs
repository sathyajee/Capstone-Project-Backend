import crypto from "crypto";

export function Decrypt(encryptedData, privateKey) {
  // converting input data to buffer

  let data = Buffer.from(encryptedData, "base64");

  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    //encryptedData
    data
  );

  // The decrypted data is of the Buffer type, which we can convert to a
  // string to reveal the original data

  //console.log("decrypted data: " +decryptedData.toString());

  return decryptedData.toString();
}
