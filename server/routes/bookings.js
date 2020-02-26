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
    // console.log(req.params.id)
  
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

    });
 });


router.post('/book',verifyToken, ( req, res) => {
    const player_Id =Token.playerId;
    const {  selectedDate ,selectedHoursAM,selectedHoursPM , playgroundId }= req.body
    let playgoundPrice_Hour;
    if(!selectedDate){
        res.status(501).json({msg: 'Please select a date'}) ;
    }
    else{
        const nubmerOfHoursInPeriod=2
        let timeNow=new Date()
        var new_booking= new Bookings({
        bookingDate:selectedDate,
        playgroundId:playgroundId,
        playerId:player_Id,
        reservationDate:timeNow.toLocaleString()
            })
        let numberOfHoursSelected;
        Playground.findOne({_id:playgroundId}).then((playground)=>{
            playgoundPrice_Hour=playground.price
             new_booking.totalPrice = playgoundPrice_Hour*nubmerOfHoursInPeriod
                if(selectedHoursAM.length===0){
                    if(selectedHoursPM.length===0){
                        res.status(501).json({msg: 'Please select an hour at least'}) ;
                    }else{
                        new_booking.bookingHours.pm=selectedHoursPM
                        numberOfHoursSelected=new_booking.bookingHours.pm.length
                        // console.log(numberOfHoursSelected);
                        new_booking.totalPrice*=numberOfHoursSelected
                    }
                }
                else if(selectedHoursAM.length>0 && selectedHoursPM.length>0){
                    new_booking.bookingHours.am=selectedHoursAM
                    new_booking.bookingHours.pm=selectedHoursPM
                    numberOfHoursSelected=new_booking.bookingHours.pm.length + new_booking.bookingHours.am.length
                    // console.log('asd'+selectedHoursAM);
                    // console.log(new_booking.bookingHours.am+"asakk");
                    
                    new_booking.totalPrice*=numberOfHoursSelected

                }
                else{
                    new_booking.bookingHours.am=selectedHoursAM
                    numberOfHoursSelected=new_booking.bookingHours.am.length
                    // console.log(numberOfHoursSelected);
                    new_booking.totalPrice*=numberOfHoursSelected
                }
                // console.log(new_booking.bookingHours.am)
                new_booking.save().then( booking=> {
                    res.status(201).json(booking);
                    // console.log(booking)
                        Player.findOne({_id:booking.playerId},(err,player)=>{
                        // console.log(player);
                            if(player.cart.bookingIds.length==0){
                                player.cart.bookingIds=[booking._id]
                                player.cart.totalPrice=booking.totalPrice
                                // console.log(player);
                                Player.updateOne({_id : player._id},{$set:player},err=>{if(err)console.log(err)});
                                }
                            else{
                                player.cart.totalPrice+=booking.totalPrice
                                // console.log(player.cart.bookingIds)
                                player.cart.bookingIds.push(booking._id)
                                Player.updateOne({_id : player._id},{$set:player},err=>{if(err)console.log(err)});
                            }
                            
                        })
                }).catch(err=>{
                    res.status(501).json({error: err});
                })  
        })
       
    }
})

router.post('/books',verifyToken,( req, res) => {
    const player_Id =Token.playerId;
    let checkPm=false;
    let checkAm=false;
    const {  selectedDate ,selectedHoursAM,selectedHoursPM , playgroundId }= req.body
    if(!selectedDate){
        res.status(501).json({msg: 'Please select a date'}) ;
    }
    else{
        Bookings.find({bookingDate:selectedDate , playgroundId: playgroundId}).then(booking=>{
            console.log(booking)
            booking.map(b=>{
                var am=b.bookingHours.am
                var x=JSON.stringify(selectedHoursAM).split(',')
                // console.log('from angular am '+selectedHoursAM+' type of '+typeof(selectedHoursAM))
                // console.log('from database am '+am+' type of '+typeof(am))
                console.log(x+' length of '+x.length+' type of '+typeof(x))
                if(JSON.stringify(selectedHoursAM) == JSON.stringify(am))
                checkAm= true;
            })
            booking.map(b=>{
                var pm=b.bookingHours.pm
                console.log('from angular pm '+selectedHoursPM+' type of '+typeof((selectedHoursPM)))
                console.log('from database pm '+pm+' type of '+typeof((pm)))
                if(JSON.stringify(selectedHoursPM) == JSON.stringify(pm)){
                    checkPm= true;
                }
                
            })
            console.log(checkPm +' pm ... '+checkAm+' am')
            if(checkPm==true && checkAm ==true){
                res.status(501).json({message:'try anthor hours'})
            }

        })
    }
  })
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
    }).catch(err=>{
        res.status(501).json({error: err});
    })
})

module.exports = router;