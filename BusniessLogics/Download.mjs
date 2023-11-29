import fs from "fs";

const willDownloadDirectory = "./BusniessLogics/retrivedwill/";

const keyDirectory = "./BusniessLogics/keys/";

async function willDownload(Path, req, res) {
  const filePath = Path + req.query.UIDc + ".pdf";
  const fName = req.query.UIDc + ".pdf";
  //   const filePath = Path+'undefined.pdf';
  //   const fName = 'undefined.pdf';
  res.download(filePath, fName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // File download completed successfully, now delete the file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
  });
}

async function keyDownload(Path, fileName, res) {
  res.download(Path + fileName, fileName, (err) => {
    if (err) {
      console.error(`Error downloading file:`, err);
      res.status(500).send("Internal Server Error");
    } else {
      fs.unlink(Path + fileName, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
  });
}

export const downloadingOfWill = async (req, res) => {
  try {
    await willDownload(willDownloadDirectory, req, res);
  } catch {
    res.status(500).send({
      Message: `couldn't find the file, please proceed from beginning.`,
    });
  }
};

export const downloadingCreatorKey = async (req, res) => {
  try {
    // console.log(req.query);
    await keyDownload(keyDirectory, req.query.UIDc + "CreatorKey.pdf", res);
  } catch {
    res.status(500).send({
      Message: `couldn't find the file, please proceed from beginning.`,
    });
  }
};

export const downloadingNominiKey = async (req, res) => {
  try {
    await keyDownload(keyDirectory, req.query.UIDc + "NominiKey.pdf", res);
  } catch {
    res.status(500).send({
      Message: `couldn't find the file, please proceed from beginning.`,
    });
  }
};
