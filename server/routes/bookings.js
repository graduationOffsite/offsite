const express = require("express");
const jwt = require("jsonwebtoken");

const Player = require("../models/player");
const Bookings = require("../models/booking");
const Playground = require("../models/playground");
const checkAuth=require('../middleware/check'); 
const router = express.Router();


var Token = ''
function verifyToken(req,res,next){
//   console.log(req.query.playerToken);
  let playerToken=req.query.playerToken
  jwt.verify(playerToken,'Shhhh',(err , verifytoken)=>{
    if (err)
    return res.status(400).json({Msg : 'you are unauthorized'})
    if (verifytoken){
        Token = verifytoken;
      next();
    }
    }
)}


router.get('/book/:id',(req,res)=>
{
Bookings.findOne({_id:req.params.id}).then((data)=>{
    res.status(200).json(data) ;
    
}).catch(error=>{
    res.status(500).json({
      message:'Sorry, somthing went wrong!!'
    })
  }) 
})

/////list all bookings for one admin
router.get("/listbooking",checkAuth, (req, res, next)=>{ 
    // console.log(req.adminData.adminId)
    Playground.findOne({ownerId:req.adminData.adminId}).then(playground => {
    //   console.log(playground);
      Bookings.find({playgroundId:playground._id}).populate({path:'playerId',select:'name phone -_id'})
      .populate({path:'playgroundId', select:'name -_id'}).then((data)=>{
          console.log(data);
        res.status(200).json(data) ; 
    })

    }).catch(error=>{
        res.status(500).json({
          message:'Sorry, somthing went wrong!!'
        })
      });
 });


// router.post('/book',verifyToken, ( req, res) => {
//     const player_Id =Token.playerId;
//     const {  selectedDate ,selectedHoursAM,selectedHoursPM , playgroundId }= req.body
//     let playgoundPrice_Hour;
//     if(!selectedDate){
//         res.status(501).json({msg: 'Please select a date'}) ;
//     }
//     else{
//         const nubmerOfHoursInPeriod=2
//         let timeNow=new Date()
//         var new_booking= new Bookings({
//         bookingDate:selectedDate,
//         playgroundId:playgroundId,
//         playerId:player_Id,
//         reservationDate:timeNow.toLocaleString()
//             })
//         let numberOfHoursSelected;
//         Playground.findOne({_id:playgroundId}).then((playground)=>{
//             playgoundPrice_Hour=playground.price
//              new_booking.totalPrice = playgoundPrice_Hour*nubmerOfHoursInPeriod
//                 if(selectedHoursAM.length===0){
//                     if(selectedHoursPM.length===0){
//                         res.status(501).json({msg: 'Please select an hour at least'}) ;
//                     }else{
//                         new_booking.bookingPmHours=selectedHoursPM
//                         numberOfHoursSelected=new_booking.bookingPmHours.length
//                         // console.log(numberOfHoursSelected);
//                         // new_booking.totalPrice*=numberOfHoursSelected
//                     }
//                 }
//                 else if(selectedHoursAM.length>0 && selectedHoursPM.length>0){
//                     new_booking.bookingAmHours=selectedHoursAM
//                     new_booking.bookingPmHours=selectedHoursPM
//                     numberOfHoursSelected=new_booking.bookingPmHours.length + new_booking.bookingAmHourslength
//                     // console.log('asd'+selectedHoursAM);
//                     // console.log(new_booking.bookingHours.am+"asakk");
//                     // console.log(numberOfHoursSelected);
//                     // new_booking.totalPrice*=numberOfHoursSelected

//                 }
//                 else{
//                     new_booking.bookingAmHours=selectedHoursAM
//                     numberOfHoursSelected=new_booking.selectedHoursAM.length
//                     console.log(new_booking.selectedHoursAM+typeof(new_booking.selectedHoursAM));
//                     // new_booking.totalPrice*=numberOfHoursSelected
//                 }
//                 // console.log(new_booking.bookingHours.am)
//                 new_booking.save().then( booking=> {
//                     res.status(201).json(booking);
//                     // console.log(booking)
//                         Player.findOne({_id:booking.playerId},(err,player)=>{
//                         // console.log(player);
//                             if(player.cart.bookingIds.length==0){
//                                 player.cart.bookingIds=[booking._id]
//                                 player.cart.totalPrice=booking.totalPrice
//                                 // console.log(player);
//                                 Player.updateOne({_id : player._id},{$set:player},err=>{if(err)console.log(err)});
//                                 }
//                             else{
//                                 player.cart.totalPrice+=booking.totalPrice
//                                 // console.log(player.cart.bookingIds)
//                                 player.cart.bookingIds.push(booking._id)
//                                 Player.updateOne({_id : player._id},{$set:player},err=>{if(err)console.log(err)});
//                             }
                            
//                         })
//                 }).catch(err=>{
//                     res.status(501).json({
//                         message: 'Sorry , somting went wrong!!'
//                     });
//                     console.log(err)
//                 })  
//         })
       
//     }
// })

// router.post('/books',verifyToken,( req, res) => {
//     const player_Id =Token.playerId;
//     let checkPm=true;
//     let checkAm=true;
//     const {  selectedDate ,selectedHoursAM,selectedHoursPM , playgroundId }= req.body
//     if(!selectedDate){
//         res.status(501).json({msg: 'Please select a date'}) ;
//     }
//     else{
//         Bookings.find({bookingDate:selectedDate , playgroundId: playgroundId}).then(booking=>{
//             console.log(booking)
//             booking.map(b=>{
//                 var am=b.bookingHours.am
//                 console.log('from angular am '+selectedHoursAM+' type of '+typeof(selectedHoursAM))
//                 console.log('from database am '+am+' type of '+typeof(am))
//                 if(JSON.stringify(am).length>JSON.stringify(selectedHoursAM).length){
//                     console.log("substraction"+JSON.stringify(am).replace(JSON.stringify(selectedHoursAM),'PPP'))
//                 }
//                 if(JSON.stringify(am).indexOf(JSON.stringify(selectedHoursAM))!==-1 && JSON.stringify(selectedHoursAM).indexOf(JSON.stringify(am))!==-1){
//                   checkAm= false;  
//                 }
                
//             })
//             booking.map(b=>{
//                 var pm=b.bookingHours.pm
//                 console.log('from angular pm '+selectedHoursPM+' type of '+typeof((selectedHoursPM)))
//                 console.log('from database pm '+pm+' type of '+typeof((pm)))
//                 if(JSON.stringify(pm).indexOf(JSON.stringify(selectedHoursPM))!==-1){
//                     checkPm= false;
//                 }
                
//             })
//             console.log(checkPm +' pm ... '+checkAm+' am')
            
//             if(!checkPm || !checkAm ){
//                 res.status(501).json({message:'try anthor hours'})

//             }

//         })
//     }
//   })
router.get('/deleteBooking/:id', ( req, res) => {
    let bookingToBeDeletedId=req.params.id
    // let player_Id=booking.playerId
    // let playerCart=cart.bookingIds;
    
    Bookings.findOneAndDelete({_id:bookingToBeDeletedId}).then(booking=>{
        let player_Id=booking.playerId
        var indexOfBookingIdInCart=-1;
        Player.findOne({_id:player_Id},(err,playerBooked)=>{
            // console.log(playerBooked)
            for (let i=0; i<playerBooked.cart.bookingIds.length; i++){
                if(req.params.id===playerBooked.cart.bookingIds[i].toString()){
                    indexOfBookingIdInCart=i;
                    console.log("found the booking id in player's cart has booked");
                    break;
                }
                }
            if(indexOfBookingIdInCart>=0){
                var bookingDeleted=playerBooked.cart.bookingIds[indexOfBookingIdInCart].toString()
                console.log(bookingDeleted+' delete this booking from player cart of index '+indexOfBookingIdInCart)
                console.log(playerBooked.cart.totalPrice)
                playerBooked.cart.totalPrice-=booking.totalPrice
                console.log(playerBooked.cart.totalPrice)
                playerBooked.cart.bookingIds.pull(bookingDeleted)
                Player.updateOne({_id : player_Id},{$set:playerBooked},err=>{if(err)console.log(err)});
            }
        
        })
           res.json('deleting this booking is completed')
    }).catch(error=>{
        res.status(500).json({
          message:'Sorry, somthing went wrong!!'
        })
      })
})







router.post("/avetest",(req, res, next)=>{ 
    const {  selectedDate ,selectedHoursAM,selectedHoursPM , playgroundId }= req.body
    let am;
    let pm;
    let k=['12-02','02-04','04-06']
    Bookings.find({bookingDate:selectedDate , playgroundId: playgroundId}).then(booking=>{
        booking.map(b=>{
            b.bookingHours.am.map(v=>{
               /* selectedHoursAM.map(t=>{
                     if(t==v){
                        res.json('try anthor hour')
                    }
                    else{
                        res.json('ok')
                    } 
                })*/
                console.log(v+'..')
                console.log(typeof(v))
            })
            // pm=b.bookingHours.pm;
            // console.log(k.filter())
        })
       



    }).catch(error=>{
        res.status(500).json({
          message:'Sorry, somthing went wrong!!'
        })
      })

  
 });
 /////////////////////

 router.post('/book',verifyToken, ( req, res) => {
    const player_Id =Token.playerId;

    let timeNow=new Date()
    var new_booking= new Bookings({
    bookingDate:req.body.selectedDate,
    playgroundId:req.body.playgroundId,
    playerId:player_Id,
    totalPrice:0,
    reservationDate:timeNow.toLocaleString(),
    bookingPmHours:req.body.selectedHoursPM,
    bookingAmHours:req.body.selectedHoursAM

    })
    
    new_booking.save().then(booking=>{
        console.log(typeof(booking.bookingPmHours))
    })
 })


 router.post('/books',( req, res) => {
    const player_Id =Token.playerId;
    const date=req.body.selectedDate;
    const playgroundId=req.body.playgroundId;
    const comingAm=req.body.selectedHoursAM
    const comingPm=req.body.selectedHoursPM
    var allAm=[];
    const allBm=[]
    Bookings.find({bookingDate:date , playgroundId: playgroundId}).then(bookinData=>{
        bookinData.map(b=>{
        //    allAm.push(b.bookingAmHours); 
             
        })
        // allAm.map(am=>{
            
        //        console.log(JSON.stringify(am) +'..'+typeof(JSON.stringify(am)))
        //    })
        // console.log(allAm)
    })
    
 })


        
 router.post('updateBookin',(req,res,next)=>{
   /*
Bookings.findOneAndUpdate({"_id": "12"}, {$set: {"statusOfPayment": "http"}},  function(err,doc) {
  if (err) { throw err; }*/
   { console.log("Updated"); }
//});  
 });

module.exports = router;