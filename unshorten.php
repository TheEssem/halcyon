<?php
ini_set("display_errors",1);
error_reporting(E_ALL);
$config = parse_ini_file('config/config.ini',true);
function checkCode($config,$url) {
if(in_array('curl',get_loaded_extensions())) {
$ch = curl_init($url);
curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (X11; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0');
curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch,CURLOPT_NOBODY,true);
if($config["Proxy"]["type"]) {
curl_setopt($ch,CURLOPT_PROXY,$config["Proxy"]["type"]."://".$config["Proxy"]["domain"].":".$config["Proxy"]["port"]);
curl_setopt($ch,CURLOPT_PROXYUSERPWD,$config["Proxy"]["username"].":".$config["Proxy"]["password"]);
}
curl_exec($ch);
$httpcode = curl_getinfo($ch,CURLINFO_HTTP_CODE);
curl_close($ch);
if($httpcode == 301 || $httpcode == 302) return checkRedirect($config,$url);
else return $url;
}
else return $url;
}
function checkRedirect($config,$url) {
$ch = curl_init($_GET['url']);
curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (X11; Linux x86_64; rv:62.0) Gecko/20100101 Firefox/62.0');
curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch,CURLOPT_NOBODY,true);
if($config["Proxy"]["type"]) {
curl_setopt($ch,CURLOPT_PROXY,$config["Proxy"]["type"]."://".$config["Proxy"]["domain"].":".$config["Proxy"]["port"]);
curl_setopt($ch,CURLOPT_PROXYUSERPWD,$config["Proxy"]["username"].":".$config["Proxy"]["password"]);
}
curl_exec($ch);
$redirect = curl_getinfo($ch,CURLINFO_REDIRECT_URL);
if(isset($redirect) && !empty($redirect)) return checkCode($config,$redirect);
else return $url;
}
echo checkCode($config,$_GET['url']);
?>
