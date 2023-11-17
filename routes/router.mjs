import express from "express";
import {CreateAndUploadFile} from '../BusniessLogics/IPFSUpload.mjs'
import { retriveWill } from "../BusniessLogics/retrive.mjs";
import {downloadingOfWill, downloadingCreatorKey, downloadingNominiKey} from "../BusniessLogics/Download.mjs"
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
    filename: async function (req, file, cb) {
      const UIDc = await req.body.UIDc;
      console.log(UIDc);
      cb(null, UIDc+'.pdf'); // Use the original file name
    }
  });
  
  const uploadWill = multer({ storage: storageWill });

// ---------------------Import are done--------------------

route.get('/',(req,res)=>{
    try {
        res.send({Message:"Home page is Home",collaboration_link:"https://prod.liveshare.vsengsaas.visualstudio.com/join?63EA21EECE35D11E4CC3FBAB8ACFF89CD845"})
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
      const UIDc = req.body.UIDc
      cb(null, UIDc+file.originalname); // Use the original file name
    }
  });
  
  const uploadKey = multer({ storage: storageKey });

route.post('/retriveWill',uploadKey.single('file'),retriveWill)

route.get('/download-Will', downloadingOfWill)

route.get('/download-creator-key',downloadingCreatorKey)

route.get('/download-nomini-key', downloadingNominiKey)

export {route};