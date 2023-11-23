import express from "express";
import {CreateAndUploadFile} from '../BusniessLogics/FileUpload.mjs'
import { retriveWill } from "../BusniessLogics/retrive.mjs";
import {downloadingOfWill, downloadingCreatorKey, downloadingNominiKey} from "../BusniessLogics/Download.mjs"
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import multer from "multer";
import { UpdateWill } from "../BusniessLogics/Update_Will.mjs";
import { updatingThash } from "../BusniessLogics/updatingThash.mjs";
const route = express.Router();
route.use(express.json());


route.use(express.urlencoded({extended:true}))
route.use(bodyParser.urlencoded({extended: true}))
// route.use(fileUpload())
const storageWill = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './BusniessLogics/Will_Store/');
    },
    filename: function (req, file, cb) {
      // let UIDc = req.body.UIDc;
      // console.log('checking 1', req.body);       //There is a problem here.
      // UIDc = req.body.UIDc;
      // cb(null, UIDc+'.pdf'); // Use the original file name
      cb(null, file.originalname);
    }
  });
  
  const uploadWill = await multer({ storage: storageWill });

// ---------------------Import are done--------------------

route.get('/',(req,res)=>{
    try {
      console.log('Backend called')
        res.send({Message: 'Welcome to Will Management System'})
    } catch (error) {
        res.send(`Could not reach home page: ${error}`)
    }
})
//-------------------------------------------------------------------------

//------------uploding will----------------------------------------------

route.post('/createWill', uploadWill.single('file'), CreateAndUploadFile)  

//------------------retriveing will-------------------------------------

const storageKey = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './BusniessLogics/prikey/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    }
  });
  
  const uploadKey = multer({ storage: storageKey });

route.post('/retriveWill',uploadKey.single('file'),retriveWill)

route.get('/download/Will', downloadingOfWill)

route.get('/download/creator-key',downloadingCreatorKey)

route.get('/download/nomini-key', downloadingNominiKey)

const storageCreKey = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './BusniessLogics/Creprikey/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

const uploadcreKey = multer({ storage: storageCreKey });

const storageNewWill = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './BusniessLogics/Will_Store/');
  },
  filename: function (req, file, cb) {
    // const UIDc = req.body.UIDc
    // cb(null, UIDc+'.pdf'); // Use the original file name
    cb(null, file.originalname);
  }
});

const uploadNewWill = multer({ storage: storageNewWill });

route.post('/Update-willprivateKey',uploadcreKey.single('file'),(req,res)=>{
  res.send({Message: 'File received'})
})
route.post('/Update-will',uploadNewWill.single('file'), UpdateWill)

route.get('/Update/Thash', updatingThash)

export {route};