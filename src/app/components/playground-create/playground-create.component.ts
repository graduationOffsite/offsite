import { Component, OnInit } from '@angular/core'; 
import { NgForm,FormGroup,FormControl, Validators } from '@angular/forms';
import { PlaygroundsService } from '../services/playgrounds.service'
import { Router } from '@angular/router'; 
import { mimeType } from '../mime-type.validator'


@Component({
  selector: 'app-playground-create',
  templateUrl: './playground-create.component.html',
  styleUrls: ['./playground-create.component.css']
})
export class PlaygroundCreateComponent implements OnInit {
  enterdPlayName='';
  enterdPlayDesc='';
  enterdPlayOwner='';
  enterdPlayPrice;
  enterdPlayPhone='';
  selectedPmHours;
  selectedAmHours;
  selectedLocation='';
  form: FormGroup; 
  imagePreview: any; 
  // im=this.imagePreview.toString()
  avaliableList = 
  ['12-02', '02-04', '04-06', '06-08', '08-10', '10-12'];
  locations=['qena','cairo','aswan','banha'];

  
  constructor(public playgroundServ:PlaygroundsService,private router: Router) { }
//form:NgForm
  onAddPlayground(){
    if(this.form.invalid){
      return;
    }  
  this.playgroundServ.addPlayground(
    this.enterdPlayName,
    this.enterdPlayDesc,
    this.enterdPlayOwner,
    this.enterdPlayPrice,
    this.enterdPlayPhone,
    this.selectedPmHours,
    this.selectedAmHours,
    this.selectedLocation,
    this.form.value.image

    )
    console.log(this.selectedLocation)
    this.form.reset();
    this.router.navigate(['/']);

  }
 
   


  
  async onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);   
    this.imagePreview = await new Promise((resolve, reject) => {
      reader.onload = function(event) {
      resolve(reader.result)
      }
    })
    console.log(this.imagePreview) 
    console.log(file); 
  }
  // console.log(this.imagePreview );


  ngOnInit() {
    this.form = new FormGroup({
      playgroundName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }), 
      playgroundOwner: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      playgroundPrice: new FormControl(null, {
        validators: [Validators.required]
      }),
      playgroundPhone: new FormControl(null, {
        validators: [Validators.required]
      }),
      playgroundAm: new FormControl(null, {
        validators: [Validators.required]
      }),
      playgroundPm: new FormControl(null, {
        validators: [Validators.required]
      }),
      playgroundLocation: new FormControl(null, {
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        validators: [Validators.required]
      }) 

    })
  }

}
