<div class="overlay_simple overlay_rewrite_nitter invisible">
<header class="overlay_simple_header">
<span><?=_('Protect your privacy!')?></span>
</header>
<div class="overlay_simple_body">
<div class="overlay_rewrite_nitter_text" style="margin-bottom:10px">
<?=_("Halcyon has detected that you're trying to post a link to the centralized microblogging platform Twitter. Halcyon can automatically rewrite that link to Nitter, a privacy-friendly and faster way to view this content for free and without any ads. Do you want to replace your link with Nitter?")?><br/>
<center><a href="https://github.com/zedeus/nitter" class="halcyon_link" target="_blank"><?=_("Tell me more about Nitter!")?></a></center>
<div style="margin-bottom:20px;width:100%">
<div class="switch" style="margin:0;float:left">
<input type="checkbox" id="rewrite_nitter_permanent">
<div class="switch-btn">
<span></span>
</div>
</div>
<label for="redirect_nitter_permanent" style="margin-left:5px;vertical-align:sub"><?=_('Remember my decision')?></label>
</div>
</div>
<div class="overlay_simple_controls">
<button class="overlay_rewrite_nitter_yes toot_button" style="float:right;width:150px"><div class="toot_button_label"><i class="fa fa-fw fa-check"></i><span><?=_('Rewrite to Nitter')?></span></div></button>
<a href="javascript:void(0)" class="overlay_rewrite_nitter_no halcyon_link" style="float:right;margin-top:5px;margin-right:10px"><i class="fa fa-times"></i> <?=_('No, thanks')?></a>
</div>
</div>
</div>
