import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
interface carouselImage {
  imageSrc: string;
  imageAlt: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Input() indicators = true;
  @Input() SlideInterval = 3000;
  @Input() autoSlide = false;
  selectedIndex = 0;
  resisterFlag: boolean = false;
  selectedIndex1: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router:Router,
    public dialog: MatDialog
  ) {}

  images: carouselImage[] = [
    {
      imageSrc:
        'https://images.unsplash.com/photo-1460627390041-532a28402358?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: 'nature1',
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: 'nature2',
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1640844444545-66e19eb6f549?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
      imageAlt: 'person1',
    },
    {
      imageSrc:
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      imageAlt: 'person2',
    },
  ];

  ngOnInit(): void {}
  selectImage(i: number) {
    console.log('this.selectedIndex', i);
    this.selectedIndex = i;
  }
  toggle() {
    this.resisterFlag = true;
    this.dialog.open(RegisterDialogComponent, {
      height: '80vh',
      width: '60vw',
    });
  
    //  this.resisterFlag!=this.resisterFlag; 
  }
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

 

  setFlag(i: number) {
    this.selectedIndex1 = i;
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
}
