<?php
class YTDownloader {
private $cache_dir;
private $cookie_dir;
private $appSettings;
private $itag_info = array(
// Full Video
5 => "FLV[400x240]",
6 => "FLV[450x270]",
17 => "3GP[176x144]",
18 => "MP4[640x360]",
22 => "HD MP4[1280x720]",
34 => "FLV[640x360]",
35 => "FLV[854x480]",
36 => "3GP[320x180]",
37 => "MP4[1920x1080]",
38 => "MP4[4096x3072]",
43 => "WEBM[640x360]",	
44 => "WEBM[854x480]",
45 => "WEBM[1280x720]",
46 => "WEBM[1920x1080]",
59 => "MP4[854x480]",
78 => "MP4[854x480]",
// DASH videos
137 => "(Video Only) MP4[1920x1080]",
248 => "(Video Only) WEBM[1920x1080]",
136 => "(Video Only) MP4[1280x720]",
247 => "(Video Only) WEBM[1280x720]",
135 => "(Video Only) MP4[854x480]",
244 => "(Video Only) WEBM[854x480]",
134 => "(Video Only) MP4[640x360]",
243 => "(Video Only) WEBM[640x360]",
133 => "(Video Only) MP4[320x240]",
242 => "(Video Only) WEBM[320x240]",
160 => "(Video Only) MP4[176x144]",
278 => "(Video Only) WEBM[176x144]",
// Dash Audios
140 => "(Audio Only) M4A[128Kbps]",
171 => "(Audio Only) WEBM[128Kbps]",
249 => "(Audio Only) WEBM[50Kbps]",
250 => "(Audio Only) WEBM[70Kbps]",
251 => "(Audio Only) WEBM[160Kbps]"
);
private $itag_ext = array(
// Full Video
5 => ".flv",
6 => ".flv",
17 => ".3gp",
18 => ".mp4",
22 => ".mp4",
34 => ".flv",
35 => ".flv",
36 => ".3gp",
37 => ".mp4",
38 => ".mp4",
43 => ".webm",
44 => ".webm",
45 => ".webm",
46 => ".webm",
59 => ".mp4",
78 => ".mp4",
// DASH videos
137 => ".mp4",
248 => ".webm",
136 => ".mp4",
247 => ".webm",
135 => ".mp4",
244 => ".webm",
134 => ".mp4",
243 => ".webm",
133 => ".mp4",
242 => ".webm",
160 => ".mp4",
278 => ".webm",
// Dash Audios
140 => ".mp4",
171 => ".webm",
249 => ".webm",
250 => ".webm",
251 => ".webm"
);
function __construct(){
$this->cache_dir = dirname(__FILE__).'/.cache';
$this->cookie_dir = sys_get_temp_dir();
$this->appSettings = parse_ini_file('../config/config.ini',true);
if(!file_exists($this->cache_dir) && is_writeable(dirname(__FILE__))) {
mkdir($this->cache_dir,0755);
}
}
public function getDownloadLinks($id) {
$returnData = FALSE;
$videoID = $this->extractId($id);
$webPage = $this->curlGet('https://www.youtube.com/watch?v='.$videoID);
if($webPage) {
$sts = null;
if(preg_match('|"sts":([0-9]{4,}),"|i', $webPage, $matches)) {
$sts = $matches[1];
}
foreach(array('vevo', 'embedded', 'detailpage') as $elKey) {
$query = http_build_query(array(
'c' => 'web',
'el' => $elKey,
'hl' => 'en_US',
'sts' => $sts,
'cver' => 'html5',
'eurl' => "https://youtube.googleapis.com/v/{$videoID}",
'html5' => '1',
'iframe' => '1',
'authuser' => '1',
'video_id' => $videoID,
));
if($this->is_Ok($videoData = $this->curlGet("https://www.youtube.com/get_video_info?{$query}"))) {
parse_str($videoData, $videoData);
break;
}
}
if(isset($videoData['status']) && $videoData['status'] !== 'fail') {
$playerData = json_decode($videoData["player_response"]);
$captions = array();
for($i=0;$i<count($playerData->captions->playerCaptionsTracklistRenderer->captionTracks);$i++) {
$caption = array();
$caption["title"] = $playerData->captions->playerCaptionsTracklistRenderer->captionTracks[$i]->name->simpleText;
$caption["lang"] = $playerData->captions->playerCaptionsTracklistRenderer->captionTracks[$i]->languageCode;
$caption["url"] = $playerData->captions->playerCaptionsTracklistRenderer->captionTracks[$i]->baseUrl;
array_push($captions,$caption);
}
$thumbinfo = $playerData->storyboards->playerStoryboardSpecRenderer->spec;
$thumbparts = explode("|",$thumbinfo);
$thumbnum = count($thumbparts)-1;
$thumbdata = explode("#",$thumbparts[$thumbnum]);
$vInfo['Title'] = $playerData->videoDetails->title;
$vInfo['ChannelName'] = $playerData->videoDetails->author;
$vInfo['ChannelId'] = $playerData->videoDetails->channelId;
$vInfo['Thumbnail'] = $playerData->videoDetails->thumbnail->thumbnails[count($playerData->videoDetails->thumbnail->thumbnails)-1]->url;
$vInfo['Duration'] = $playerData->videoDetails->lengthSeconds;
$vInfo['Rating'] = $playerData->videoDetails->averageRating;
$vInfo['Captions'] = $captions;
$vInfo['Thumbs'] = array();
$vInfo['Thumbs']["src"] = "ytthumbs.php?data=".urlencode($thumbinfo);
$vInfo['Thumbs']["width"] = $thumbdata[0]*$thumbdata[3];
$vInfo['Thumbs']["height"] = $thumbdata[1]*ceil($thumbdata[2]/$thumbdata[3]);
$vInfo['Thumbs']["fwidth"] = $thumbdata[0];
$vInfo['Thumbs']["fheight"] = $thumbdata[1];
$vInfo['Thumbs']["fcount"] = $thumbdata[2];
$vInfo['Thumbs']["row"] = $thumbdata[3];
}
if (isset($playerData->streamingData->formats) && isset($playerData->streamingData->adaptiveFormats)) {
$draft1 = $playerData->streamingData->formats;
$draft2 = $playerData->streamingData->adaptiveFormats;
foreach ($draft1 as $key) {
$draftLink[] = $key;
}
foreach ($draft2 as $key) {
$draftLink[] = $key;
}
foreach($draftLink as $dlink) {
if(isset($dlink->cipher)) parse_str($dlink->cipher,$mLink[]);
else $mLink[] = array("url"=>$dlink->url);
$mLink[count($mLink)-1]["itag"] = $dlink->itag;
}
if (isset($mLink[0]['s'])) {
$instructions = $this->get_instructions($webPage);
}
foreach($mLink as $linker) {
if(isset($linker['s'])) {
$linkData[] = array(
'url' => preg_replace('@(https\:\/\/)[^\.]+(\.googlevideo\.com)@', 'https://redirector$2', $linker['url']).'&'.$linker["sp"].'='.$this->sig_decode($linker['s'], $instructions).'&title='.$this->clean_name($playerData->videoDetails->title),
'itag' => $linker['itag'],
'type' => isset($this->itag_info[$linker['itag']]) ? $this->itag_info[$linker['itag']] : 'Unknown'
);
} else {
$linkData[] = array(
'url' => preg_replace('@(https\:\/\/)[^\.]+(\.googlevideo\.com)@', 'https://redirector$2', $linker['url']).'&title='.$this->clean_name($playerData->videoDetails->title),
'itag' => $linker['itag'],
'type' => isset($this->itag_info[$linker['itag']]) ? $this->itag_info[$linker['itag']] : 'Unknown'
);
}
}
}
}
if(!empty($vInfo)) $returnData['info'] = $vInfo;
if(!empty($linkData)) $returnData['dl'] = $linkData;
if(!$returnData && $this->appSettings["Media"]["youplay_fallback"]) $returnData = $this->appSettings["Media"]["invidious"];
return $returnData;
}
protected function curlGet($url) {
if(in_array('curl', get_loaded_extensions())){
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);
//curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
if($this->appSettings["Proxy"]["type"]) {
curl_setopt($ch, CURLOPT_PROXY, $this->appSettings["Proxy"]["type"]."://".$this->appSettings["Proxy"]["domain"].":".$this->appSettings["Proxy"]["port"]);
curl_setopt($ch, CURLOPT_PROXYUSERPWD, $this->appSettings["Proxy"]["username"].":".$this->appSettings["Proxy"]["password"]);
}
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
$result = curl_exec($ch);
curl_close($ch);
return $result;
}
return FALSE;
}
private function is_Ok($var) {
if(!preg_match('|status=fail|i',$var)) {
return true;
}
}
private function extractId($str) {
if(preg_match('/[a-z0-9_-]{11}/i', $str, $matches)){
return $matches[0];
}
return FALSE;
}
private function get_instructions($html) {
$playerPattern = '/"assets":.+?"js":\s*("[^"]+")/';
if(preg_match($playerPattern, $html, $matches) && is_string($_player = json_decode($matches[1])) && strlen($_player) >= 1) {
$playerLink = substr($_player, 0, 2) == '//' ? "https:{$_player}" : "https://www.youtube.com{$_player}";
$cache_player = $this->cache_dir.'/.ht-'.md5($_player);
if(file_exists($cache_player)) {
return unserialize(file_get_contents($cache_player));
} else {
$js_code = $this->curlGet($playerLink);
if($js_code){
if(file_exists($this->cache_dir) && is_writeable($this->cache_dir))
file_put_contents($cache_player, serialize($js_code));
return $js_code;
}
}
}
return false;
}
private function clean_name($name) {
$special_chars = array(".","?", "[", "]", "/", "\\", "=", "<", ">", ":", ";", ",", "'", "\"", "&", "$", "#", "*", "(", ")", "|", "~", "`", "!", "{", "}", "%", "+", chr(0));
$filename = str_replace($special_chars,' ',$name);
$filename = preg_replace( "#\x{00a0}#siu", ' ', $filename );
$filename = str_replace( array( '%20', '+', ' '), '-', $filename );
$filename = preg_replace( '/[\r\n\t -]+/', '-', $filename );
$filename = trim( $filename, '.-_' );
return $filename;
}
private function sig_decode($signature, $js_code) {
$func_name = $this->parseFunctionName($js_code);
$instructions = (array)$this->parseFunctionCode($func_name, $js_code);
foreach($instructions as $opt) {
$command = $opt[0];
$value = $opt[1];
if($command == 'swap') {
$temp = $signature[0];
$signature[0] = $signature[$value % strlen($signature)];
$signature[$value] = $temp;
} elseif ($command == 'splice') {
$signature = substr($signature, $value);
} elseif ($command == 'reverse') {
$signature = strrev($signature);
}
}
return trim($signature);
}
private function parseFunctionName($js_code) {
if (preg_match('@,\s*encodeURIComponent\((\w{2})@is', $js_code, $matches)) {
$func_name = $matches[1];
$func_name = preg_quote($func_name);
return $func_name;
}
else if (preg_match('@\b([a-zA-Z0-9$]{2})\s*=\s*function\(\s*a\s*\)\s*{\s*a\s*=\s*a\.split\(\s*""\s*\)@is', $js_code, $matches)) {
return preg_quote($matches[1]);
}
return null;
}
private function parseFunctionCode($func_name, $player_htmlz) {
if (preg_match('/' . $func_name . '=function\([a-z]+\){(.*?)}/', $player_htmlz, $matches)) {
$js_code = $matches[1];
if (preg_match_all('/([a-z0-9]{2})\.([a-z0-9]{2})\([^,]+,(\d+)\)/i', $js_code, $matches) != false) {
$obj_list = $matches[1];
$func_list = $matches[2];
preg_match_all('/(' . implode('|', $func_list) . '):function(.*?)\}/m', $player_htmlz, $matches2, PREG_SET_ORDER);
$functions = array();
foreach ($matches2 as $m) {
if (strpos($m[2], 'splice') !== false) {
$functions[$m[1]] = 'splice';
} elseif (strpos($m[2], 'a.length') !== false) {
$functions[$m[1]] = 'swap';
} elseif (strpos($m[2], 'reverse') !== false) {
$functions[$m[1]] = 'reverse';
}
}
$instructions = array();
foreach ($matches[2] as $index => $name) {
$instructions[] = array($functions[$name], $matches[3][$index]);
}
return $instructions;
}
}
return null;
}
}
