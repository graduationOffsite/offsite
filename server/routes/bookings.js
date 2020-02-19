const express = require("express");
const jwt = require("jsonwebtoken");

const Player = require("../models/player");
const Bookings = require("../models/booking");
const Playground = require("../models/playground");
const router = express.Router();
router.get('/book/:id',(req,res)=>
{
Bookings.findOne({_id:req.params.id}).then((data)=>{
    res.status(200).json(data) ;
    console.log(req.params.id)
  
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
                        console.log(numberOfHoursSelected);
                        new_booking.totalPrice*=numberOfHoursSelected
                    }
                }
                else if(selectedHoursAM && selectedHoursPM){
                    new_booking.bookingHours.am=selectedHoursAM
                    new_booking.bookingHours.pm=selectedHoursPM
                    numberOfHoursSelected=new_booking.bookingHours.pm.length + new_booking.bookingHours.am.length
                    console.log('asd'+selectedHoursAM);
                    console.log(new_booking.bookingHours.am+"asakk");
                    
                    new_booking.totalPrice*=numberOfHoursSelected

                }
                else{
                    new_booking.bookingHours.am=selectedHoursAM
                    numberOfHoursSelected=new_booking.bookingHours.am.length
                    console.log(numberOfHoursSelected);
                    new_booking.totalPrice*=numberOfHoursSelected
                }
                console.log(new_booking.bookingHours.am)
                new_booking.save().then( booking=> {
                    res.status(201).json(booking);
                    console.log(booking)
                        Player.findOne({_id:booking.playerId},(err,player)=>{
                        console.log(player);
                            if(player.cart.bookingIds.length==0){
                                player.cart.bookingIds=[booking._id]
                                player.cart.totalPrice=booking.totalPrice
                                console.log(player);
                                Player.updateOne({_id : player._id},{$set:player},err=>{if(err)console.log(err)});
                                }
                            else{
                                player.cart.totalPrice+=booking.totalPrice
                                console.log(player.cart.bookingIds)
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

module.exports = router;