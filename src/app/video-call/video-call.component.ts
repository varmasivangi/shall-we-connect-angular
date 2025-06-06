import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-video-call',
  imports: [CommonModule],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.scss'
})
export class VideoCallComponent {
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;

  socket: any;
  peerConnection!: RTCPeerConnection;
  localStream!: MediaStream;
  remoteStream!: MediaStream;
  meetingId: string = '';
  meetingLink: string = '';

  config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  constructor(private route: ActivatedRoute, private router: Router,@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io("https://shall-we-connect-backend.onrender.com"); // Change to your backend URL
    }

    // Get meeting ID from URL
    this.route.queryParams.subscribe(params => {
      if (params['meeting']) {
        this.meetingId = params['meeting'];
        
      }
    });
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.setupPeerConnection();
      this.listenForSignals();
    } else {
      console.warn("WebRTC is disabled in SSR mode.");
    }
  }

  setupPeerConnection() {
    if (typeof window === 'undefined') {
      console.error("RTCPeerConnection is not available in SSR.");
      return;
    }
  
    this.peerConnection = new RTCPeerConnection(this.config);
  
    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.socket.emit("ice-candidate", { candidate: event.candidate, meetingId: this.meetingId });
      }
    };
  
    this.peerConnection.ontrack = event => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
        this.remoteVideo.nativeElement.srcObject = this.remoteStream;
      }
      this.remoteStream.addTrack(event.track);
    };
  }
  

  async generateMeetingLink() {
    this.meetingId = Math.random().toString(36).substring(2, 10); 
    this.meetingLink = `${window.location.origin}/video-call?meeting=${this.meetingId}`;
  }

  copyLink() {
    navigator.clipboard.writeText(this.meetingLink).then(() => {
     
    });
  }

  async joinMeeting() {
    this.socket.emit("join-meeting", { meetingId: this.meetingId });

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = this.localStream;

      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    } catch (error) {
      console.error("Error accessing media devices: ", error);
    }
  }

  listenForSignals() {
    this.socket.on("user-joined", async () => {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.emit("offer", { offer, meetingId: this.meetingId });
    });

    this.socket.on("offer", async (data: { offer: RTCSessionDescriptionInit }) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit("answer", { answer, meetingId: this.meetingId });
    });

    this.socket.on("answer", async (data: { answer: RTCSessionDescriptionInit }) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    this.socket.on("ice-candidate", async (data: { candidate: RTCIceCandidateInit }) => {
      if (data.candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
  }


  leaveMeeting() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop()); 
    }
  
    if (this.peerConnection) {
      this.peerConnection.close(); 
    }
  
    this.socket.emit("leave-meeting", { meetingId: this.meetingId }); 
  
    this.meetingId = ''; 
    this.meetingLink = '';
  
    this.router.navigate(['/']); 
  }
}
