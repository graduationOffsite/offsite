import { Component, OnInit } from '@angular/core';
import { AdminSrviceService } from '../services/admin-srvice.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  reservations;

  constructor(public adminServ :AdminSrviceService) { }

  ngOnInit() {
  }

}
