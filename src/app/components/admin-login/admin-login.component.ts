import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminSrviceService } from "../services/admin-srvice.service";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  // public adminPhone:string='';
  // public adminPassword:string='';
  isLoading=false;

  constructor(public adminServ :AdminSrviceService) { }
  onAdminLogin(form:NgForm){
    if (form.invalid) {
      return;
    }
    this.isLoading=true;
    console.log(form.value.adminPhone); 
    this.adminServ.login(form.value.adminPhone, form.value.adminPassword);
  
  }
  ngOnInit() {
  }

}
