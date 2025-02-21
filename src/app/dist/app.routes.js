"use strict";
exports.__esModule = true;
exports.routes = void 0;
var video_call_component_1 = require("./video-call/video-call.component");
var home_component_1 = require("./home/home.component");
exports.routes = [
    { path: '', component: home_component_1.HomeComponent },
    { path: 'video-call', component: video_call_component_1.VideoCallComponent }
];
