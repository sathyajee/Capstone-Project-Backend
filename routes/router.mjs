import express from "express";
import {CreateAndUploadFile} from '../BusniessLogics/IPFSUpload.mjs'
import { retriveWill } from "../BusniessLogics/retrive.mjs";
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import multer from "multer";
const route = express()
route.use(express.json())


route.use(express.urlencoded({extended:true}))
route.use(bodyParser.urlencoded({extended: true}))
// route.use(fileUpload())
const storageWill = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './BusniessLogics/Will_Store/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    }
  });
  
  const uploadWill = multer({ storage: storageWill });

// ---------------------Import are done--------------------

route.get('/',(req,res)=>{
    try {
        res.send({Message:"Home page is Home"})
    } catch (error) {
        res.send(`Could not reach home page: ${error}`)
    }
})
//-------------------------------------------------------------------------

//------------uploding will----------------------------------------------

route.post('/createWill',uploadWill.single('file'), CreateAndUploadFile)  

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

export {route};