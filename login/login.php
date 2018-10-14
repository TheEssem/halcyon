<?php
require_once('../authorize/mastodon.php');
use HalcyonSuite\HalcyonForMastodon\Mastodon;
if (isset($_POST['acct'])) {
$domain = explode("@", mb_strtolower(htmlspecialchars((string)filter_input(INPUT_POST, 'acct'), ENT_QUOTES)))[2];
$URL= 'https://'.$domain;
$api= new Mastodon();
if ( !preg_match('/(^[a-z0-9\-\.\/]+?\.[a-z0-9-]+$)/', $domain) ) {
header('Location: '.$api->clientWebsite.'/login?cause=domain', true, 303);
die();
} else {
try {
$client_id = $api->getInstance($URL)["client_id"];
$authorizeURL= $URL.'/oauth/authorize?client_id='.$client_id.'&response_type=code&scope=read+write+follow&website='.$api->clientWebsite.'&redirect_uri='.urlencode($api->clientWebsite.'/auth?&host='.$domain);
header("Location: {$authorizeURL}", true, 303);
die();
} catch (Exception $e) {
header('Location: '.$api->clientWebsite.'/login?cause=domain', true, 303);
die();
}
}
}
include("../language.php");
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Halcyon</title>
<link rel="shortcut icon" href="/assets/images/favicon.ico">
<link rel="stylesheet" href="/login/assets/css/style.css" media="all">
<link rel="stylesheet" href="/assets/css/fontawesome.min.css" media="all">
<link rel="stylesheet" href="/assets/css/cookieconsent.min.css">
<script src="/assets/js/jquery/jquery.min.js"></script>
<script src="/assets/js/cookieconsent/cookieconsent.min.js"></script>
<script src="/assets/js/jquery-cookie/src/jquery.cookie.js"></script>
<script src="/login/assets/js/halcyon_login.js"></script>
<script>
if(
localStorage.getItem("current_id") |
localStorage.getItem("current_instance") |
localStorage.getItem("current_authtoken")
){
location.href = "/";
};
</script>
</head>
<body>
<header id="header">
<div id="header_wrap">
<div id="header_title_wrap" class="header_box header_right_box">
<div class="header_box_child title_box">
<a href="/">
<img src="/login/assets/images/halcyon-title.png" alt="Halcyon for mastodon">
</a>
</div>
</div>
<div id="header_menu_wrap" class="header_box header_left_box">
<nav class="header_box_child nav_box">
<ul>
<a href="https://social.csswg.org/@halcyon" class="no-underline">
<li>
<span><i class="fa fa-newspaper-o" aria-hidden="true"></i><?=_('News')?></span>
</li>
</a>
<a href="https://notabug.org/halcyon-suite/halcyon" class="no-underline">
<li>
<span><i class="fa fa-code" aria-hidden="true"></i><?=_('Source')?></span>
</li>
</a>
<a href="/terms" class="no-underline">
<li>
<span><i class="fa fa-balance-scale" aria-hidden="true"></i><?=_('Terms')?></span>
</li>
</a>
<a href="/privacy" class="no-underline">
<li>
<span><i class="fa fa-shield" aria-hidden="true"></i><?=_('Privacy')?></span>
</li>
</a>
<?php if(file_exists("../config/imprint.txt")) { ?>
<a href="/imprint" class="no-underline">
<li>
<span><i class="fa fa-id-card-o" aria-hidden="true"></i><?=_('Imprint')?></span>
</li>
</a>
<?php } ?>
<a href="http://www.nikisoft.one/contact.php" class="no-underline">
<li>
<span><i class="fa fa-envelope" aria-hidden="true"></i><?=_('Contact')?></span>
</li>
</a>
<a href="#login_form_wrap" class="no-underline">
<li>
<span><i class="fa fa-user-circle-o" aria-hidden="true"></i><?=_('Login')?></span>
</li>
</a>
</ul>
</nav>
</div>
</div>
</header>
<main id="main">
<div id="login_form_wrap">
<div class="login_form">
<form method="POST" >
<h2><?=_('Login to Halcyon')?></h2>
<p>
<?=_('or')?> <a href="https://joinmastodon.org/"><?=_('create an account')?></a>
</p>
<div class="session_aleart">
<span></span>
</div>
<div class="login_form_main">
<input name="acct" type="text" class="login_form_input" placeholder="@johndoe@example.com" required>
<label class="login_form_continue pointer">
<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>
<input id="login_continue" type="submit" value="" class="invisible"></input>
</label>
</div>
<div class="login_form_agree">
<input id="agree" type="checkbox" required checked>
<label for="agree" class="login_form_agree_check disallow_select pointer">
<?=_('I agree with the')?> <a href="/terms"><?=_('Terms')?></a>
</label>
</div>
</form>
</div>
</div>
<article id="article">
<h2><?=_('What is Halcyon')?></h2>
<p>
<?=_('Halcyon is a webclient for')?><a href="https://joinmastodon.org"> Mastodon </a><?=_('and')?><a href="https://pleroma.social"> Pleroma </a><?=_('which aims to recreate the simple and beautiful user interface of Twitter while keeping all advantages of decentral networks in focus.')?>
</p>
<div class="image_wrap">
<ul>
<li><img src="/login/assets/images/preview2.png" alt="halcyon_screenshot"></li>
<li><img src="/login/assets/images/preview1.png" alt="halcyon_screenshot"></li>
<li><img src="/login/assets/images/preview0.png" alt="halcyon_screenshot"></li>
</ul>
<button class="prev_button switch_button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>
<button class="next_button switch_button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>
</div>
<h2><?=_('Contact / Feedback')?></h2>
<p>
Mastodon: <a href="https://social.csswg.org/@halcyon" target="_blank">@halcyon@social.csswg.org</a><br/>
Email: <a href="http://www.nikisoft.one/contact.php" target="_blank"><?=_('Use my contact form')?></a><br/>
Git repository: <a href="https://notabug.org/halcyon-suite/halcyon" target="_blank">halcyon-suite/halcyon</a>
</p>
<h2><?=_('Help us')?></h2>
<p>
Bitcoin: 1D6GThQqHQYnruKYrKyW9JC86ZGWxjt1hK<br/>
Liberapay: <a href="https://liberapay.com/nipos">Donate to @nipos</a>
</p>
</article>
</main>
<!-- FOOTER -->
<footer id="footer">
<div class="footer_anchor">
<a href="#">
<i class="fa fa-angle-up" aria-hidden="true"></i>
</a>
</div>
<span>Photo by <a href="https://www.flickr.com/photos/95387826@N08/">Michio Morimoto on Flickr</a> (CC BY 2.0)</span><br/>
<?php
if(file_exists("../config/footerlinks.txt")) {
$footerlinks = json_decode(file_get_contents("../config/footerlinks.txt"));
$haslinks = false;
for($i=0;$i<count($footerlinks);$i++) {
if($footerlinks[$i]->logout == true) {
if($haslinks == false) {
$haslinks = true;
echo "<span>";
}
else {
echo " | ";
}
echo "<a href='".$footerlinks[$i]->link."'>".$footerlinks[$i]->title."</a>";
}
}
if($haslinks == true) {
echo "</span><br/>";
}
}
?>
<span>Halcyon version <?php echo file_get_contents("../version.txt") ?></span>
</footer>
</body>
<script>
window.cookieconsent.initialise({
"palette": {
"popup": {
"background": "#000"
},
"button": {
"background": "#f1d600"
}
},
"theme": "classic",
"position": "bottom"
});
</script>
<?php if (isset($_GET['cause'])): ?>
<script>
$(function() {
var cause = "<?= htmlspecialchars((string)filter_input(INPUT_GET, 'cause'), ENT_QUOTES) ?>";
if(cause === "domain") {
$('.login_form_main').addClass('error');
$('.session_aleart').removeClass('invisible');
$('.session_aleart > span').text('This instance does not exsist.');
}
});
$(document).on('click','.login_form_main', function(e) {
$(this).removeClass('error');
});
</script>
<?php endif; ?>
</html>
