import { Component, OnInit } from '@angular/core';
import { AdminSrviceService } from '../services/admin-srvice.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
<<<<<<< HEAD
  reservations;

  constructor(public adminServ :AdminSrviceService) { }
=======
  bookings: Object;
  constructor(private adminService:AdminSrviceService) { }
>>>>>>> 1656844a600190b86859e763394f9e45970c4e8c

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
