import { Component, Inject, Input, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { RegisterationService } from '../Services/registeration.service';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { DialogData } from '../profile/profile.component';

interface Country {
  name: string;
  states: string[];
}
export interface Fruits {
  name: string;
}

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
})
export class RegisterDialogComponent {
  buttonText: string = '';
  img2:any
  img1="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1710861356~exp=1710861956~hmac=2b17ed323dc412170f8d56084d00cc26df95a47e80b05b6135b1c68802c7d634";
  resisterFlag: boolean = false;
  registrationForm!: any;
  maxSize = 5 * 1024 * 1024; // Maximum file size in bytes (e.g., 5 MB)
  maxDimension = 400; // Maximum image dimension in pixels
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruits[] = [];
  announcer = inject(LiveAnnouncer);
  ProfileData: any;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  remove(fruit: Fruits): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }
  edit(fruit: Fruits, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    const index = this.fruits.indexOf(fruit);
    if (index >= 0) {
      this.fruits[index].name = value;
    }
  }
  trackByFn(index: number, item: any) {
    return index; // or item.id depending on your data
  }

  countries: Country[] = [
    {
      name: 'India',
      states: [
        'Andhra Pradesh',
        'Assam',
        'Gujarat',
        'Maharashtra',
        'Rajasthan',
      ],
    },
    {
      name: 'USA',
      states: ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
    },
    {
      name: 'Canada',
      states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
    },
  ];
  /**
   *
   */
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _registration: RegisterationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    
    this.registrationForm = this.formBuilder.group({
      profilePhoto: ['', [Validators.required]], // Initialize profile photo control
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(22),
          this.noNumbersValidator,
        ],
      ],
      lastName: ['', [Validators.required, this.noNumbersValidator]],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('[0-9]{10}')],
      ],
      age: [null, Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      addressType: ['', Validators.required],
      homeAddress1: [''],
      homeAddress2: [''],
      companyAddress1: [''],
      companyAddress2: [''],
      tags: [[]],
      subscribe: [false],
    });
    this.registrationForm
      .get('country')!
      .valueChanges.subscribe((value: any) => {
        const states =
          this.countries.find((country) => country.name === value)?.states ||
          [];
        this.registrationForm.get('state')!.setValue(''); // Clear previous state selection
        this.registrationForm.get('state')!.enable(); // Enable state selection
        this.registrationForm
          .get('state')!
          .setValidators(states.length ? Validators.required : null); // Set state as required if there are states available
        this.registrationForm.get('state')!.updateValueAndValidity(); // Update validation status
      });
      
      
      this._registration.getByEmployeeId(this.data?.id).subscribe({
        next: (res: any) => {
          this.ProfileData = res;
          console.log('ProfileData received:', res);
          this.patchFormWithProfileData();
        },
        error: (error: any) => {
          console.error('Error fetching ProfileData:', error);
        }
      });
      this.buttonText = this.data ? 'Update' : 'Submit';
      this.isUpdateButton()
  }
  patchFormWithProfileData() {
    if (this.ProfileData && this.ProfileData.id !== null) {
      this.registrationForm.patchValue(this.ProfileData);
    }
  }
  noNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
    console.log('Control value:', control.value);
    const value = control.value;
    if (/\d/.test(value)) {
      // Check if the value contains any digit
      return { noNumbers: true }; // Return an error if it contains numbers
    }
    return null; // Return null if validation passes
  }
  get f() {
    return this.registrationForm.controls;
  }
  get age() {
    return this.registrationForm.get('age');
  }
  get tags() {
    console.log(this.registrationForm.get('tags'));
    return this.registrationForm.get('tags');
  }
  isUpdateButton(): boolean {
    return this.buttonText === 'Update';
  }
  createEntry(){
    this._registration.addEmployee(this.registrationForm.value).subscribe({
      next: (val: any) => {
        console.warn('Data:', val);
        alert('Your Registration Was Successful! Congratulations!');
        this.router.navigate(['', 'profile']);
      },
      error: (error: any) => {
        console.error('Error submitting form:', error);
        // Handle error if necessary
      },
    });
    this.resisterFlag = false;
  }
  updateEntry(){
    this._registration.updateByEmployee(this.data.id,this.registrationForm.value).subscribe({
      next: (val: any) => {
        console.warn('Data:', val);
        this.img1=val.profilePhoto
        alert('Your Updation Was Successful! Congratulations!');
        this.router.navigate(['', 'profile']);
      },
      error: (error: any) => {
        console.error('Error submitting form:', error);
        // Handle error if necessary
      },
    });
    this.resisterFlag = false;
  }
  onSubmit() {
    // You can handle form submission logic here
    this.registrationForm.markAllAsTouched();
    // console.log('Form validity:', this.registrationForm.valid); // Log form validity status
    // console.log('Form errors:', this.registrationForm.errors); // Log any form errors
    // Object.keys(this.registrationForm.controls).forEach((key) => {
    //   console.log(`${key} validity:`, this.registrationForm.get(key)?.valid);
    //   console.log(`${key} errors:`, this.registrationForm.get(key)?.errors);
    // });
    if (this.registrationForm.valid) {
      console.log('Form is valid. Submitting...');
      if (this.isUpdateButton()) {
        this.updateEntry();
      } else {
        this.createEntry();
      }

    } else {
      console.log('Form is invalid. Cannot submit.');
    }
  }
  // handleImageUpload(event: Event): void {
  //   const el = event.target as HTMLInputElement;
  //   if (!el || (el.files && el.files.length == 0)) return;
  //   const file = el.files?.[0];
  //   if (!file) return;
  //   // Update the preview image instantly
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     this.img1 = e?.target?.result;
  //       this.registrationForm.patchValue({ profilePhoto: reader.result });
  //   };
  //   reader.readAsDataURL(file);
  // }
  handleUpload(event: any): void {
    if(event?.target?.files){
     var reader=new FileReader();
     reader.readAsDataURL(event.target.files[0]);
     reader.onload = (event:any) => {
       this.registrationForm.patchValue({profilePhoto:event.target.result})
       console.log('this.registrationForm.patchValue({profilePhoto:event.target.result})',this.registrationForm.patchValue({profilePhoto:event.target.result}));
      this.img1=event.target.result;
      console.log('this.img2',this.img2);
      
      this.img1=event.target.result;
     }
  }

  }
  imageDimensionsValidator() {
    return (
      control: AbstractControl
    ): Promise<{ [key: string]: any } | null> => {
      return new Promise((resolve) => {
        const file = control.value;
        if (!(file instanceof Blob)) {
          resolve(null); // Resolve with null if the file is not a Blob
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            console.log('Image loaded successfully');
            console.log('Width:', img.width, 'Height:', img.height);
            if (img.width !== 310 || img.height !== 325) {
              resolve({ invalidDimensions: true }); // Resolve with error if dimensions are not as required
            } else {
              resolve(null); // Resolve with null if dimensions are valid
            }
          };
          img.onerror = (error) => {
            console.error('Error loading image:', error);
            resolve({ invalidImage: true }); // Resolve with error if there's an issue loading the image
          };
          img.src = e.target.result;
        };

        reader.readAsDataURL(file); // Read file as data URL
      });
    };
  }

  getStatesForCountry(countryName: string): string[] {
    const country = this.countries.find((c) => c.name === countryName);
    return country ? country.states : [];
  }
  onCancel() {
    // Reset the form
    this.registrationForm.reset();
    this.resisterFlag = false;
  }
}
function value(error: any): void {
  throw new Error('Function not implemented.');
}
