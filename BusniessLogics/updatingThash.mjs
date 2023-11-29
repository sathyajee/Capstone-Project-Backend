import pkg from "../models/Schema.js";
import express from "express";

import bodyParser from "body-parser";
const route = express.Router();
route.use(express.json());

route.use(express.urlencoded({ extended: true }));
route.use(bodyParser.urlencoded({ extended: true }));

export const updatingThash = async (req, res) => {
  const UIDc = req.query.UIDc;
  const Thash = req.query.Thash;
  // finding in db
  try {
    const dbresult = await pkg.find();
    const finalres = dbresult.filter((data) => data.UIDc == UIDc); // getting required detail
    // console.log(finalres);
    console.log(req.query);

    if (finalres.length) {
      const id = finalres[finalres.length - 1]._id;
      console.log(id);
      await pkg
        .findByIdAndUpdate(id, { Index: Thash })
        // .then(res.send("encid Updated Successfully..."))
        .catch((err) => console.log(err));
      // await pkg.findByIdAndUpdate(id, {Enccid:""})
      const result = pkg.findById(id);
      console.log(result.EncCid);
    }
    console.log("Thash addedto db successfuly.........");
    res.send({ messages: "Thash added successfuly...." });
  } catch (err) {
    console.log(err);
    res.send({ message: "problem occured retry" });
  }
  // qA0CrwTtcDnbFehDTtm3Ve4m0Cs8MlJ2BcdOJm/xbKWBmC81AuaijStkzOJItkFHc7PGSEZ9UJOqjy1QLbSwvQ8p1Bl5NJWfZSNgdvyfZV7yfasYGCLlf3If5Bz6S5NSS7KKChW3m8Jifm97LDcsdXWyQtZisp4bj0dPN+LoevA=
};
