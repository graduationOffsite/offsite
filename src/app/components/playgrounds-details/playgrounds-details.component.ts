import { Component, OnInit,  } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Playground } from '../playground.model';
import { PlaygroundsService } from '../services/playgrounds.service'



@Component({
  selector: 'app-playgrounds-details',
  templateUrl: './playgrounds-details.component.html',
  styleUrls: ['./playgrounds-details.component.css']
})
export class PlaygroundsDetailsComponent implements OnInit {
  playground;
  code;
  userSelectedAmHours;
  userSelectedPmHours;
  isLoading=false;


  constructor(private playgroundServ:PlaygroundsService,
    private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params:ParamMap)=>{
      this.code=params.get('id');
      this.isLoading=true;
      console.log(typeof(params.get("id")))
     });

     this.playgroundServ.getDetails(this.code).subscribe(data=>{
      this.isLoading=false;
      this.playground=data 
      console.log(this.playground);
      console.log(typeof(this.playground))
    })
  }

}
