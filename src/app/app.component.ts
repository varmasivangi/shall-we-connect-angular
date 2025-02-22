import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { io } from 'socket.io-client';
import { HeaderComponent } from "./layout/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  
}
