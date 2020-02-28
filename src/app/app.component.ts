import { Component, OnInit } from '@angular/core';
import { AdminSrviceService } from './components/services/admin-srvice.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'gradutationProject';

  constructor(private authService: AdminSrviceService){

  }

  ngOnInit(){
    this.authService.autoAuthUser();
  } 
    
}
