import fs from 'fs';

const willDownloadDirectory = './BusniessLogics/retrivedwill/'

const keyDirectory='./BusniessLogics/keys/'

async function willDownload(Path,res) {
    fs.readdir(Path, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return res.status(500).send('Internal Server Error');
        }
    
        // Ensure there is at least one file in the directory
        if (files.length === 0) {
          return res.status(404).send('No files found');
        }
    
        const latestFile = files.map(file =>({name:file}));
        console.log(latestFile[0].name);
        const filePath = Path+latestFile[0].name;
        const fName = latestFile[0].name;
        res.download(filePath, fName, (err) => {
          if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Internal Server Error');
          } else {
            // File download completed successfully, now delete the file
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
              } else {
                console.log('File deleted successfully');
              }
            });
          }
        });
        // res.redirect('/');
      });
}

async function keyDownload(Path,fileName,res){
    res.download(Path+fileName,fileName, (err) =>{
        if (err){
            console.error(`Error downloading file:`, err);
            res.status(500).send('Internal Server Error');
        }else{
            fs.unlink(Path+fileName, (unlinkErr) =>{
                if (unlinkErr){
                    console.error('Error deleting file:', unlinkErr);
                } else{
                    console.log('File deleted successfully');
                }
            })
        }
    })
}

export const downloadingOfWill = async (req,res)=>{
    try{
        await willDownload(willDownloadDirectory,res);
    }
    catch{
        res.status(500).send({Message:`couldn't find the file, please proceed from beginning.`})
    }
}

export const downloadingCreatorKey = async (req,res)=>{
    try{
        await keyDownload(keyDirectory,'CreatorKey.pdf',res);
    }
    catch{
        res.status(500).send({Message:`couldn't find the file, please proceed from beginning.`})
    }
}


export const downloadingNominiKey = async (req,res)=>{
    try{
        await keyDownload(keyDirectory,'NominiKey.pdf',res);
    }
    catch{
        res.status(500).send({Message:`couldn't find the file, please proceed from beginning.`})
    }
}