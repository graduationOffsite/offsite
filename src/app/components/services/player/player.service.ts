import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { playerLogin } from './playerLogin.model';
import { playerSignup } from './playerSginup.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http:HttpClient) { }
  public authorized:boolean=!!localStorage.getItem('playerToken');
  public registered:boolean = false
  // public isLoginGetName=!!localStorage.getItem('playerToken');
  public signupPlayer(player: playerSignup){
    
    return this.http.post('http://localhost:3000/player/signup',player);
  }
  public loginPlayer(player:playerLogin){
    // this.authorized=true
    return this.http.post('http://localhost:3000/player/login',player)
    }
    public auth(){
      return !!localStorage.getItem('playerToken')
    }
    
    public getPlayerName(){
    return this.http.get('http://localhost:3000/player/name',{
    observe :'body',   
    params : new HttpParams().append('playerToken',localStorage.getItem('playerToken'))});
    }
  
    getToken(){
      return localStorage.getItem('playerToken')
    }
}
