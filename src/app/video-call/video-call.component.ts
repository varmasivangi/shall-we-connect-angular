import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-call',
  imports: [],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.scss'
})
export class VideoCallComponent {
  meetingId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['meeting']) {
        this.meetingId = params['meeting'];
        console.log("Joined Meeting ID:", this.meetingId);
        // Add WebRTC logic here
      }
    });
  }
}
