const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const player=new Schema({ 
    phone:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
    cart:{
         items:[
             {
                 productId:{type:Schema.Types.ObjectId,ref:'Playground',required:true},
                 quantity:{type:Number,required:true} 
                  
             }
         ] 
    }

});

module.exports=mongoose.model('Player',player); 