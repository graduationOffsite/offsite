import { Component, OnInit, OnDestroy } from '@angular/core';
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
 private playgroundSub: Subscription;

  constructor(private playgroundServ:PlaygroundsService,private router: Router ) { }

  ngOnInit() {
    this.playgroundServ.getPlaygrounds();
    this.playgroundSub=this.playgroundServ.getPlaygroundUpdateListener()
    .subscribe((playgrounds: Playground[]) => {
      this.playgrounds = playgrounds;
      console.log(playgrounds);
      
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
