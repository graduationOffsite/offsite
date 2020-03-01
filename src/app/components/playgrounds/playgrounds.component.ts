import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from "@angular/material";
import { Subscription } from 'rxjs';
import { Playground } from '../playground.model';
import { PlaygroundsService } from '../services/playgrounds.service'
import { Router } from '@angular/router';
// import { MatRadioChange } from '@angular/material';
   
@Component({
  selector: 'app-playgrounds',
  templateUrl: './playgrounds.component.html',
  styleUrls: ['./playgrounds.component.css']
})
export class PlaygroundsComponent implements OnInit,OnDestroy {
 playgrounds: Playground[] = [];

//  selectedprice='';
 sortingOrder=1;
 totalPlaygrounds = 0;
 playgroundsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 5, 10];
 private playgroundSub: Subscription;

//  radioChange($event: MatRadioChange) {
//   console.log($event.source.name, $event.value);

//   if ($event.source.name === 'radioOpt1') {
//       // Do whatever you want here
//   }
// }


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
  ngOnDestroy() {
    this.playgroundSub.unsubscribe();
  }

}
