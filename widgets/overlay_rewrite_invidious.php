<div class="overlay_simple overlay_rewrite_invidious invisible">
<header class="overlay_simple_header">
<span><?=_('Protect your privacy!')?></span>
</header>
<div class="overlay_simple_body">
<div class="overlay_rewrite_invidious_text" style="margin-bottom:10px">
<?=_("Halcyon has detected that you're trying to post a link to the privacy-invasive video platform YouTube. Halcyon can automatically rewrite that link to Invidious, a privacy-friendly way to watch this video for free and without any ads. Do you want to replace your link with Invidious?")?><br/>
<center><a href="https://github.com/omarroth/invidious" class="halcyon_link" target="_blank"><?=_("Tell me more about Invidious!")?></a></center>
<div style="margin-bottom:20px;width:100%">
<div class="switch" style="margin:0;float:left">
<input type="checkbox" id="rewrite_invidious_permanent">
<div class="switch-btn">
<span></span>
</div>
</div>
<label for="rewrite_invidious_permanent" style="margin-left:5px;vertical-align:sub"><?=_('Remember my decision')?></label>
</div>
</div>
<div class="overlay_simple_controls">
<button class="overlay_rewrite_invidious_yes toot_button" style="float:right;width:180px"><div class="toot_button_label"><i class="fa fa-fw fa-check"></i><span><?=_('Rewrite to Invidious')?></span></div></button>
<a href="javascript:void(0)" class="overlay_rewrite_invidious_no halcyon_link" style="float:right;margin-top:5px;margin-right:10px"><i class="fa fa-times"></i> <?=_('No, thanks')?></a>
</div>
</div>
</div>
