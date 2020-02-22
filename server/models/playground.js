const uniqueValidator = require("mongoose-unique-validator"); 
const mongoose = require("mongoose");

const playgroundSchema = mongoose.Schema({
<<<<<<< HEAD
    name: { type: String, required: true},
=======
    name: { type: String, required: true, unique:true },
>>>>>>> 1656844a600190b86859e763394f9e45970c4e8c
    description: { type: String, required: true },
    owner: { type: String, required: true },
    price: { type: Number, required: true }, 
    phone: { type: String, required: true,unique:true },
    pmHours: {type:[String],required: true},
    amHours: {type:[String],required: true},
    location: { type: String, required: true },
    imagePath:{ type: String, required: true,unique:true },
    ownerId:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
        required: true,
        unique:true
     }  
});
playgroundSchema.plugin(uniqueValidator);


module.exports = mongoose.model("Playground", playgroundSchema);
