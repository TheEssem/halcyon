<?php
if(!isset($_COOKIE["session"]) || $_COOKIE["session"] != "true") {
http_response_code(403);
die('Forbidden');
}
?>
<!DOCTYPE html>
<html lang="en" style="height:100%">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="/assets/js/player/youplay.js"></script>
</head>
<body style="margin:0;height:100%;overflow:hidden">
<video class="video-js vjs-default-skin" controls id="player" style="width:100%;height:100%;display:none">
Your browser does not support the video tag.
</video>
<script>
var itag_info = {
5:"FLV[400x240]",
6:"FLV[450x270]",
17:"3GP[176x144]",
18:"MP4[640x360]",
22:"HD MP4[1280x720]",
34:"FLV[640x360]",
35:"FLV[854x480]",
36:"3GP[320x180]",
37:"MP4[1920x1080]",
38:"MP4[4096x3072]",
43:"WEBM[640x360]",	
44:"WEBM[854x480]",
45:"WEBM[1280x720]",
46:"WEBM[1920x1080]",
59:"MP4[854x480]",
78:"MP4[854x480]",
137:"(Video Only) MP4[1920x1080]",
248:"(Video Only) WEBM[1920x1080]",
136:"(Video Only) MP4[1280x720]",
247:"(Video Only) WEBM[1280x720]",
135:"(Video Only) MP4[854x480]",
244:"(Video Only) WEBM[854x480]",
134:"(Video Only) MP4[640x360]",
243:"(Video Only) WEBM[640x360]",
133:"(Video Only) MP4[320x240]",
242:"(Video Only) WEBM[320x240]",
160:"(Video Only) MP4[176x144]",
278:"(Video Only) WEBM[176x144]",
140:"(Audio Only) M4A[128Kbps]",
171:"(Audio Only) WEBM[128Kbps]",
249:"(Audio Only) WEBM[50Kbps]",
250:"(Audio Only) WEBM[70Kbps]",
251:"(Audio Only) WEBM[160Kbps]"
};
var xhr = new XMLHttpRequest();
xhr.open('GET','https://<?=$_GET["server"]?>/api/v1/videos/<?=$_GET["id"]?>');
xhr.onload = function() {
if(xhr.status === 200) {
var data = JSON.parse(xhr.responseText);
document.getElementById("player").setAttribute("title",data.title);
document.getElementById("player").setAttribute("poster",data.videoThumbnails[1].url);
for(var i=0;i<data.captions.length;i++) {
var caption = document.createElement("track");
caption.setAttribute("kind","captions");
caption.setAttribute("label",data.captions[i].label);
caption.src = "https://<?=$_GET["server"]?>"+data.captions[i].url;
document.getElementById("player").appendChild(caption);
}
var streams = new Array;
var audios = new Array;
for(var i=0;i<data.formatStreams.length;i++) {
var stream = new Object();
stream.src = data.formatStreams[i].url.replace(/(https\:\/\/)[^\.]+(\.googlevideo\.com)/,"https://redirector$2");
stream.label = itag_info[data.formatStreams[i].itag];
stream.audio = true;
streams.push(stream);
}
for(var i=0;i<data.adaptiveFormats.length;i++) {
var stream = new Object();
stream.src = data.adaptiveFormats[i].url.replace(/(https\:\/\/)[^\.]+(\.googlevideo\.com)/,"https://redirector$2");
stream.label = itag_info[data.adaptiveFormats[i].itag];
stream.audio = false;
if(stream.label) {
if(stream.label.indexOf("(Audio Only)") != -1) audios.push(stream.src);
else streams.push(stream);
}
}
document.getElementById("player").style.display = "block";
yp_player({share:false,use_desktop_skin:true,sources:streams,audio_url:audios});
}
else document.write("Sorry, there was an error while trying to load your video.");
}
xhr.send();
</script>
</body>
</html>
