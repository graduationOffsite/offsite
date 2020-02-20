const express = require("express");
const jwt = require("jsonwebtoken");

const Player = require("../models/player");
const Bookings = require("../models/booking");
const Playground = require("../models/playground");
const verifyAdmin =require('../middleware/check')
const router = express.Router();
router.get('/book/:id',(req,res)=>
{
Bookings.findOne({_id:req.params.id}).then((data)=>{
    res.status(200).json(data) ;
    // console.log(req.params.id)
})
})

router.post('/book', ( req, res) => {
    const {  selectedDate ,selectedHoursAM,selectedHoursPM ,player_Id ,playground_id }= req.body
    let playgoundPrice_Hour;
    if(!selectedDate){
        res.status(501).json({msg: 'Please select a date'}) ;
    }
    else{
        const nubmerOfHoursInPeriod=2
        let timeNow=new Date()
        var new_booking= new Bookings({
        bookingDate:selectedDate,
        playgroundId:playground_id,
        playerId:player_Id,
        reservationDate:timeNow.toLocaleString()
            })
        let numberOfHoursSelected;
        Playground.findOne({_id:playground_id}).then((playground)=>{
            playgoundPrice_Hour=playground.price
             new_booking.totalPrice = playgoundPrice_Hour*nubmerOfHoursInPeriod
                if(!selectedHoursAM){
                    if(!selectedHoursPM){
                        res.status(501).json({msg: 'Please select an hour at least'}) ;
                    }else{
                        new_booking.bookingHours.pm=selectedHoursPM
                        numberOfHoursSelected=new_booking.bookingHours.pm.length
                        // console.log(numberOfHoursSelected);
                        new_booking.totalPrice*=numberOfHoursSelected
                    }
                }
                else if(selectedHoursAM && selectedHoursPM){
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