import { Component, OnInit,  } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Playground } from '../playground.model';
import { PlaygroundsService } from '../services/playgrounds.service'
import * as moment from 'moment'



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
  avalAm=[];
  avalPm=[];
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
      this.playground=data ;

    })
  }

  valueChanged(event){
    this.isLoading=true;
     const momentDate=new Date(event.value)
     const formated=moment(momentDate).format('YYYY-MM-DD')
     console.log(formated)
    this.playgroundServ.getAvaliableHours(this.code,formated).subscribe(data=>{
      this.isLoading=false; 
      this.avalAm=data.avalAm;
      this.avalPm=data.avalPm; 
      console.log(this.avalPm);
      console.log(this.avalAm); 
      console.log(typeof(this.avalPm))
 
    })

  }

}
