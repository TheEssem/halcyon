<div class="overlay_simple overlay_rewrite_nofb invisible">
<header class="overlay_simple_header">
<span><?=_('Protect your privacy!')?></span>
</header>
<div class="overlay_simple_body">
<div class="overlay_rewrite_nofb_text" style="margin-bottom:10px">
<?=_("Halcyon has detected that you're trying to post a link to the centralized platform Facebook. Halcyon can automatically rewrite that link to NoFB, a privacy-friendly and faster way to view this content for free and without any ads. Do you want to replace your link with NoFB?")?><br/>
<center><a href="https://nofb.pw" class="halcyon_link" target="_blank"><?=_("Tell me more about NoFB!")?></a></center>
<div style="margin-bottom:20px;width:100%">
<div class="switch" style="margin:0;float:left">
<input type="checkbox" id="rewrite_nofb_permanent">
<div class="switch-btn">
<span></span>
</div>
</div>
<label for="redirect_nofb_permanent" style="margin-left:5px;vertical-align:sub"><?=_('Remember my decision')?></label>
</div>
</div>
<div class="overlay_simple_controls">
<button class="overlay_rewrite_nofb_yes toot_button" style="float:right;width:150px"><div class="toot_button_label"><i class="fa fa-fw fa-check"></i><span><?=_('Rewrite to NoFB')?></span></div></button>
<a href="javascript:void(0)" class="overlay_rewrite_nofb_no halcyon_link" style="float:right;margin-top:5px;margin-right:10px"><i class="fa fa-times"></i> <?=_('No, thanks')?></a>
</div>
</div>
</div>
