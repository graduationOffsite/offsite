import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from "@angular/material";
import { Subscription } from 'rxjs';
import { Playground } from '../playground.model';
import { PlaygroundsService } from '../services/playgrounds.service'
import { Router } from '@angular/router';
import { BookingsService } from '../services/booking/bookings.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-playgrounds',
  templateUrl: './playgrounds.component.html',
  styleUrls: ['./playgrounds.component.css']
})
export class PlaygroundsComponent implements OnInit,OnDestroy {
  title:'football playgrounds'
 playgrounds: Playground[] = [];
 sortingOrder=1;
 totalPlaygrounds = 0;
 playgroundsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 5,10, 15];
 private playgroundSub: Subscription;
  playground_id;
  numberOfbookings: Object;

  constructor(private playgroundServ:PlaygroundsService,private router: Router ,private bookingService:BookingsService,private titleService: Title ) { }

  ngOnInit() {
    this.playgroundServ.getPlaygrounds(this.playgroundsPerPage, this.currentPage, this.sortingOrder);
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()
    .subscribe((playgroundsData: {playgrounds:Playground[],playgroundCount: number}) => {
      this.playgrounds =playgroundsData.playgrounds
      this.totalPlaygrounds=playgroundsData.playgroundCount;
    }) 
    this.titleService.setTitle( '5 Sides Football Playgrounds around Egypt' );
  }

  /* geNumOftBooking(playground_id){
    console.log(playground_id)
    this.bookingService.getBookingsNum(playground_id).subscribe(numberOfbookings=>{
      this.numberOfbookings=numberOfbookings
      // console.log(this.numberOfbookings)
    })
  } */
  onChangedPage(pageData: PageEvent) { 
    this.currentPage = pageData.pageIndex + 1;
    this.playgroundsPerPage = pageData.pageSize;
    this.playgroundServ.getPlaygrounds(this.playgroundsPerPage, this.currentPage, this.sortingOrder);
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()
    .subscribe((playgrounds: {playgrounds:Playground[],playgroundCount: number}) => {
      this.playgrounds =playgrounds.playgrounds
      this.totalPlaygrounds=playgrounds.playgroundCount;
      
    })
  }

  onSort(){
    this.sortingOrder=this.sortingOrder==1? -1:1  
    this.playgroundServ.getPlaygrounds(this.playgroundsPerPage, this.currentPage, this.sortingOrder);
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()
    .subscribe((playgroundsData: {playgrounds:Playground[],playgroundCount: number}) => {
      this.playgrounds =playgroundsData.playgrounds
      this.totalPlaygrounds=playgroundsData.playgroundCount;
  
    }) 
  }
  onSelect(playground){
    this.router.navigate(['/playgroundsDetails',playground.id])
   console.log(playground.id);
  }
  ngOnDestroy() {
    this.playgroundSub.unsubscribe();
  }

}
