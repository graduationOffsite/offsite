import { Component, OnInit,  } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Playground } from '../playground.model';
import { PlaygroundsService } from '../services/playgrounds.service'
import {test} from './test'
import { BookingsService } from '../services/booking/bookings.service';


@Component({
  selector: 'app-playgrounds-details',
  templateUrl: './playgrounds-details.component.html',
  styleUrls: ['./playgrounds-details.component.css']
})
export class PlaygroundsDetailsComponent implements OnInit {
  playground;
  code;
  // userSelectedDate;
  // userSelectedAmHours;
  // userSelectedPmHours;
  isLoading=false;
  bookingModel=new test('','','','')
  
  
  
  totalPriceOfBooking;
  errDiv: string;
  constructor(private playgroundServ:PlaygroundsService,
    private route:ActivatedRoute,private bookingsService:BookingsService) { }

  ngOnInit() {
    
    this.route.paramMap.subscribe((params:ParamMap)=>{
      this.code=params.get('id');
      this.isLoading=true;
      console.log(typeof(params.get("id")))
     });

     this.playgroundServ.getDetails(this.code).subscribe(data=>{
      this.isLoading=false;
      this.playground=data 
    })
    
    
  }
  test(userSelectedDate,playground_id,AM,PM){
    this.bookingModel=new test(userSelectedDate,AM,PM,playground_id)
    // console.log(typeof(this.userSelectedAmHours)+' '+typeof(userSelectedDate)+' '+typeof(playground_id));
    this.bookingsService.test(this.bookingModel).subscribe(
      response =>{
        console.log(response)
      }
        ,
        error => {
          this.errDiv = error.error.msg as string;
        }
    )
    this.calculatePrice(AM,PM)
  }
  calculatePrice(AM,PM){
    let playgroundPrice_hour=parseInt(this.playground.price)*2
    if (AM.length===0){
      if(PM.length!==0){
        var numberOfPmHours= PM.length
        this.totalPriceOfBooking=playgroundPrice_hour*numberOfPmHours
        // console.log(this.totalPriceOfBooking+'..'+numberOfPmHours);
          }
        else{
          this.errDiv='Please select an hour at least'
        }
        }
        else if(AM.length>0 && PM.length>0){
          var numberOfAmHours= AM.length
          var numberOfPmHours= PM.length
          this.totalPriceOfBooking=playgroundPrice_hour*(numberOfPmHours+numberOfAmHours)
          // console.log(this.totalPriceOfBooking+'..'+numberOfPmHours);
        }
        else{
          var numberOfAmHours= AM.length
          this.totalPriceOfBooking=playgroundPrice_hour*numberOfAmHours
        // console.log(this.totalPriceOfBooking+'..'+numberOfAmHours);
      }
  }
}
