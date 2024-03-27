import { Component } from '@angular/core';
import { RegisterationService } from '../Services/registeration.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { Observable } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
export interface DialogData {
  id: string;
 // profilePhoto: File;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  age: number | null;
  country: string;
  state: string;
  addressType: string;
  homeAddress1: string;
  homeAddress2: string;
  companyAddress1: string;
  companyAddress2: string;
  tags: string;
  subscribe: boolean;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  data1:any
  navbarList = [
    {
      content: 'HOME',
      isActive: true,
      route: 'home',
    },
    {
      content: 'ABOUT US',
      isActive: false,
      route: 'about',
    },
    {
      content: 'JOBS',
      isActive: false,
      route: 'job',
    },
    {
      content: 'CLIENTS',
      isActive: false,
      route: 'clients',
    },
    {
      content: 'EMPLOYERS',
      isActive: false,
      route: 'employers',
    },
    {
      content: 'CONTACT US',
      isActive: false,
      route: 'contact',
    },
  ];

  selectedIndex: number = 0;

  constructor(private _register:RegisterationService,
              public dialog: MatDialog) { }
   

  setFlag(i: number) {
                this.selectedIndex = i;
                this.navbarList.forEach((item) => {
                  // console.log("is clicked" ,this.navbarList[i])
                  if (item == this.navbarList[i]) {
                    this.navbarList[i].isActive = true;
                  } else {
                    item.isActive = false;
                  }
                });
                console.log('is clicked', this.navbarList[i]);
  }
  ngOnInit(): void {
    
    this._register.getEmployee().subscribe({
      next: (res: any) => { // Change the parameter type to match the expected object type
        console.log("data1", res);
        if (Array.isArray(res) && res.length > 0) {
          this.data1 = res[res.length - 1]; // Assigning the last item of the array 
        }
      },
      error: console.log
    });
    
    
  }

  openEditForm(data1:any){
    console.log("open Edit Form", data1);
    this.dialog.open(RegisterDialogComponent, {
      data:this.data1,
      height: '80vh',
      width: '60vw',
    }); 
  }
}
