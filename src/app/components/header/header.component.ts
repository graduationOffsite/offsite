import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { AdminSrviceService } from "../services/admin-srvice.service";
import { PlayerService } from '../services/player/player.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  public playerName;
  constructor(private authService:AdminSrviceService,private playerService:PlayerService) { 
    if(this.playerService.authorized){
    this.playerService.getPlayerName().subscribe(response=>{
    this.playerName=response as string
<<<<<<< HEAD
    })
  }}
=======
    // this.playerService.isLoginGetName=true
    })
    
  }

}
>>>>>>> 1656844a600190b86859e763394f9e45970c4e8c

  ngOnInit() {  
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout(){
    this.authService.logout();

  }
<<<<<<< HEAD

   
=======
>>>>>>> 1656844a600190b86859e763394f9e45970c4e8c
  public playerLogOut(){
    localStorage.removeItem('playerToken')
    this.playerService.authorized = false;
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
