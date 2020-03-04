import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from "@angular/material";
import { Subscription } from 'rxjs';
import { Playground } from '../playground.model';
import { PlaygroundsService } from '../services/playgrounds.service'
import { Router } from '@angular/router';
 
 
 


@Component({
  selector: 'app-playgrounds',
  templateUrl: './playgrounds.component.html',
  styleUrls: ['./playgrounds.component.css']
})
export class PlaygroundsComponent implements OnInit,OnDestroy {
 playgrounds: Playground[] = [];
 sortingOrder=1;
 totalPlaygrounds = 0;
 playgroundsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 5, 10];
 lat: number = 31.205753;
  lng: number = 29.924526;
 private playgroundSub: Subscription;

  constructor(private playgroundServ:PlaygroundsService,private router: Router ) { }

  ngOnInit() {
    this.playgroundServ.getPlaygrounds(this.playgroundsPerPage, this.currentPage, this.sortingOrder);
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()
    .subscribe((playgroundsData: {playgrounds:Playground[],playgroundCount: number}) => {
      this.playgrounds =playgroundsData.playgrounds
      this.totalPlaygrounds=playgroundsData.playgroundCount;


    })  
  }

  onChangedPage(pageData: PageEvent) { 
    this.currentPage = pageData.pageIndex + 1;
    this.playgroundsPerPage = pageData.pageSize;
    this.playgroundServ.getPlaygrounds(this.playgroundsPerPage, this.currentPage, this.sortingOrder);
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()
    .subscribe((playgrounds: {playgrounds:Playground[],playgroundCount: number}) => {
      this.playgrounds =playgrounds.playgrounds
      this.totalPlaygrounds=playgrounds.playgroundCount;

      console.log(this.playgrounds);
      
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

  showMap(location){
    console.log(location)
    this.playgroundServ.getMapLocation(location)
    .subscribe(locationData=>{
      console.log(locationData)
      // console.log(typeof(JSON.parse(locationData.lat)))
      this.lat=locationData.lat.valueOf();
      this.lng=locationData.lng.valueOf();
    })

  }
  ngOnDestroy() {
    this.playgroundSub.unsubscribe();
  }

}
