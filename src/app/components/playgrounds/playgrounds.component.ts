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
 totalPlaygrounds = 0;
 playgroundsPerPage = 2;
 currentPage = 1;
 pageSizeOptions = [1, 2, 5, 10];
 private playgroundSub: Subscription;

  constructor(private playgroundServ:PlaygroundsService,private router: Router ) { }

  ngOnInit() {
    this.playgroundServ.getPlaygrounds(this.playgroundsPerPage, this.currentPage);
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()
    .subscribe((playgroundsData: {playgrounds:Playground[],playgroundCount: number}) => {
      this.playgrounds =playgroundsData.playgrounds
      this.totalPlaygrounds=playgroundsData.playgroundCount;

      console.log(this.playgrounds);
      
    }) 
  }

  onChangedPage(pageData: PageEvent) { 
    this.currentPage = pageData.pageIndex + 1;
    this.playgroundsPerPage = pageData.pageSize;
    this.playgroundServ.getPlaygrounds(this.playgroundsPerPage, this.currentPage);
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()

    .subscribe((playgrounds: {playgrounds:Playground[],playgroundCount: number}) => {
      this.playgrounds =playgrounds.playgrounds
      this.totalPlaygrounds=playgrounds.playgroundCount;

      console.log(this.playgrounds);
      
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
