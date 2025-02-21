"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AppComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var socket_io_client_1 = require("socket.io-client");
var AppComponent = /** @class */ (function () {
    function AppComponent(route, router, platformId) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.platformId = platformId;
        this.meetingId = '';
        this.meetingLink = '';
        this.config = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        };
        if (common_1.isPlatformBrowser(this.platformId)) {
            this.socket = socket_io_client_1.io("https://shall-we-connect-backend.onrender.com"); // Change to your backend URL
        }
        // Get meeting ID from URL
        this.route.queryParams.subscribe(function (params) {
            if (params['meeting']) {
                _this.meetingId = params['meeting'];
            }
        });
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        if (typeof window !== 'undefined') {
            this.setupPeerConnection();
            this.listenForSignals();
        }
        else {
            console.warn("WebRTC is disabled in SSR mode.");
        }
    };
    AppComponent.prototype.setupPeerConnection = function () {
        var _this = this;
        if (typeof window === 'undefined') {
            console.error("RTCPeerConnection is not available in SSR.");
            return;
        }
        this.peerConnection = new RTCPeerConnection(this.config);
        this.peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                _this.socket.emit("ice-candidate", { candidate: event.candidate, meetingId: _this.meetingId });
            }
        };
        this.peerConnection.ontrack = function (event) {
            if (!_this.remoteStream) {
                _this.remoteStream = new MediaStream();
                _this.remoteVideo.nativeElement.srcObject = _this.remoteStream;
            }
            _this.remoteStream.addTrack(event.track);
        };
    };
    AppComponent.prototype.generateMeetingLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.meetingId = Math.random().toString(36).substring(2, 10); // Generate unique ID
                this.meetingLink = window.location.origin + "/video-call?meeting=" + this.meetingId;
                return [2 /*return*/];
            });
        });
    };
    AppComponent.prototype.copyLink = function () {
        navigator.clipboard.writeText(this.meetingLink).then(function () {
            alert("Meeting link copied!");
        });
    };
    AppComponent.prototype.joinMeeting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.socket.emit("join-meeting", { meetingId: this.meetingId });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ video: true, audio: true })];
                    case 2:
                        _a.localStream = _b.sent();
                        this.localVideo.nativeElement.srcObject = this.localStream;
                        this.localStream.getTracks().forEach(function (track) {
                            _this.peerConnection.addTrack(track, _this.localStream);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error("Error accessing media devices: ", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.listenForSignals = function () {
        var _this = this;
        this.socket.on("user-joined", function () { return __awaiter(_this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.peerConnection.createOffer()];
                    case 1:
                        offer = _a.sent();
                        return [4 /*yield*/, this.peerConnection.setLocalDescription(offer)];
                    case 2:
                        _a.sent();
                        this.socket.emit("offer", { offer: offer, meetingId: this.meetingId });
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("offer", function (data) { return __awaiter(_this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.peerConnection.createAnswer()];
                    case 2:
                        answer = _a.sent();
                        return [4 /*yield*/, this.peerConnection.setLocalDescription(answer)];
                    case 3:
                        _a.sent();
                        this.socket.emit("answer", { answer: answer, meetingId: this.meetingId });
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("answer", function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("ice-candidate", function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.candidate) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    };
    __decorate([
        core_1.ViewChild('localVideo')
    ], AppComponent.prototype, "localVideo");
    __decorate([
        core_1.ViewChild('remoteVideo')
    ], AppComponent.prototype, "remoteVideo");
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            standalone: true,
            imports: [router_1.RouterOutlet, common_1.CommonModule],
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        }),
        __param(2, core_1.Inject(core_1.PLATFORM_ID))
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
