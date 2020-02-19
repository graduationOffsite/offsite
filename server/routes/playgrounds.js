const express = require("express");
const multer=require('multer');
const Playground = require("../models/playground");
const checkAuth=require('../middleware/check');
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.get("/getPlaygrounds", (req, res, next)=>{ 
  Playground.find().then(documents => {
    console.log(documents); 
    res.status(200).json({
      message: "Playground fetched successfully!",
      playgrounds: documents
    });
  });
  });

router.get("/:id", (req, res, next) => {
  Playground.findById(req.params.id).then(playground => {
      if (playground) {
        res.status(200).json(playground);
      } else {
        res.status(404).json({ message: "playground not found!" });
      }
    });
  }); 

 
router.post('/postPlay',checkAuth,
      multer({ storage: storage }).single("image"),(req,res,next)=>{
      const url = req.protocol + "://" + req.get("host"); 
      console.log(req.body);
      const playground=new Playground({
        name:req.body.name,
        description:req.body.description,
        owner:req.body.owner,
        price:JSON.parse(req.body.price),
        phone:req.body.phone,
        pmHours:JSON.parse(req.body.pmHours),
        amHours:JSON.parse(req.body.amHours),
        location:req.body.location,
        imagePath: url + "/images/" + req.file.filename,
        ownerId:req.adminData.adminId
       });
       playground.save().then(createdPlayground => {
        res.status(201).json({
          message: "Playground added successfully",
          playground: {
            ...createdPlayground,
            id:createdPlayground._id 
             
          }
        });
      });
    });







module.exports = router;

  
  