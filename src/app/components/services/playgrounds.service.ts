import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Playground } from '../playground.model';


@Injectable({
  providedIn: 'root'
})
export class PlaygroundsService {
  private playgrounds:Playground[] = [];
  private playgroundsUpdated = new Subject<Playground[]>();

  constructor(private http: HttpClient) { }

  getPlaygrounds(){
    this.http
    .get<{ message: string; playgrounds: any }>(
      "http://localhost:3000/playgrounds/getPlaygrounds"
    )
    .pipe(map((playgroundData) => {
      return playgroundData.playgrounds.map(playground => {
        return {
          id: playground._id, 
          name: playground.name,
          description: playground.description,
          owner:playground.owner,
          price:playground.price,
          phone:playground.phone,
          pmHours:playground.pmHours,
          amHours:playground.amHours,
          location:playground.location,
          imagePath:playground.imagePath,
          ownerId:playground.ownerId
 
        };
      });
    }))
    .subscribe(comingplaygrounds => {
      this.playgrounds = comingplaygrounds;
      this.playgroundsUpdated.next([...this.playgrounds]);
    });
  }

  getPlaygroundUpdateListener() {
    return this.playgroundsUpdated.asObservable();
  }

  getDetails(id):Observable<any>{
    return this.http.get<any>('http://localhost:3000/playgrounds/'+id);
  }

    
  addPlayground(
    name:string,
    description:string,
    owner:string,
    price:number,
    phone:string,
    pmHours:[],
    amHours:[],
    location:string,
    image:File){ 
    const playgroundData=new FormData();
    playgroundData.append('name',name);
    playgroundData.append('description',description); 
    playgroundData.append('owner',owner); 
    playgroundData.append('price',JSON.stringify(price)); 
    playgroundData.append('phone',phone);
    playgroundData.append('pmHours',JSON.stringify(pmHours));
    playgroundData.append('amHours',JSON.stringify(amHours));
    playgroundData.append('location',location);
    playgroundData.append('image',image,name);  
    this.http
    .post<{ message: string, playground:Playground }>
    ("http://localhost:3000/playgrounds/postPlay", playgroundData)
    .subscribe(responseData =>{
      console.log(responseData.message);
      const playground={id:responseData.playground.id,
        name:name,
        description:description,
        owner:owner,
        price:price,
        phone:phone,
        pmHours:pmHours,
        amHours:amHours,
        location:location,
        imagePath:responseData.playground.imagePath 
      } 
      this.playgrounds.push(playground);
      this.playgroundsUpdated.next([...this.playgrounds])  
    })  
    

  }
}
