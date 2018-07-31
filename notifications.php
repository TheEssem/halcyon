<?php include ('header.php'); ?>
<main id="main">
<div class="article_wrap">
<aside class="left_column">
</aside>
<article class="center_column">
<header class="timeline_header">
<ul class="header_items">
<li class="item toots view">
<a href="#">
<?=_('All')?>
</a>
</li>
</ul>
</header>
<div id="js-stream_update">
<button>
<?=_('View ')?><span></span><?=_(' new notitification')?>
</button>
</div>
<ul id="js-timeline" class="timeline">
</ul>
<footer id="js-timeline_footer" class="timeline_footer">
<i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>
</footer>
</article>
<aside class="right_column">
<section class="side_widgets_wrap">
<?php include dirname(__FILE__).('/widgets/side_who_to_follow.php'); ?>
</section>
<?php include dirname(__FILE__).('/widgets/side_footer.php'); ?>
</aside>
</div>
</main>
<script>
current_file = location.pathname;
$("#notifications_nav").addClass('view');
localStorage.setItem("notification_count", 0);
setNotifications();
$('title').text('Halcyon / Notifications')
</script>
<?php include ('footer.php'); ?>
