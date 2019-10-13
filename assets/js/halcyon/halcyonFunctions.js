$(function() {
(function($) {
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
$.fn.attrchange = function(callback) {
if(MutationObserver) {
var options = {
subtree: false,
attributes: true
};
var observer = new MutationObserver(function(mutations) {
mutations.forEach(function(e) {
callback.call(e.target,e.attributeName);
});
});
return this.each(function() {
observer.observe(this,options);
});
}
}
})(jQuery);
(function($) {
$.fn.insertText = function(textToInsert) {
return this.each(function() {
var txt = $(this);
var cursorPosStart = txt.prop('selectionStart');
var cursorPosEnd = txt.prop('selectionEnd');
var v = txt.val();
var textBefore = v.substring(0,cursorPosStart);
var textAfter = v.substring(cursorPosEnd,v.length);
txt.val(textBefore + textToInsert + textAfter);
txt.prop('selectionStart',cursorPosStart + textToInsert.length);
txt.prop('selectionEnd',cursorPosStart + textToInsert.length);
txt.focus();
});
}
})(jQuery);
$.extend($.expr[':'],{
blank:function(el){
return $(el).val().match(/^\s*$/);
}
});
});
function indicesOf(input,value) {
var indices = new Array();
var index = 0;
while(index != -1) {
index = input.indexOf(value,index);
if(index != -1)
indices.push(index++);
}
return indices;
}
function getLinkFromXHRHeader(xhrheaderstring) {
const re = xhrheaderstring.match(/link: <.+api\/v1\/(.+?)>; rel="(.+?)", <.+api\/v1\/(.+?)>; rel="(.+?)"/i);
let di = new Object();
if(re){
di[re[2]] = re[1];
di[re[4]] = re[3];
}
return di;
}
function replaceInternalLink() {
$(".toot_article a,.profile_bio a,.follows_profile_bio a").each(function(i) {
const pltags = $(this).attr('href').match(/https?:\/\/.+..+\/tag\/([a-zA-Z\d_%]+)\/?$/);
if(pltags) $(this).attr('target','_self').attr('href','/search?q='+pltags[1]);
const mstags = $(this).attr('href').match(/https?:\/\/.+..+\/tags\/([a-zA-Z\d_%]+)\/?$/);
if(mstags) $(this).attr('target','_self').attr('href','/search?q='+mstags[1]);
const plusers = $(this).attr('href').match(/https?:\/\/.+..+\/users\/([a-zA-Z\d_]+)(\/statuses\/\d+)\/?$/);
if(plusers) $(this).attr('target','_self').attr('href','/@'+plusers[1]+'@'+$(this).attr('href').split("/")[2]);
const msusers = $(this).attr('href').match(/https?:\/\/.+..+\/@([a-zA-Z\d_]+)\/?$/);
if(msusers) $(this).attr('target','_self').attr('href','/@'+msusers[1]+'@'+$(this).attr('href').split("/")[2]);
const msstatus = $(this).attr('href').match(/https?:\/\/.+..+\/@([a-zA-Z\d_]+)(\/\d+)\/?$/);
if(msstatus) $(this).attr('target','_self').attr('href',"javascript:openStatus('"+msstatus[0]+"');void(0)");
const msstatus2 = $(this).attr('href').match(/https?:\/\/.+..+\/users\/([a-zA-Z\d_]+)\/?$/);
if(msstatus2) $(this).attr('target','_self').attr('href',"javascript:openStatus('"+msstatus2[0]+"');void(0)");
const gsstatus = $(this).attr('href').match(/https?:\/\/.+..+\/notice\/(\d+)\/?$/);
if(gsstatus) $(this).attr('target','_self').attr('href',"javascript:openStatus('"+gsstatus[0]+"');void(0)");
const plstatus = $(this).attr('href').match(/https?:\/\/.+..+\/objects\/([\da-z]{8}-[\da-z]{4}-[\da-z]{4}-[\da-z]{4}-[\da-z]{12})\/?$/);
if(plstatus) $(this).attr('target','_self').attr('href',"javascript:openStatus('"+plstatus[0]+"');void(0)");
const ytcom = $(this).attr('href').match(/https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z\d_-]+)/);
if(ytcom) $(this).attr('target','_self').attr('href',"javascript:openVideo('"+ytcom[2]+"');void(0)");
const ytbe = $(this).attr('href').match(/https?:\/\/(www\.)?youtu\.be\/([a-zA-Z\d_-]+)/);
if(ytbe) $(this).attr('target','_self').attr('href',"javascript:openVideo('"+ytbe[2]+"');void(0)");
const twcom = $(this).attr('href').match(/https?:\/\/(www\.)?twitter\.com\/(.*)/);
if(twcom) $(this).attr('target','_self').attr('href',"javascript:openNitter('"+twcom[2]+"');void(0)");
if(server_setting_unshorten && checkURLshortener($(this).attr('href'))) {
var linkrand = Math.round(Math.random()*1000000);
$(this).attr("data-random",linkrand);
$.ajax("/unshorten.php?url="+encodeURIComponent($(this).attr('href'))).done(function(data) {
$(".toot_article a,.profile_bio a,.follows_profile_bio a").filter("[data-random="+linkrand+"]").attr("href",data);
$(".toot_article a,.profile_bio a,.follows_profile_bio a").filter("[data-random="+linkrand+"]").children().eq(1).text(data.split("//")[0]);
link = data.replace("https://","");
link = link.replace("http://","");
if(link.length > 30) $(".toot_article a,.profile_bio a,.follows_profile_bio a").filter("[data-random="+linkrand+"]").children().eq(1).addClass("ellipsis");
else $(".toot_article a,.profile_bio a,.follows_profile_bio a").filter("[data-random="+linkrand+"]").children().eq(1).removeClass("ellipsis");
$(".toot_article a,.profile_bio a,.follows_profile_bio a").filter("[data-random="+linkrand+"]").children().eq(1).text(link.substr(0,30));
$(".toot_article a,.profile_bio a,.follows_profile_bio a").filter("[data-random="+linkrand+"]").children().eq(2).text(link.substr(30));
});
}
});
}
function getConversionedDate(key, value) {
if (value === null ||
value.constructor !== String ||
value.search(/^\d{4}-\d{2}-\d{2}/g) === -1)
return value;
return new Date(value);
}
function getRelativeDatetime(current_time,posted_time,withdot = true,future = false) {
const calendar = [__("Jan"),__("Feb"),__("Mar"),__("Apr"),__("May"),__("Jun"),__("Jul"),__("Aug"),__("Sep"),__("Oct"),__("Nov"),__("Dec")];
var posted_time_original = posted_time,
posted_time = getConversionedDate(null, posted_time_original).getTime();
if(future) var elapsedTime = Math.ceil((posted_time-current_time)/1000);
else var elapsedTime = Math.ceil((current_time-posted_time)/1000);
var dot = "";
if(withdot) dot = "&middot; ";
if(elapsedTime < 60) {
const datetime = dot + elapsedTime + "s";
return datetime;
}
else if (elapsedTime < 120) {
const datetime = dot+"1m";
return datetime;
}
else if (elapsedTime < (60*60)) {
const datetime = dot + (Math.floor(elapsedTime / 60) < 10 ? " " : "") + Math.floor(elapsedTime / 60) + "m";
return datetime;
}
else if (elapsedTime < (120*60)) {
const datetime = dot+"1h";
return datetime;
}
else if (elapsedTime < (24*60*60)) {
const datetime = dot + (Math.floor(elapsedTime / 3600) < 10 ? " " : "") + Math.floor(elapsedTime / 3600) + "h";
return datetime;
}
else {
const datetime = dot + calendar[posted_time_original.getMonth()] + " " + posted_time_original.getDate();
return datetime;
}
}
function htmlEscape(strings, ...values) {
var handleString = function(str) {
return str.replace(/&/g, '&amp;')
.replace(/>/g, '&gt;')
.replace(/</g, '&lt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;')
.replace(/`/g, '&#096;');
};
var res = '';
for(var i=0, l=strings.length; i<l; i+=1) {
res += handleString(strings[i]);
if(i < values.length) {
res += handleString(values[i]);
}
}
return res;
}
function resetApp() {
current_id = localStorage.getItem("current_id");
current_instance = localStorage.getItem("current_instance");
authtoken= localStorage.getItem("current_authtoken");
api = new MastodonAPI({
instance: 'https://'+current_instance,
api_user_token: authtoken
});
api.get("accounts/verify_credentials",function(AccountObj) {
AccountObj.display_name = htmlEscape(AccountObj.display_name);
for(var i=0;i<AccountObj.emojis.length;i++) {
AccountObj.display_name = AccountObj.display_name.replace(new RegExp(":"+AccountObj.emojis[i].shortcode+":","g"),"<img src='"+AccountObj.emojis[i].url+"' class='emoji'>");
current_filters = new Array;
}
localStorage.setItem("current_display_name",AccountObj["display_name"]);
localStorage.setItem("current_acct",AccountObj["acct"]);
localStorage.setItem("current_header",AccountObj["header"]);
localStorage.setItem("current_avatar",AccountObj["avatar"]);
localStorage.setItem("current_locked",AccountObj["locked"]);
localStorage.setItem("current_statuses_count",AccountObj["statuses_count"]);
localStorage.setItem("current_following_count",AccountObj["following_count"]);
localStorage.setItem("current_followers_count",AccountObj["followers_count"]);
localStorage.setItem("current_follow_loaded","false");
current_display_name = localStorage.getItem("current_display_name");
current_acct = localStorage.getItem("current_acct");
current_header = localStorage.getItem("current_header");
current_avatar = localStorage.getItem("current_avatar");
current_locked = localStorage.getItem("current_locked");
current_statuses_count = localStorage.getItem("current_statuses_count");
current_following_count = localStorage.getItem("current_following_count");
current_followers_count = localStorage.getItem("current_followers_count");
current_search_history = JSON.parse(localStorage.getItem("current_search_history"));
setCurrentProfile();
});
api.get("accounts/"+current_id+"/following",function(data) {
var followings = new Array();
for(var i=0;i<data.length;i++) {
if(data[i].acct.indexOf("@") == -1) {
data[i].acct = data[i].acct+"@"+current_instance;
}
followings.push(data[i].acct);
}
localStorage.setItem("current_following_accts",JSON.stringify(followings));
current_following_accts = followings;
});
api.get("blocks",function(data) {
var blocks = new Array();
for(i=0;i<data.length;i++) {
if(data[i].acct.indexOf("@") == -1) {
data[i].acct = data[i].acct+"@"+current_instance;
}
blocks.push(data[i].acct);
}
localStorage.setItem("current_blocked_accts",JSON.stringify(blocks));
current_blocked_accts = blocks;
});
api.get("mutes",function(data) {
var mutes = new Array();
for(i=0;i<data.length;i++) {
if(data[i].acct.indexOf("@") == -1) {
data[i].acct = data[i].acct+"@"+current_instance;
}
mutes.push(data[i].acct);
}
localStorage.setItem("current_muted_accts",JSON.stringify(mutes));
current_muted_accts = mutes;
});
api.get("instance",function(data) {
if(!data.max_toot_chars) data.max_toot_chars = 500;
if(!data.poll_limits) {
data.poll_limits = new Object();
data.poll_limits.max_options	= 4;
data.poll_limits.max_option_chars	= 25;
data.poll_limits.min_expiration =	300;
data.poll_limits.max_expiration =	2629746;
}
localStorage.setItem("current_instance_charlimit",data.max_toot_chars);
current_instance_charlimit = data.max_toot_chars;
localStorage.setItem("current_instance_poll_limits",JSON.stringify(data.poll_limits));
current_instance_poll_limits = data.poll_limits;
});
api.get("custom_emojis",function(data) {
var emojis = new Array();
for(i=0;i<data.length;i++) {
var emoji = new Object();
emoji.code = data[i].shortcode;
emoji.url = data[i].url;
if(data[i].category) emoji.category = data[i].category;
emojis.push(emoji);
}
localStorage.setItem("current_custom_emojis",JSON.stringify(emojis));
$(document).trigger("emojiready");
});
api.get("filters",function(data) {
localStorage.setItem("current_filters",JSON.stringify(data));
current_filters = data;
});
$.cookie("session","true",{path:'/'});
}
function refreshApp() {
current_id = localStorage.getItem("current_id");
current_instance = localStorage.getItem("current_instance");
authtoken= localStorage.getItem("current_authtoken");
api = new MastodonAPI({
instance: "https://"+current_instance,
api_user_token: authtoken
});
current_display_name = localStorage.getItem("current_display_name");
current_acct = localStorage.getItem("current_acct");
current_header = localStorage.getItem("current_header");
current_avatar = localStorage.getItem("current_avatar");
current_locked = localStorage.getItem("current_locked");
current_statuses_count = localStorage.getItem("current_statuses_count");
current_following_count = localStorage.getItem("current_following_count");
current_followers_count = localStorage.getItem("current_followers_count");
current_following_accts = localStorage.getItem("current_following_accts");
current_instance_charlimit = localStorage.getItem("current_instance_charlimit");
current_instance_poll_limits = JSON.parse(localStorage.getItem("current_instance_poll_limits"));
current_blocked_accts = localStorage.getItem("current_blocked_accts");
current_muted_accts = localStorage.getItem("current_muted_accts");
current_filters = JSON.parse(localStorage.getItem("current_filters"));
current_search_history = JSON.parse(localStorage.getItem("current_search_history"));
$(document).trigger("emojiready");
$(function() {setCurrentProfile()});
}
function setCurrentProfile() {
var is_account_locked = "";
if(current_locked == "true") {
is_account_locked = " <i class='fa fa-lock'></i>";
}
$(".js_current_profile_displayname").html(current_display_name);
$(".js_current_profile_username").html(current_acct+is_account_locked);
$(".js_current_profile_link").attr("href","/@"+current_acct+"@"+current_instance+"?mid="+current_id);
$(".js_current_header_image").attr("src", current_header);
$(".js_current_profile_image").attr("src", current_avatar);
$(".js_current_toots_count").text(current_statuses_count);
$(".js_current_following_count").text(current_following_count);
$(".js_current_followers_count").text(current_followers_count);
$(".current_toots_count_link").attr("href","/@"+current_acct+"@"+current_instance+"?mid="+current_id);
$(".current_following_count_link").attr("href","/@"+current_acct+"@"+current_instance+"/following?mid="+current_id);
$(".current_followers_count_link").attr("href","/@"+current_acct+"@"+current_instance+"/followers?mid="+current_id);
if($(window).width() < 1200) {
responsive_design = true;
$(".left_column").append($("<div>").attr("class","responsive_left").append($(".right_column").children()));
$(".right_column").remove();
}
else {
responsive_design = false;
}
if (Notification.permission === 'default') {
Notification.requestPermission(function(p) {
if (p === 'denied') {
localStorage.setItem("setting_desktop_notifications","false");
}
});
}
else if(Notification.permission == "denied") {
localStorage.setItem("setting_desktop_notifications","false");
}
if(localStorage.setting_who_to_follow == "true") {
setWhoToFollow();
}
setTrendingHashtags();
if(!localStorage.hide_firefox_download || localStorage.hide_firefox_download != "true") $("#widget_ffdl").show();
replace_emoji();
}
function putMessage(Message) {
$('#overlay_message').addClass('view');
$('#overlay_message section span').text(Message);
setTimeout(function(){
$("#overlay_message").removeClass("view");
},3000);
};
function pushNotification(title,message) {
if (window.Notification && localStorage.setting_desktop_notifications == "true") {
if (Notification.permission === 'granted') {
notify = new Notification(title, {
body: message,
icon: '/assets/images/halcyon_logo.png'  
});
}
}
}
function getRandom() {
var s4 = function() {
return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function randomNumber(min,max) {
return Math.floor(Math.random() * (max - min)) + min;
}
function setWhoToFollow(sanimate) {
if(sanimate == true) {
$(".follow_opt_in").slideUp(function() {$(".follow_loading").slideDown()});
}
else {
$(".follow_opt_in").hide();
$(".follow_loading").show();
}
if(localStorage.current_follow_loaded == "true") {
if(localStorage.who_to_follow) {
follow_loaded = 0;
var wtflist = JSON.parse(localStorage.who_to_follow);
addFollowProfile(0,wtflist[randomNumber(0,wtflist.length)]);
addFollowProfile(1,wtflist[randomNumber(0,wtflist.length)]);
addFollowProfile(2,wtflist[randomNumber(0,wtflist.length)]);
var checkload = setInterval(function() {
if(follow_loaded == 3) {
clearInterval(checkload);
$(".follow_loading").hide();
$(".what_to_follow").show();
replace_emoji();
}
},100);
}
else {
$("#follow_icon").removeClass("fa-circle-o-notch").removeClass("fa-spin").addClass("fa-id-card-o").addClass("fa-stack-1x").after($("<i>").addClass("fa").addClass("fa-ban").addClass("fa-stack-2x"));
}
}
else {
var url = $("#who-to-follow-provider").html();
url = url.replace(/{{host}}/g, encodeURIComponent(current_instance));
url = url.replace(/{{user}}/g, encodeURIComponent(current_acct));
$.ajax(url).done(function(data) {
localStorage.current_follow_loaded = true;
if(data.status == 200) {
var wtflist = new Array();
for(i=0;i<data.ids.length;i++) {
if(current_following_accts.indexOf(data.ids[i].to_id) == -1 && current_blocked_accts.indexOf(data.ids[i].to_id) == -1 && current_muted_accts.indexOf(data.ids[i].to_id) == -1) {
wtflist.push(data.ids[i].to_id);
}
}
localStorage.who_to_follow = JSON.stringify(wtflist);
}
setWhoToFollow();
}).fail(function(xhr) {
if(xhr.readyState == 0) {
setWhoToFollow();
}
});
}
}
function addFollowProfile(id,account) {
api.get('search',[{name:'q',data:"@"+account},{name:'resolve',data:'true'}], function(search) {
search.accounts[0].display_name = htmlEscape(search.accounts[0].display_name);
for(i=0;i<search.accounts[0].emojis.length;i++) {
search.accounts[0].display_name = search.accounts[0].display_name.replace(new RegExp(":"+search.accounts[0].emojis[i].shortcode+":","g"),"<img src='"+search.accounts[0].emojis[i].url+"' class='emoji'>");
}
if(search.accounts[0].display_name.length == 0) {
search.accounts[0].display_name = search.accounts[0].username;
}
var wtf_account_link;
if(search.accounts[0].acct.indexOf("@") == -1) wtf_account_link = "/@"+search.accounts[0].acct+"@"+current_instance+"?mid="+search.accounts[0].id;
else wtf_account_link = "/@"+search.accounts[0].acct+"?mid="+search.accounts[0].id;
$('.what_to_follow_'+id+' > .icon_box img').attr('src',search.accounts[0].avatar);
$('.what_to_follow_'+id+' .label_box > a').attr('href',wtf_account_link);
$('.what_to_follow_'+id+' .label_box > a > h3 .dn').addClass("emoji_poss").html(search.accounts[0].display_name);
$('.what_to_follow_'+id+' .label_box > a > h3 .un').text('@'+search.accounts[0].username);
$('.what_to_follow_'+id+' .label_box > .follow_button').attr('mid',search.accounts[0].id);
$('.what_to_follow_'+id+' .label_box > .follow_button').attr('data',search.accounts[0].url);
follow_loaded++;
});
}
function setTrendingHashtags() {
api.get("trends",function(data) {
if(data.length == 0) $("#trends_icon").removeClass("fa-circle-o-notch").removeClass("fa-spin").addClass("fa-hashtag").addClass("fa-stack-1x").after($("<i>").addClass("fa").addClass("fa-ban").addClass("fa-stack-2x"));
else {
for(var i=0;i<5;i++) {
if(i < data.length) {
var ht_toots = 0;
var ht_users = 0;
for(var a=0;a<data[i].history.length;a++) {
ht_toots += parseInt(data[i].history[a].uses);
ht_users += parseInt(data[i].history[a].accounts);
}
$(".trending_hashtags .trending_"+i+" a").attr("href","/search?q="+data[i].name);
$(".trending_hashtags .trending_"+i+" .dn").text("#"+data[i].name);
$(".trending_hashtags .trending_"+i+" .un").text(ht_toots+" "+__("toots by")+" "+ht_users+" "+__("users"));
}
else {
$(".trending_hashtags .trending_"+i).remove();
}
}
$(".trends_loading").hide();
$(".trending_hashtags").show();
}
},function() {
$("#trends_icon").removeClass("fa-circle-o-notch").removeClass("fa-spin").addClass("fa-hashtag").addClass("fa-stack-1x").after($("<i>").addClass("fa").addClass("fa-ban").addClass("fa-stack-2x"));
});
}
function checkEmojiSupport() {
var ctx = document.createElement("canvas").getContext("2d");
ctx.fillText("😗",-2,4);
return ctx.getImageData(0,0,1,1).data[3] > 0;
}
function openStatus(link) {
api.get("search?q="+link,function(response) {
if(response.statuses.length > 0) {
var data = response.statuses[0];
if(data.account.acct.indexOf("@") == -1) {
data.account.acct = data.account.acct+"@"+current_instance;
}
window.location.href = "/@"+data.account.acct+"/status/"+data.id+"&mid="+data.account.id;
}
else {
window.location.href = "/404";
}
});
}
function openVideo(video) {
if(localStorage.setting_redirect_invidious == "true") window.open("https://"+server_setting_invidious+"/watch?v="+video,"_blank");
else if(localStorage.setting_redirect_invidious == "false") window.open("https://www.youtube.com/watch?v="+video,"_blank");
else {
$("#js-overlay_content_wrap .temporary_object").empty();
$('#js-overlay_content_wrap').addClass('view');
$('#js-overlay_content_wrap').addClass('black_08');
$('.overlay_redirect_invidious').data("video",video);
$('.overlay_redirect_invidious').removeClass('invisible');
}
}
function openNitter(path) {
if(localStorage.setting_redirect_nitter == "true") window.open("https://"+server_setting_nitter+"/"+path,"_blank");
else if(localStorage.setting_redirect_nitter == "false") window.open("https://twitter.com/"+path,"_blank");
else {
$("#js-overlay_content_wrap .temporary_object").empty();
$('#js-overlay_content_wrap').addClass('view');
$('#js-overlay_content_wrap').addClass('black_08');
$('.overlay_redirect_nitter').data("path",path);
$('.overlay_redirect_nitter').removeClass('invisible');
}
}
function checkStatusLinks(text) {
$("<span>"+text+"</span>").find("a").each(function(i) {
const ytcom = $(this).attr('href').match(/https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z\d_-]+)/);
const htcom = $(this).attr('href').match(/https?:\/\/(www\.)?hooktube\.com\/watch\?v=([a-zA-Z\d_-]+)/);
const ivcom = $(this).attr('href').match(/https?:\/\/(www\.)?invidio\.us\/watch\?v=([a-zA-Z\d_-]+)/);
const ytbe = $(this).attr('href').match(/https?:\/\/(www\.)?youtu\.be\/([a-zA-Z\d_-]+)/);
const htbe = $(this).attr('href').match(/https?:\/\/(www\.)?hooktube\.com\/([a-zA-Z\d_-]+)/);
const vimeo = $(this).attr('href').match(/https?:\/\/(www\.)?vimeo\.com\/([\d]+)/);
const peertube = $(this).attr('href').match(/https?:\/\/.+..+\/videos\/watch\/([\da-z]{8}-[\da-z]{4}-[\da-z]{4}-[\da-z]{4}-[\da-z]{12})\/?$/);
if(ytcom) text += embedMedia("youtube",ytcom[2]);
else if(htcom) text += embedMedia("youtube",htcom[2]);
else if(ivcom) text += embedMedia("youtube",ivcom[2]);
else if(ytbe) text += embedMedia("youtube",ytbe[2]);
else if(htbe) text += embedMedia("youtube",htbe[2]);
else if(vimeo) text += embedMedia("vimeo",vimeo[2]);
else if(peertube) text += embedMedia("peertube",peertube[0].replace("/watch/","/embed/"));
});
return text;
}
function embedMedia(source,watchid) {
let media_views = `<div class='media_views' media_length='1' style="border:0;border-radius:0">`;
if(source == "youtube" && server_setting_youplay == true && localStorage.setting_play_youplay == "true") {
media_views += (`
<div class="media_attachment" otype="video/gifv" mediacount="0">
<iframe src="/media/youplay.php?id=${watchid}" frameborder="0" allowfullscreen></iframe>
</div>`);
}
else if(source == "youtube" && localStorage.setting_play_invidious == "true") {
media_views += (`
<div class="media_attachment" otype="video/gifv" mediacount="0">
<iframe src="https://${server_setting_invidious}/embed/${watchid}" frameborder="0" allowfullscreen></iframe>
</div>`);
}
else if(source == "vimeo" && server_setting_vimeo == true && localStorage.setting_play_vimeo == "true") {
media_views += (`
<div class="media_attachment" otype="video/gifv" mediacount="0">
<iframe src="/media/vimeo.php?id=${watchid}" frameborder="0" allowfullscreen></iframe>
</div>`);
}
else if(source == "peertube" && localStorage.setting_play_peertube == "true") {
media_views += (`
<div class="media_attachment" otype="video/gifv" mediacount="0">
<iframe src="${watchid}" frameborder="0" allowfullscreen></iframe>
</div>`);
}
media_views += "</div>";
if($(media_views).children().length != 0) return media_views;
else return "";
}
function enableAutoComplete(textarea) {
if(localStorage.setting_compose_autocomplete == "true") {
textarea.autoCompleteToken({instance:1,startkey:"@",endkey:" ",arrayname:"accounts",resultname:"acct"});
textarea.autoCompleteToken({instance:2,startkey:"#",endkey:" ",arrayname:"hashtags"});
textarea.autoCompleteToken({instance:3,startkey:":",endkey:";",source:actEmojiData,resultname:"name",callback:function() {
textarea.trigger({"type":"keyup","key":":"});
}});
}
}
function submitStatusArray(params,callback,invidious="unset",nitter="unset") {
const ytcom = params.status.first().val().match(/https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z\d_-]+)/);
const ytbe = params.status.first().val().match(/https?:\/\/(www\.)?youtu\.be\/([a-zA-Z\d_-]+)/);
const twcom = params.status.first().val().match(/https?:\/\/(www\.)?twitter\.com\/(.*)/);
if((ytcom || ytbe) && localStorage.setting_rewrite_invidious == "unset" && invidious == "unset") {
$("#js-overlay_content_wrap .temporary_object").empty();
$('#js-overlay_content_wrap').addClass('view');
$('#js-overlay_content_wrap').addClass('black_08');
$('.overlay_rewrite_invidious').data("params",params);
$('.overlay_rewrite_invidious').data("callback",callback);
$('.overlay_rewrite_invidious').data("nitter",nitter);
$('.overlay_rewrite_invidious').removeClass('invisible');
}
else if(twcom && localStorage.setting_rewrite_nitter == "unset" && nitter == "unset") {
$("#js-overlay_content_wrap .temporary_object").empty();
$('#js-overlay_content_wrap').addClass('view');
$('#js-overlay_content_wrap').addClass('black_08');
$('.overlay_rewrite_nitter').data("params",params);
$('.overlay_rewrite_nitter').data("callback",callback);
$('.overlay_rewrite_nitter').data("invidious",invidious);
$('.overlay_rewrite_nitter').removeClass('invisible');
}
if(ytcom && (localStorage.setting_rewrite_invidious == "true" || invidious == "true")) {
params.status.first().val(params.status.first().val().replace(/https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z\d_-]+)/,"https://"+server_setting_invidious+"/watch?v=$2"));
submitStatusArray(params,callback,invidious,nitter);
}
else if(ytbe && (localStorage.setting_rewrite_invidious == "true" || invidious == "true")) {
params.status.first().val(params.status.first().val().replace(/https?:\/\/(www\.)?youtu\.be\/([a-zA-Z\d_-]+)/,"https://"+server_setting_invidious+"/watch?v=$2"));
submitStatusArray(params,callback,invidious,nitter);
}
else if(twcom && (localStorage.setting_rewrite_nitter == "true" || nitter == "true")) {
params.status.first().val(params.status.first().val().replace(/https?:\/\/(www\.)?twitter\.com\/(.*)/,"https://"+server_setting_nitter+"/$2"));
submitStatusArray(params,callback,invidious,nitter);
}
else if(((!ytcom && !ytbe) || localStorage.setting_rewrite_invidious == "false" || invidious == "false") && (!twcom || localStorage.setting_rewrite_nitter == "false" || nitter == "false")) submitStatusArrayNow(params,callback);
}
function submitStatusArrayNow(params,callback,invidious,nitter) {
var statuses = params.status;
params.status = params.status.first().val();
api.post("statuses",params,function(data) {
statuses = statuses.filter(function(index) {return index != 0});
if(statuses.length == 0) {
callback();
}
else {
var nparams = new Object();
nparams.status = statuses;
nparams.visibility = params.visibility;
nparams.spoiler_text = params.spoiler_text;
nparams.in_reply_to_id = data.id;
submitStatusArray(nparams,callback,invidious,nitter);
}
});
}
function checkURLshortener(link) {
var short = true;
if(link.indexOf("https://") != -1 || link.indexOf("http://") != -1) {
if(link.indexOf("://www.") != -1) short = false;
link = link.replace("https://","");
link = link.replace("http://","");
var short_handle = link.split("/");
var domain = link.split(".");
if(domain.length == 2) var sld = domain[0];
else var sld = domain[1];
if(sld.length < 1 || sld.length > 7) short = false;
if(short_handle.length != 2) short = false;
else if(!short_handle[1].match(/^[a-zA-Z0-9_-]+$/)) short = false;
else if(short_handle[1].length > 10) short = false;
}
else short = false;
return short;
}
function prepareStatus(status) {
if(status.reblog === null) {
status.halcyon = new Object();
for(i=0;i<status.emojis.length;i++) {
status.content = status.content.replace(new RegExp(":"+status.emojis[i].shortcode+":","g"),"<img src='"+status.emojis[i].url+"' class='emoji'>");
}
status.account.display_name = htmlEscape(status.account.display_name);
for(var i=0;i<status.account.emojis.length;i++) {
status.account.display_name = status.account.display_name.replace(new RegExp(":"+status.account.emojis[i].shortcode+":","g"),"<img src='"+status.account.emojis[i].url+"' class='emoji'>");
}
for(var i=0;i<status.mentions.length;i++) {
if(status.mentions[i].acct.indexOf("@") == -1) status.content = status.content.replace(new RegExp('href="'+status.mentions[i].url+'"',"g"),'href="/@'+status.mentions[i].acct+'@'+current_instance+'?mid='+status.mentions[i].id+'" data-mid="'+status.mentions[i].id+'"');
else status.content = status.content.replace(new RegExp('href="'+status.mentions[i].url+'"',"g"),'href="/@'+status.mentions[i].acct+'?mid='+status.mentions[i].id+'" data-mid="'+status.mentions[i].id+'"');
}
if(!status.mentions.find(function(account) {
return account.id == this;
},status.account.id)) {
var writtenby = new Object();
writtenby.id = status.account.id;
writtenby.username = status.account.username;
writtenby.url = status.account.url;
writtenby.acct = status.account.acct;
status.mentions.push(writtenby);
}
if(status.account.acct.indexOf("@") == -1)  status.halcyon.account_link = "/@"+status.account.acct+"@"+current_instance+"?mid="+status.account.id;
else status.halcyon.account_link = "/@"+status.account.acct+"?mid="+status.account.id;
status.halcyon.datetime= getRelativeDatetime(Date.now(), getConversionedDate(null, status.created_at));
status.halcyon.attr_datetime = getConversionedDate(null, status.created_at);
status.halcyon.alert_text = "";
status.halcyon.article_option = "";
status.halcyon.media_views = "";
status.halcyon.poll_object = "";
status.halcyon.preview_object = "";
if(status.spoiler_text && localStorage.setting_show_content_warning == "false") {
status.halcyon.alert_text = "<span>"+status.spoiler_text+"</span><button class='cw_button'>"+__('SHOW MORE')+"</button>",
status.halcyon.article_option = "content_warning";
}
else if(status.spoiler_text && localStorage.setting_show_content_warning == "true")
status.halcyon.alert_text = "<span>"+status.spoiler_text+"</span><button class='cw_button'>"+__('SHOW LESS')+"</button>";
if(!status.replies_count) status.replies_count = "";
if(!status.reblogs_count) status.reblogs_count = "";
if(!status.favourites_count) status.favourites_count = "";
if(status.media_attachments.length) status.halcyon.media_views = mediaattachments_template(status);
if(status.poll) status.halcyon.poll_object = poll_template(status.poll);
if(status.card) status.halcyon.preview_object = link_preview_template(status.card);
if(status.account.display_name.length == 0) status.account.display_name = status.account.username;
status.halcyon.checked_public = "";
status.halcyon.checked_unlisted = "";
status.halcyon.checked_private = "";
status.halcyon.checked_direct = "";
switch(status.visibility) {
case "public":status.halcyon.privacy_mode=__("Public");status.halcyon.privacy_icon="globe";status.halcyon.checked_public=" checked";break;
case "unlisted":status.halcyon.privacy_mode=__("Unlisted");status.halcyon.privacy_icon="unlock-alt";status.halcyon.checked_unlisted=" checked";break;
case "private":status.halcyon.privacy_mode=__("Followers-only");status.halcyon.privacy_icon="lock";status.halcyon.checked_private=" checked";break;
case "direct":status.halcyon.privacy_mode=__("Direct");status.halcyon.privacy_icon="envelope";status.halcyon.checked_direct=" checked";break;
}
if(status.halcyon.privacy_icon == "globe" || status.halcyon.privacy_icon == "unlock-alt") {
status.halcyon.footer_width = " style='width:320px'";
status.halcyon.reblog_button = (`<div class="toot_reaction">
<button class="boost_button" tid="${status.id}" reblogged="${status.reblogged}">
<i class="fa fa-fw fa-retweet"></i>
<span class="reaction_count boost_count">${status.reblogs_count}</span>
</button>
</div>`);
}
else {
status.halcyon.footer_width = "";
status.halcyon.reblog_button = "";
}
if(status.account.acct == current_acct) {
status.halcyon.own_toot_buttons = (`<li><a class="delete_button" tid="${status.id}">${__('Delete Toot')}</a></li>`);
if(status.pinned == true) status.halcyon.own_toot_buttons += (`<li><a class="unpin_button" tid="${status.id}">${__('Unpin Toot')}</a></li>`);
else status.halcyon.own_toot_buttons += (`<li><a class="pin_button" tid="${status.id}">${__('Pin Toot')}</a></li>`);
}
else {
status.halcyon.own_toot_buttons = (`<li><a class="mute_button" mid="${status.account.id}" sid="${status.id}">${__('Mute')} @${status.account.username}</a></li>
<li><a class="block_button" mid="${status.account.id}" sid="${status.id}">${__('Block')} @${status.account.username}</a></li>
<li><a class="addlist_button" mid="${status.account.id}" sid="${status.id}" display_name="${status.account.display_name}">${__('Add to list')} @${status.account.username}</a></li>
<li><a class="report_button" mid="${status.account.id}" sid="${status.id}" display_name="${status.account.display_name}">${__('Report this Toot')}</a></li>`);
if(localStorage.setting_show_admin && localStorage.setting_show_admin == "true") {
status.halcyon.own_toot_buttons += (`</ul><ul><li><a href="https://${current_instance}/admin/accounts/${status.account.id}" target="_blank" class="admin_user_button">${__('Open user as admin')}</a></li>
<li><a href="https://${current_instance}/admin/accounts/${status.account.id}/statuses/${status.id}" target="_blank" class="admin_post_button">${__('Open post as admin')}</a></li>`);
}
}
status.halcyon.account_state_icons = "";
if(status.account.locked == true) status.halcyon.account_state_icons += " <i class='fa fa-lock'></i>";
if(status.account.bot == true) status.halcyon.account_state_icons += " <img src='/assets/images/robot.svg' class='emoji'>";
status.content = checkStatusLinks(status.content);
return status;
}
else {
status.reblog = prepareStatus(status.reblog);
status.halcyon = new Object();
status.account.display_name = htmlEscape(status.account.display_name);
for(i=0;i<status.account.emojis.length;i++) {
status.account.display_name = status.account.display_name.replace(new RegExp(":"+status.account.emojis[i].shortcode+":","g"),"<img src='"+status.account.emojis[i].url+"' class='emoji'>");
}
if(status.account.acct.indexOf("@") == -1) status.halcyon.account_link = "/@"+status.account.acct+"@"+current_instance+"?mid="+status.account.id;
else status.halcyon.account_link = "/@"+status.account.acct+"?mid="+status.account.id;
if(status.account.display_name.length == 0) status.account.display_name = status.account.username;
}
return status;
}
