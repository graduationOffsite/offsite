import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    
    this.titleService.setTitle( 'Bookings list' );
  }

}
