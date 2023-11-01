import express from 'express'
import mongoose from 'mongoose'
import {route} from './routes/router.mjs'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config({path:"./.env"})

const server = express()
server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use(cors())

// --------------Imports are done---------------------

// ---------------Connection to DB----------------------
const DB_conn = process.env.MONGO_URL1
mongoose.connect(DB_conn,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true
});

const details_dbObj = mongoose.connection

details_dbObj.on("error",()=>{
    console.log("db connection error")               //Should be modified as an Alert message
})

details_dbObj.on("open",()=>{
    console.log("Connected to Mongodb Successfully.........")
})

// ----------------------Connection established to mongodb--------------------->

// --------------------------Routes-----------------------------------

server.use("/",route)

// ------------------------------Server is Running-------------------------------

const PORT = process.env.PORT || 5001
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})

// ----------------------------------------------------------------------------