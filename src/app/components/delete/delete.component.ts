import { Component, OnInit } from '@angular/core';
import { AdminSrviceService } from '../services/admin-srvice.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  reservations;
  bookings: Object;
  constructor(public adminService :AdminSrviceService) { }

  ngOnInit() {
    this.adminService.getBookings().subscribe(bookings=>{
      this.bookings=bookings
      console.log(this.bookings);
      
    })
  }
  deleteBooking(booking_id){
    this.adminService.deleteBooking(booking_id).subscribe(err=>{
      console.log('delete done')
    })
  }
}
