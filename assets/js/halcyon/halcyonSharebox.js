function getRandom() {
var s4 = function() {
return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function submitStatus(text) {
const params = {
status:text,
sensitive:false,
spoiler_text:"",
visibility:localStorage.setting_post_privacy
}
api.post("statuses",params,function(data) {
closewin = window.close();
if(!closewin) putMessage(text_cantclose);
});
}
function putMessage(text) {
$(".putmessage").html(text);
}
if(localStorage.getItem("current_id") && localStorage.getItem("current_instance") && localStorage.getItem("current_authtoken")) {
api = new MastodonAPI({
instance:"https://"+localStorage.current_instance,
api_user_token:localStorage.current_authtoken
});
if(sendnow && sessionStorage.return && sessionStorage.return == "share") {
var sharetext = sessionStorage.share_text;
sessionStorage.removeItem("return");
sessionStorage.removeItem("share_text");
$(document).ready(function() {
$(".status_textarea").val(sharetext);
});
submitStatus(sharetext);
}
$(document).ready(function() {
$(".loggedout").hide();
api.get("accounts/verify_credentials",function(AccountObj) {
$(".nav_username").text(AccountObj.username);
$(".js_current_profile_image").attr("src",AccountObj.avatar);
$(".nav_profilelink").attr("href","/@"+AccountObj.username+"@"+localStorage.current_instance+"?mid="+AccountObj.id);
$(".loggedin").show();
});
$(".toot_button.loggedin").click(function(e) {
e.preventDefault();
submitStatus($(".status_textarea").val());
});
});
}
$(document).ready(function() {
autosize($(".status_textarea"));
$("#statusform").submit(function() {
sessionStorage.return = "share";
sessionStorage.share_text = $(".status_textarea").val();
});
}); 
