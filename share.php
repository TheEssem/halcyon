<?php
include("language.php");
if(isset($_GET["url"]) || (isset($_GET["action"]) && $_GET["action"] == "send")) {
$pagetitle = _("Share a link on Mastodon");
$pageheading = _("Share a link with your followers");
$shareurl = htmlspecialchars($_GET["url"]);
if(isset($_GET["text"])) $sharetext = htmlspecialchars($_GET["text"])." ";
else $sharetext = "";
}
else {
$pagetitle = _("Post a Toot on Mastodon");
$pageheading = _("What's happening?");
$shareurl = "";
$sharetext = "";
}
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?=$pagetitle?></title>
<link rel="shortcut icon" href="/assets/images/favicon.ico">
<link rel="stylesheet" href="/assets/css/sharebox.css" media="all">
<?php
if(array_key_exists('darktheme',$_COOKIE)) {
if($_COOKIE['darktheme'] == "true") echo '<link rel="stylesheet" href="/assets/css/sharebox_dark.css" media="all">';
else if($_COOKIE['darktheme'] == "unset") {
?>
<script>
if(window.matchMedia("(prefers-color-scheme: dark)").matches)
document.write('<link rel="stylesheet" href="/assets/css/sharebox_dark.css" media="all">');
</script>
<?php }} else {?>
<script>
if(window.matchMedia("(prefers-color-scheme: dark)").matches)
document.write('<link rel="stylesheet" href="/assets/css/sharebox_dark.css" media="all">');
</script>
<?php } ?>
<script src="/assets/js/jquery/jquery.min.js"></script>
<script src="/assets/js/mastodon.js/mastodon.js"></script>
<script src="/assets/js/autosize/autosize.js"></script>
<script>
var text_cantclose = "<?=_("Toot posted successfully but your browser doesn't allow closing the window")?>";
var sendnow = <?php if(isset($_GET["action"]) && $_GET["action"] == "send" && !isset($_GET["url"]) && !isset($_GET["text"])) echo "true"; else echo "false"; ?>;
</script>
<script src="/assets/js/halcyon/halcyonSharebox.js"></script>
</head>
<body>
<header id="header">
<div class="header_nav_wrap">
<nav class="header_left_box">
<ul class="header_nav_list">
<li id="header_nav_item_home" class="header_nav_item">
<a href="/" id="home_nav">
<img src="/assets/images/halcyon_logo.png" style="width:32px">
</a>
</li>
</ul>
</nav>
<nav class="header_right_box">
<ul class="header_nav_list">
<li class="header_nav_item my_account_wrap loggedin" style="display:none">
<a class="nav_profilelink">
<button class="header_account_avatar">
<div class="my_account">
<img class="js_current_profile_image">
</div>
</button>
</a>
</li>
<li class="header_nav_item toot_button_wrap loggedin" style="display:none">
<a class="nav_profilelink">
<div class="nav_username"></div>
</a>
</li>
<li class="header_nav_item toot_button_wrap loggedout">
<a href="https://instances.social">
<span><?=_("Sign up")?> ›</span>
</a>
</li>
</ul>
</nav>
</div>
</header>
<main id="main">
<div class="article_wrap">
<div class="content first">
<span class="putmessage"></span>
<form id="statusform" method="POST" action="/login/">
<span class="pageheading"><?=$pageheading?></span>
<textarea class="status_textarea"><?=$sharetext.$shareurl?></textarea>
<div class="usernamebox loggedout">
<label for="username"><?=_("Username")?></label>
<input type="text" id="username" name="acct" placeholder="@johndoe@example.com">
</div>
<button type="submit" class="toot_button loggedout">
<div class="toot_button_label">
<span><?=_("Log in and Toot")?></span>
</div>
</button>
<button class="toot_button loggedin" style="display:none">
<div class="toot_button_label">
<span><?=_("Toot")?></span>
</div>
</button>
</form>
</div>
</div>
</main>
<main id="main" class="dark loggedout">
<div class="article_wrap">
<div class="content">
<span class="pageheading"><?=_("New to Mastodon?")?></span>
<a href="https://instances.social">
<button class="toot_button">
<div class="toot_button_label">
<span><?=_("Sign up")?></span>
</div>
</button>
</a><br/>
<p><?=_("Get instant updates from your friends, industry experts, favorite celebrities, and what's happening around the world.")?></p>
<p><a href="https://joinmastodon.org"><?=_("What is Mastodon? Learn more.")?></a></p>
</div>
</div>
</main>
</body>
</html>
