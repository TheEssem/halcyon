function mediaattachments_template(status) {
let media_views = "";
var border = "";
var mvfullheight = "";
var media_embeds = new Array();
var audio_embeds = new Array();
var dsplength = status.media_attachments.length;
for(var i=0;i<dsplength;i++) {
var blurbackground = "";
if(status.media_attachments[i].remote_url != null) status.media_attachments[i].url = status.media_attachments[i].remote_url;
if(status.media_attachments[i].description == null) status.media_attachments[i].description = "";
if(status.media_attachments[i].blurhash) blurbackground = ' style="background-image:url('+getBlurImage(status.media_attachments[i].blurhash)+')"';
if((status.media_attachments[i].type === "video" && localStorage.setting_play_video == "false") || (status.media_attachments[i].type === "gifv" && localStorage.setting_play_gif == "false")) {
if(status.media_attachments[i].preview_url != status.media_attachments[i].url) media_embeds.push(`
<div class="media_attachment" mediacount="${i}">
<img src="${status.media_attachments[i].preview_url}" title="${status.media_attachments[i].description}">
<div class='sensitive_alert'${blurbackground}>
<span class="text1">${__('Sensitive content')}</span>
<span class="text2">${status.media_attachments[i].description}</span>
</div>
</div>`);
}
else if(status.media_attachments[i].type === "video") {
var vidprev = "";
if(status.media_attachments[i].preview_url != status.media_attachments[i].url) vidprev = "&preview="+encodeURIComponent(status.media_attachments[i].preview_url);
media_embeds.push(`
<div class="media_attachment" otype="video/gifv" mediacount="${i}">
<iframe src="/media/video.php?url=${encodeURIComponent(status.media_attachments[i].url)}&title=${encodeURIComponent(status.media_attachments[i].description)+vidprev}" title="${status.media_attachments[i].description}" frameborder="0" allowfullscreen></iframe>
<div class='sensitive_alert'${blurbackground}>
<span class="text1">${__('Sensitive content')}</span>
<span class="text2">${status.media_attachments[i].description}</span>
</div>
</div>`);
}
else if(status.media_attachments[i].type === "gifv") {
var vidprev = "";
if(status.media_attachments[i].preview_url != status.media_attachments[i].url) vidprev = "<img src='"+status.media_attachments[i].preview_url+"'>";
media_embeds.push(`
<div class="media_attachment with_overlay" otype="video" sid="${status.id}" oid="${status.media_attachments[i].id}" url="${status.media_attachments[i].url}" mediacount="${i}">
<video frameborder="0" title="${status.media_attachments[i].description}" autoplay loop muted>
<source src="${status.media_attachments[i].url}">
${vidprev}
</video>
<div class='sensitive_alert'${blurbackground}>
<span class="text1">${__('Sensitive content')}</span>
<span class="text2">${status.media_attachments[i].description}</span>
</div>
</div>`);
}
else if(status.media_attachments[i].type === "audio" || (status.media_attachments[i].type === "unknown" && status.media_attachments[i].url.substring(status.media_attachments[i].url.length-4) == ".mp3")) {
if(localStorage.setting_play_audio != "false") {
var audio_embed = $("<div>").attr("title",status.media_attachments[i].description).addClass("player");
audio_embed.player(status.media_attachments[i].url);
audio_embeds.push(audio_embed);
}
}
else if(status.media_attachments[i].type === "image") {
media_embeds.push(`
<div class="media_attachment with_overlay" otype="image" sid="${status.id}" oid="${status.media_attachments[i].id}" url="${status.media_attachments[i].url}" mediacount="${i}">
<img src="${status.media_attachments[i].url}" title="${status.media_attachments[i].description}" window_view="enable"/>
<div class='sensitive_alert'${blurbackground}>
<span class="text1">${__('Sensitive content')}</span>
<span class="text2">${status.media_attachments[i].description}</span>
</div>
</div>`);
}
}
if(status.media_attachments[0].type === "video" && localStorage.setting_play_video != "false" && dsplength == 1) border = ' style="border:0;border-radius:0"';
if(localStorage.setting_full_height == "true" && status.media_attachments.length == 1 && (status.media_attachments[0].type == "image" || (status.media_attachments[0].type === "video" && localStorage.setting_play_video == "false") || status.media_attachments[0].type === "gifv"))
mvfullheight = " media_full_height";
if(media_embeds.length > 0) {
media_views = `<div class='media_views${mvfullheight}' sid="${status.id}" media_length='${dsplength}'${border}>`;
if(media_embeds.length < 3) {
for(let i in media_embeds) {
media_views += media_embeds[i];
}
}
else {
for(let i in media_embeds) {
if(Number(i) === 1) {
media_views += (`<div class="media_attachments_right">`);
media_views += media_embeds[i];
}
else media_views += media_embeds[i];
}
media_views += "</div>";
}
media_views += "</div>";
}
else media_views = "";
var media_view = $("<div>");
media_view.append(media_views);
if(status.sensitive && localStorage.setting_show_nsfw == "false") media_view.find(".media_attachment").addClass("sensitive");
for(let i in audio_embeds) {
media_view.append(audio_embeds[i]);
}
return media_view;
}
function link_preview_template(card) {
if(localStorage.setting_link_previews == "true") {
var randattr = "";
if(server_setting_unshorten && checkURLshortener(card.url)) {
var linkrand = Math.round(Math.random()*1000000);
randattr = ' data-random="'+linkrand+'"';
$(this).attr("data-random",linkrand);
$.ajax("/unshorten.php?url="+encodeURIComponent(card.url)).done(function(data, textStatus, xhr) {
if(xhr.status == 400) return;
$(".media_views.link_preview").filter("[data-random="+linkrand+"]").data("url",data);
$(".media_views.link_preview").filter("[data-random="+linkrand+"]").find(".card_link").text(data);
});
}
let preview_html = (`<div class="media_views link_preview" media_length="1" style="height:unset" data-url="${card.url}"${randattr}>
<img src="${card.image}" style="width:${card.width};max-width:200px;float:left;margin-right:5px">
<strong>${card.title}</strong><br/>
<span>${card.description}</span><br/>
<span style="color:#777777" class="card_link">${card.url}</span>`);
return preview_html;
}
else return "";
}
function poll_template(poll) {
let poll_html = "";
var expires_at = new Date(new Date(poll.expires_at).getTime()-Date.now());
var expires_string;
if(expires_at.getUTCMonth() == 1) expires_string = "1 "+__("month");
else if(expires_at.getUTCMonth() > 1) expires_string = (expires_at.getUTCMonth())+" "+__("months");
else if(expires_at.getUTCDate() == 2) expires_string = "1 "+__("day");
else if(expires_at.getUTCDate() > 2) expires_string = (expires_at.getUTCDate()-1)+" "+__("days");
else if(expires_at.getUTCHours() == 1) expires_string = "1 "+__("hour");
else if(expires_at.getUTCHours() > 1) expires_string = expires_at.getUTCHours()+" "+__("hours");
else if(expires_at.getUTCMinutes() == 1) expires_string = "1 "+__("minute");
else if(expires_at.getUTCMinutes() > 1) expires_string = expires_at.getUTCMinutes()+" "+__("minutes");
else if(expires_at.getUTCSeconds() == 1) expires_string = "1 "+__("second");
else expires_string = expires_at.getUTCSeconds()+" "+__("seconds");
if(poll.voted || poll.expired) {
poll_html = (`<div class="poll_box">`);
optionsort = [...poll.options];
optionsort.sort(function(a,b) {return a.votes_count - b.votes_count});
optionsort.reverse();
if(optionsort[0].votes_count != optionsort[1].votes_count) poll.options[poll.options.indexOf(optionsort[0])].winner = true;
for(var i=0;i<poll.options.length;i++) {
var winner = "";
if(poll.options[i].winner) winner = " poll_winner";
poll_html += (`<div class="poll_result_option"><span class="poll_bar${winner}" style="width:${poll.options[i].votes_count/poll.votes_count*100}%"></div>
<label class="poll_result_label"><strong>${Math.round(poll.options[i].votes_count/poll.votes_count*100) || 0}%</strong> <span class="emoji_poss">${poll.options[i].title}</span></label>`);
}
if(poll.expired) poll_html += (`<br/><span class="poll_footer">${poll.votes_count} ${__("votes")} &bull; ${__("Final results")}</span>`);
else poll_html += (`<br/><span class="poll_footer">${poll.votes_count} ${__("votes")} &bull; ${expires_string} ${__("left")}</span>`);
}
else {
const poll_random = Math.round(Math.random()*1000);
poll_html = (`<div class="poll_box poll_box_form poll_${poll.id}" data-poll="${poll.id}" data-random="${poll_random}" id="poll_${poll.id}_${poll_random}">`);
for(var i=0;i<poll.options.length;i++) {
if(poll.multiple) {
poll_html += (`<input type="checkbox" id="poll_${poll.id}_${poll_random}_${i}" name="poll_${poll.id}" class="poll_vote_option checkbox">
<label for="poll_${poll.id}_${poll_random}_${i}" class="poll_vote_label poll_checkbox_label emoji_poss">${poll.options[i].title}</label><br/>`);
}
else {
poll_html += (`<div class="radiobox"><input type="radio" id="poll_${poll.id}_${poll_random}_${i}" name="poll_${poll.id}" class="poll_vote_option">
<label for="poll_${poll.id}_${poll_random}_${i}" class="poll_vote_label radiotext emoji_poss">${poll.options[i].title}</label></div>`);
}
}
poll_html += (`<button class="halcyon_button poll_vote"><span>${__("Vote")}</span></button>
${poll.votes_count} ${__("votes")} &bull; ${expires_string} ${__("left")}`);
}
poll_html += (`</div>`);
return poll_html;
}
function timeline_template(status,is_pinned=false) {
var header_note = "";
if(is_pinned) {
header_note = (`<div class="pinned_notice_box">
<i class="fa fa-fw fa-thumb-tack"></i>${__('Pinned Toot')}</span>
</div>`);
}
if(status.reblog !== null) {
restatus = prepareStatus(status);
status = restatus.reblog;
header_note = (`<div class="boost_author_box">
<a href="${restatus.halcyon.account_link}">
<span class="emoji_poss"><i class="fa fa-fw fa-retweet"></i>${restatus.account.display_name} ${__('Boosted')}</span>
</a>
</div>`);
}
else status = prepareStatus(status);
const html=$(`
<li sid="${status.id}" class="toot_entry">
${header_note}
<div class="toot_entry_body">
<a href="${status.halcyon.account_link}">
<div class="icon_box">
<img src="${status.account.avatar}">
</div>
</a>
<section class="toot_content">
<header class="toot_header">
<div class="text_ellipsis">
<a href="${status.halcyon.account_link}">
<span class="displayname emoji_poss">
${status.account.display_name}
</span>
<span class="username">
@${status.account.acct}${status.halcyon.account_state_icons}
</span>
<time datetime="${status.halcyon.attr_datetime}">${status.halcyon.datetime}</time>
</a>
</div>
<div class="expand_button_wrap">
<button class="expand_button">
<i class="fa fa-fw fa-chevron-down"></i>
</button>
<div class="expand_menu invisible disallow_select">
<ul>
<li><a class="copylink_button" url="${status.url}">${__('Copy link to Toot')}</a></li>
${status.halcyon.own_toot_buttons}
</ul>
<ul>
<li><a href="${status.url}" target="_blank">${__('View original')}</a></li>
</ul>
</div>
</div>
</header>
<article class="toot_article ${status.halcyon.article_option}">
${status.halcyon.alert_text}
<span class="status_content emoji_poss">
${status.content}
</span>
${status.halcyon.preview_object}
</article>
${status.halcyon.reactions}
<footer class="toot_footer"${status.halcyon.footer_width}>
<div class="toot_reaction">
<button class="reply_button" tid="${status.id}" mentions='${JSON.stringify(status.mentions)}' display_name="${status.account.display_name}" privacy="${status.visibility}" content_warning="${htmlEscape(status.spoiler_text)}">
<i class="fa fa-fw fa-reply"></i>
<span class="reaction_count reply_count">${status.replies_count}</span>
</button>
</div>
${status.halcyon.reblog_button}
<div class="toot_reaction">
<button class="fav_button" tid="${status.id}" favourited="${status.favourited}">
<i class="fa fa-fw fa-star"></i>
<span class="reaction_count fav_count">${status.favourites_count}</span>
</button>
</div>
<div class="toot_reaction">
<button class="bookmark_button" tid="${status.id}" bookmarked="${status.bookmarked}">
<i class="fa fa-fw fa-bookmark"></i>
</button>
</div>
<div class="toot_reaction">
<button>
<i class="fa fa-fw fa-${status.halcyon.privacy_icon}" title="${status.halcyon.privacy_mode}"></i>
</button>
</div>
</footer>
</section>
</div>
</li>`);
html.find(".toot_article").append(status.halcyon.media_views);
html.find(".toot_article").append(status.halcyon.poll_object);
return html;
}
function notifications_template(NotificationObj) {
var notice_author_link;
if(NotificationObj.account.acct.indexOf("@") == -1)  notice_author_link = "/@"+NotificationObj.account.acct+"@"+current_instance+"?mid="+NotificationObj.account.id;
else notice_author_link = "/@"+NotificationObj.account.acct+"?mid="+NotificationObj.account.id;
if(NotificationObj.account.display_name.length == 0) {
NotificationObj.account.display_name = NotificationObj.account.username;
}
NotificationObj.account.display_name = htmlEscape(NotificationObj.account.display_name);
for(i=0;i<NotificationObj.account.emojis.length;i++) {
NotificationObj.account.display_name = NotificationObj.account.display_name.replace(new RegExp(":"+NotificationObj.account.emojis[i].shortcode+":","g"),"<img src='"+NotificationObj.account.emojis[i].url+"' class='emoji'>");
}
if(NotificationObj.type === 'favourite') {
NotificationObj.status = prepareStatus(NotificationObj.status);
const html = (`
<li sid="${NotificationObj.status.id}" class="notice_entry fav favourite toot_entry">
<div class="notice_author_box">
<a href="${notice_author_link}">
<div class="icon_box">
<img src="${NotificationObj.account.avatar}">
</div>
</a>
<i class="fa fa-fw fa-star font-icon favourite"></i>
<a class="notice_author" href="${notice_author_link}">
<span class="emoji_poss">${NotificationObj.account.display_name}</span> ${__('favourited Your Toot')}
<time datetime="${getConversionedDate(null, NotificationObj.created_at)}">${getRelativeDatetime(Date.now(), getConversionedDate(null, NotificationObj.created_at))}</time>
</a>
</div>
<div class="notice_entry_body">
<section class="toot_content">
<header class="toot_header">
<div class="text_ellipsis">
<a href="${NotificationObj.status.halcyon.author_link}">
<span class="displayname emoji_poss">
${NotificationObj.status.account.display_name}
</span>
<span class="username">
@${NotificationObj.status.account.acct}${NotificationObj.status.halcyon.account_state_icons}
</span>
</a>
</div>
</header>
<article class="toot_article emoji_poss">
<p>${NotificationObj.status.content}</p>
</article>
<footer class="toot_footer"></footer>
</section>
</div>
</li>`);
return $(html);
}
else if(NotificationObj.type === 'reblog') {
NotificationObj.status = prepareStatus(NotificationObj.status);
html = (`
<li sid="${NotificationObj.status.id}" class="notice_entry bos boost toot_entry">
<div class="notice_author_box">
<a href="${notice_author_link}">
<div class="icon_box">
<img src="${NotificationObj.account.avatar}">
</div>
</a>
<i class="fa fa-fw fa-retweet font-icon boost"></i>
<a class="notice_author" href="${notice_author_link}">
<span class="emoji_poss" >${NotificationObj.account.display_name}</span> ${__('boosted Your Toot')}
<time datetime="${getConversionedDate(null, NotificationObj.created_at)}">${getRelativeDatetime(Date.now(), getConversionedDate(null, NotificationObj.created_at))}</time>
</a>
</div>
<blockquote class="notice_entry_body">
<section class="toot_content">
<header class="toot_header">
<div class="text_ellipsis">
<a href="${NotificationObj.status.halcyon.author_link}">
<span class="displayname emoji_poss">
${NotificationObj.status.account.display_name}
</span>
<span class="username">
@${NotificationObj.status.account.acct}${NotificationObj.status.halcyon.account_state_icons}
</span>
</a>
</div>
</header>
<article class="toot_article emoji_poss">
<p>${NotificationObj.status.content}</p>
</article>
<footer class="toot_footer"></footer>
</section>
</blockquote>
</li>`);
return $(html);
}
else if(NotificationObj.type === 'pleroma:emoji_reaction') {
NotificationObj.status = prepareStatus(NotificationObj.status);
const html = (`
<li sid="${NotificationObj.status.id}" class="notice_entry emoji_reaction toot_entry">
<div class="notice_author_box">
<a href="${notice_author_link}">
<div class="icon_box">
<img src="${NotificationObj.account.avatar}">
</div>
</a>
<i class="fa fa-fw fa-smile-o font-icon reaction"></i>
<a class="notice_author" href="${notice_author_link}">
<span class="emoji_poss">${NotificationObj.account.display_name}</span> ${__('reacted to Your Toot')}
</a>
</div>
<div class="notice_entry_body">
<span class="notice_emoji emoji_poss">${NotificationObj.emoji}</span>
<section class="toot_content">
<header class="toot_header">
<div class="text_ellipsis">
<a href="${NotificationObj.status.halcyon.author_link}">
<span class="displayname emoji_poss">
${NotificationObj.status.account.display_name}
</span>
<span class="username">
@${NotificationObj.status.account.acct}${NotificationObj.status.halcyon.account_state_icons}
</span>
</a>
</div>
</header>
<article class="toot_article emoji_poss">
<p>${NotificationObj.status.content}</p>
</article>
<footer class="toot_footer"></footer>
</section>
</div>
</li>`);
return $(html);
}
else if(NotificationObj.type === 'mention' || NotificationObj.type === 'poll') {
NotificationObj.status = prepareStatus(NotificationObj.status);
var poll_notify = "";
if(NotificationObj.type === 'poll') {
poll_notify = (`<div class="notice_author_box poll_notify_header">
<i class="fa fa-fw fa-pie-chart font-icon poll"></i>
<a class="notice_author" href="javascript:void(0)">
${__('A poll you participated in has ended')}
</a>
</div>`);
}
const html=$(`
<li sid="${NotificationObj.status.id}" class="toot_entry">
${poll_notify}
<div class="toot_entry_body">
<a href="${notice_author_link}">
<div class="icon_box">
<img src="${NotificationObj.status.account.avatar}">
</div>
</a>
<section class="toot_content">
<header class="toot_header">
<div class="text_ellipsis">
<a href="${notice_author_link}">
<span class="displayname emoji_poss">
${NotificationObj.status.account.display_name}
</span>
<span class="username">
@${NotificationObj.status.account.acct}${NotificationObj.status.halcyon.account_state_icons}
</span>
<time datetime="${NotificationObj.status.halcyon.attr_datetime}">${NotificationObj.status.halcyon.datetime}</time>
</a>
</div>
<div class="expand_button_wrap">
<button class="expand_button">
<i class="fa fa-fw fa-chevron-down"></i>
</button>
<div class="expand_menu invisible disallow_select">
<ul>
<li><a class="copylink_button" url="${NotificationObj.status.url}" >${__('Copy link to Toot')}</a></li>
${NotificationObj.status.halcyon.own_toot_buttons}
</ul>
<ul>
<li><a href="${NotificationObj.status.url}" target="_blank">${__('View original')}</a></li>
</ul>
</div>
</div>
</header>
<article class="toot_article ${NotificationObj.status.halcyon.article_option}">
${NotificationObj.status.halcyon.alert_text}
<span class="status_content emoji_poss">
${NotificationObj.status.content}
</span>
${NotificationObj.status.halcyon.preview_object}
</article>
${NotificationObj.status.halcyon.reactions}
<footer class="toot_footer"${NotificationObj.status.halcyon.footer_width}>
<div class="toot_reaction">
<button class="reply_button" tid="${NotificationObj.status.id}" mentions='${JSON.stringify(NotificationObj.status.mentions)}' display_name="${NotificationObj.account.display_name}" privacy="${NotificationObj.status.visibility}" content_warning="${htmlEscape(NotificationObj.status.spoiler_text)}">
<i class="fa fa-fw fa-reply"></i>
<span class="reaction_count reply_count">${NotificationObj.status.replies_count}</span>
</button>
</div>
${NotificationObj.status.halcyon.reblog_button}
<div class="toot_reaction">
<button class="fav_button" tid="${NotificationObj.status.id}" favourited="${NotificationObj.status.favourited}">
<i class="fa fa-fw fa-star"></i>
<span class="reaction_count fav_count">${NotificationObj.status.favourites_count}</span>
</button>
</div>
<div class="toot_reaction">
<button class="bookmark_button" tid="${NotificationObj.status.id}" bookmarked="${NotificationObj.status.bookmarked}">
<i class="fa fa-fw fa-bookmark"></i>
</button>
</div>
<div class="toot_reaction">
<button>
<i class="fa fa-fw fa-${NotificationObj.status.halcyon.privacy_icon}" title="${NotificationObj.status.halcyon.privacy_mode}"></i>
</button>
</div>
</footer>
</section>
</div>
</li>`);
html.find(".toot_article").append(NotificationObj.status.halcyon.media_views);
html.find(".toot_article").append(NotificationObj.status.halcyon.poll_object);
return html;
} else if(NotificationObj.type === 'follow') {
const html=(`
<li sid="${NotificationObj.id}" class="notice_entry fol toot_entry">
<div class="notice_author_box">
<a href="${notice_author_link}">
<div class="icon_box">
<img src="${NotificationObj.account.avatar}">
</div>
</a>
<i class="fa fa-fw fa-user font-icon follow"></i>
<a class="notice_author" href="${notice_author_link}">
<span class="emoji_poss">${NotificationObj.account.display_name}</span> ${__('followed you')}
<time datetime="${getConversionedDate(null, NotificationObj.created_at)}">${getRelativeDatetime(Date.now(), getConversionedDate(null, NotificationObj.created_at))}</time>
</a>
</div>
</li>`);
return $(html);
}
}
function follows_template(AccountObj) {
var profile_link;
if(AccountObj.acct.indexOf("@") == -1) profile_link = "/@"+AccountObj.acct+"@"+current_instance+"?mid="+AccountObj.id;
else profile_link = "/@"+AccountObj.acct+"?mid="+AccountObj.id;
if(AccountObj.display_name.length == 0) {
AccountObj.display_name = AccountObj.username;
}
AccountObj.display_name = htmlEscape(AccountObj.display_name);
for(i=0;i<AccountObj.emojis.length;i++) {
AccountObj.display_name = AccountObj.display_name.replace(new RegExp(":"+AccountObj.emojis[i].shortcode+":","g"),"<img src='"+AccountObj.emojis[i].url+"' class='emoji'>");
}
var account_state_icons = "";
if(AccountObj.locked == true) account_state_icons += " <i class='fa fa-lock'></i>";
if(AccountObj.bot == true) account_state_icons += " <img src='/assets/images/robot.svg' class='emoji'>";
var html = (`
<div class="follows_profile_box" mid="${AccountObj.id}">
<div class="follows_profile_header">
<img class="js_follows_header_image" src="${AccountObj.header}"/>
</div>
<div class="follows_profile">
<div class="follows_profile_icon">
<img class="js_follows_profile_image" src="${AccountObj.avatar}"/>
</div>
<button class="halcyon_button follow_button action_button" mid="${AccountObj.id}">
<i class="fa fa-fw fa-user-plus"></i>
<span>${__('Follow')}</span>
</button>
<div class="follows_profile_name_box">
<a class="js_follows_profile_link emoji_poss" href="${profile_link}">
<h2 class="js_follows_profile_displayname">
${AccountObj.display_name}
</h2>
<span class="js_follows_profile_username">
@${AccountObj.acct}${account_state_icons}
</span>
</a>
</div>
<div class="follows_profile_bio emoji_poss">
<p>${AccountObj.note}</p>
</div>
</div>
</div>`);
html = html.replace(new RegExp('class="emojione"',"g"),'class=emoji');
return $(html);
}
function status_template(status, class_options) {
if(status.reblog !== null) status = status.reblog;
status = prepareStatus(status);
const html=$(`
<div sid="${status.id}" class="toot_detail ${class_options}">
<div class="toot_detail_body">
<header class="toot_header">
<div class="icon_box">
<img src="${status.account.avatar}">
</div>
<a href="${status.halcyon.account_link}">
<span class="displayname emoji_poss">
${status.account.display_name}
</span>
<span class="username">
@${status.account.acct}${status.halcyon.account_state_icons}
</span>
</a>
<div class="expand_button_wrap">
<button class="expand_button">
<i class="fa fa-fw fa-chevron-down"></i>
</button>
<div class="expand_menu invisible disallow_select">
<ul>
<li><a class="copylink_button" url="${status.url}" >${__('Copy link to Toot')}</a></li>
${status.halcyon.own_toot_buttons}
</ul>
<ul>
<li><a href="${status.url}" target="_blank">${__('View original')}</a></li>
</ul>
</div>
</div>
</header>
<section class="toot_content">
<article class="toot_article ${status.halcyon.article_option} emoji_poss">
${status.halcyon.alert_text}
<span class="status_content emoji_poss">
${status.content}
</span>
${status.halcyon.preview_object}
</article>
<time datetime="${status.halcyon.attr_datetime}">${status.halcyon.attr_datetime}</time>
${status.halcyon.reactions}
</section>
<footer class="toot_footer"${status.halcyon.footer_width}>
<div class="toot_reaction">
<button class="reply_button" tid="${status.id}" mentions='${JSON.stringify(status.mentions)}' display_name="${status.account.display_name}" privacy="${status.visibility}" content_warning="${htmlEscape(status.spoiler_text)}">
<i class="fa fa-fw fa-reply"></i>
<span class="reaction_count reply_count">${status.replies_count}</span>
</button>
</div>
${status.halcyon.reblog_button}
<div class="toot_reaction">
<button class="fav_button" tid="${status.id}" favourited="${status.favourited}">
<i class="fa fa-fw fa-star"></i>
<span class="reaction_count fav_count">${status.favourites_count}</span>
</button>
</div>
<div class="toot_reaction">
<button class="bookmark_button" tid="${status.id}" bookmarked="${status.bookmarked}">
<i class="fa fa-fw fa-bookmark"></i>
</button>
</div>
<div class="toot_reaction">
<button>
<i class="fa fa-fw fa-${status.halcyon.privacy_icon}" title="${status.halcyon.privacy_mode}"></i>
</button>
</div>
</footer>
</div>
</div>
<form id="reply_status_form" name="reply_status_form" class="status_form" sid="${status.id}" mentions='${JSON.stringify(status.mentions)}'>
<div class="status_left icon_box">
<img class="js_current_profile_image" src="${current_avatar}">
</div>
<div class="status_top">
<input class="status_spoiler invisible" name="status_spoiler" placeholder="${__('Content warning')}" value="${htmlEscape(status.spoiler_text)}" data-random="${Math.round(Math.random()*1000)}" type="text"/>
</div>
<div class="status_main">
<!-- text area -->
<div class="status_textarea">
<textarea class="emoji_poss" name="status_textarea" placeholder="${__('Toot your reply')}" data-random="${Math.round(Math.random()*1000)}"></textarea>
<div class="media_attachments_preview_area invisible"></div>
<div class="status_poll_editor invisible">
<i class="fa fa-circle-o"></i> <input name="options[]" type="text" class="disallow_enter textfield poll_field"><br/>
<i class="fa fa-circle-o"></i> <input name="options[]" type="text" class="disallow_enter textfield poll_field"><br/>
<i class="fa fa-circle-o"></i> <input name="options[]" type="text" class="disallow_enter textfield poll_field"><br/>
<i class="fa fa-circle-o"></i> <input name="options[]" type="text" class="disallow_enter textfield poll_field"><br/>
<div style="height:32px;display:inline-block;padding-top:10px">${__("Expires in")} </div>
<div style="float:right;margin-right:5px"><div class="poll_time"><input type="number" min="0" class="poll_days">${__('Days')}</div>
<div class="poll_time"><input type="number" min="0" max="24" placeholder="0-24" class="poll_hours">${__('Hours')}</div>
<div class="poll_time"><input type="number" min="0" max="60" placeholder="0-60" class="poll_mins">${__('Minutes')}</div></div><br/>
<div class="poll_time_warning invisible"></div>
<div class="switch poll_mc_switch">
<input type="checkbox" class="poll_multiple_choice">
<div class="switch-btn">
<span></span>
</div>
</div>
${__("Multiple choice")}
</div>
</div>
</div>
<div class="status_bottom invisible">
<!-- Media Attachment -->
<label for="reply_status_media_atta" class="status_media_attachment status_option_button">
<i class="fa fa-camera" aria-hidden="true"></i>
</label>
<!-- Content warning -->
<label for="reply_status_cw" class="status_CW status_option_button">
<span class="disallow_select">CW</span>
</label>
<!-- Not safe for work -->
<label for="reply_status_nsfw" class="status_NSFW status_option_button">
<span class="disallow_select">NSFW</span>
</label>
<!-- Privacy options -->
<div class="status_privacy status_option_button expand_privacy_menu_button">
<!-- Expand menu -->
<i class="fa fa-${status.halcyon.privacy_icon}" aria-hidden="true"></i>
<!-- Privacy options -->
<div class="expand_privacy_menu invisible">
<label for="reply_status_public" class="status_privacy select_privacy disallow_select" privacyicon="fa fa-globe">
<i class="fa fa-globe" aria-hidden="true"></i>${__('Public')}
</label>
<label for="reply_status_unlisted" class="status_privacy select_privacy disallow_select" privacyicon="fa fa-unlock-alt">
<i class="fa fa-unlock-alt" aria-hidden="true"></i>${__('Unlisted')}
</label>
<label for="reply_status_fonly" class="status_privacy select_privacy disallow_select" privacyicon="fa fa-lock">
<i class="fa fa-lock" aria-hidden="true"></i>${__('Followers-only')}
</label>
<label for="reply_status_direct" class="status_privacy select_privacy disallow_select" privacyicon="fa fa-envelope">
<i class="fa fa-envelope" aria-hidden="true"></i>${__('Direct')}
</label>
</div>
</div>
<label for="reply_status_poll" class="status_poll status_option_button">
<i class="fa fa-pie-chart" aria-hidden="true"></i>
</label>
<label for="reply_status_emoji" class="status_emoji status_option_button">
<i class="fa fa-smile-o" aria-hidden="true"></i>
</label>
<input id="reply_status_media_atta" name="files" type="file" multiple class="invisible"/>
<input id="reply_status_cw" name="status_cw" type="checkbox" class="invisible" />
<input id="reply_status_nsfw" name="status_nsfw" type="checkbox" class="invisible" />
<input id="reply_status_public" name='privacy_option' value="public" class="invisible" type="radio"${status.halcyon.checked_public}>
<input id="reply_status_unlisted" name='privacy_option' value="unlisted" class="invisible" type="radio"${status.halcyon.checked_unlisted}>
<input id="reply_status_fonly" name='privacy_option' value="private" class="invisible" type="radio"${status.halcyon.checked_private}>
<input id="reply_status_direct" name='privacy_option' value="direct" class="invisible" type="radio"${status.halcyon.checked_direct}>
<div id="reply_status_emoji" name="status_emoji" type="button"></div>
<div class="submit_status_label_wrap">
<span class="character_count">
${current_instance_charlimit}
</span>
<label for="header_status_addfield" class="status_addfield status_option_button">
<i class="fa fa-plus-circle" aria-hidden="true"></i>
</label>
<label for="reply_status_form_submit" class="submit_status_label">
<div class="toot_button_label disallow_select">
<i class="fa fa-reply" aria-hidden="true"></i>
<span>${__('Reply')}</span>
</div>
</label>
</div>
<input id="reply_status_form_submit" class="submit_status" type="button" class="invisible"/>
</div>
</form>`);
history.pushState(null, null, status.halcyon.account_link.replace("?mid=",'/status/'+status.id+"?mid="));
html.find(".toot_article").append(status.halcyon.media_views);
html.find(".toot_article").append(status.halcyon.poll_object);
return html;
}
function media_template(status,media) {
if(!status) {
const html = (`
<div class="media_detail">
<div class="media_box">
<img src="${media}">
</div>
</div>`);
return $(html)
}
else {
var pictures = new Array;
var hidebackward = "";
var hideforward ="";
for(var i=0;i<status.media_attachments.length;i++) {
if(status.media_attachments[i].remote_url != null) status.media_attachments[i].url = status.media_attachments[i].remote_url;
if(status.media_attachments[i].description == null) status.media_attachments[i].description = "";
if(status.media_attachments[i].type == "image" || status.media_attachments[i].type == "gifv") pictures.push(status.media_attachments[i].url);
}
console.log(media);
console.log(parseInt(media));
var mediacnt = pictures.indexOf(pictures.find(function(data) {if(data==this) return true},status.media_attachments[parseInt(media)].url));
console.log(mediacnt);
if(mediacnt == 0) hidebackward = " style='display:none'";
if(mediacnt == pictures.length-1) hideforward = " style='display:none'";
if(status.media_attachments[media].type == "image") var player = `<img src="${status.media_attachments[media].url}" title="${status.media_attachments[media].description}">`;
else if(status.media_attachments[media].type == "gifv") {
var vidprev = "";
if(status.media_attachments[media].preview_url != status.media_attachments[media].url) vidprev = "<img src='"+status.media_attachments[media].preview_url+"'>";
var player = (`<video frameborder="0" title="${status.media_attachments[media].description}" autoplay loop muted style="width:100%">
<source src="${status.media_attachments[media].url}">
${vidprev}
</video>`);
}
const status_template = timeline_template(status).html(),
html = (`<div class="media_detail" pictures='${JSON.stringify(pictures)}' cid="${mediacnt}">
<div class="media_box">
<span class="media_backward"${hidebackward}><i class="fa fa-2x fa-chevron-left"></i></span>
${player}
<span class="media_forward"${hideforward}><i class="fa fa-2x fa-chevron-right"></i></span>
</div>
<div class="toot_entry" sid="${status.id}">
${status_template}
</div>
</div>`);
return $(html)
}
}
function context_template(status,class_options) {
var reblog_note = "";
if(status.reblog !== null) {
restatus = prepareStatus(status);
status = restatus.reblog;
reblog_note = (`<div class="boost_author_box">
<a href="${restatus.halcyon.account_link}">
<span class="emoji_poss"><i class="fa fa-fw fa-retweet"></i>${restatus.account.display_name} ${__('Boosted')}</span>
</a>
</div>`);
}
else status = prepareStatus(status);
const html=$(`
<div sid="${status.id}" class="toot_entry ${class_options}">
${reblog_note}
<div class="toot_entry_body">
<div class="icon_box">
<img src="${status.account.avatar}">
</div>
<section class="toot_content">
<header class="toot_header">
<a href="${status.halcyon.account_link}">
<span class="displayname emoji_poss">
${status.account.display_name}
</span>
<span class="username">
@${status.account.acct}${status.halcyon.account_state_icons}
</span>
<time datetime="${status.halcyon.attr_datetime}">${status.halcyon.datetime}</time>
</a>
<div class="expand_button_wrap">
<button class="expand_button">
<i class="fa fa-fw fa-chevron-down"></i>
</button>
<div class="expand_menu invisible disallow_select">
<ul>
<li><a class="copylink_button" url="${status.url}" >${__('Copy link to Toot')}</a></li>
${status.halcyon.own_toot_buttons}
</ul>
<ul>
<li><a href="${status.url}" target="_blank">${__('View original')}</a></li>
</ul>
</div>
</div>
</header>
<article class="toot_article ${status.halcyon.article_option}">
${status.halcyon.alert_text}
<span class="status_content emoji_poss">
${status.content}
</span>
</article>
${status.halcyon.reactions}
<footer class="toot_footer"${status.halcyon.footer_width}>
<div class="toot_reaction">
<button class="reply_button" tid="${status.id}" mentions='${JSON.stringify(status.mentions)}' display_name="${status.account.display_name}" privacy="${status.visibility}" content_warning="${htmlEscape(status.spoiler_text)}">
<i class="fa fa-fw fa-reply"></i>
<span class="reaction_count reply_count">${status.replies_count}</span>
</button>
</div>
${status.halcyon.reblog_button}
<div class="toot_reaction">
<button class="fav_button" tid="${status.id}" favourited="${status.favourited}">
<i class="fa fa-fw fa-star"></i>
<span class="reaction_count fav_count">${status.favourites_count}</span>
</button>
</div>
<div class="toot_reaction">
<button class="bookmark_button" tid="${status.id}" bookmarked="${status.bookmarked}">
<i class="fa fa-fw fa-bookmark"></i>
</button>
</div>
<div class="toot_reaction">
<button>
<i class="fa fa-fw fa-${status.halcyon.privacy_icon}" title="${status.halcyon.privacy_mode}"></i>
</button>
</div>
</footer>
</section>
</div>
</div>`);
html.find(".toot_article").append(status.halcyon.media_views);
html.find(".toot_article").append(status.halcyon.poll_object);
return html;
}
function announcement_template(announcement) {
var reactions;
var datetime = "";
reactions = parse_reactions(announcement.reactions);
if(announcement.starts_at && announcement.ends_at) {
var start = new Date(announcement.starts_at);
var end = new Date(announcement.ends_at);
datetime = (`<i class="fa fa-calendar"></i> ${start.getFullYear()}-${addZero(start.getMonth()+1)}-${addZero(start.getDate())}`);
if(!announcement.all_day) datetime += (` <i class="fa fa-clock-o"></i> ${addZero(start.getHours())}:${addZero(start.getMinutes())}`);
datetime += (` - <i class="fa fa-calendar"></i> ${end.getFullYear()}-${addZero(end.getMonth()+1)}-${addZero(end.getDate())}`);
if(!announcement.all_day) datetime += (` <i class="fa fa-clock-o"></i> ${addZero(end.getHours())}:${addZero(end.getMinutes())}`);
}
announcement = prepareAnnouncement(announcement);
const html=(`<div class="announcement" aid="${announcement.id}">
<div class="announcement_icon"><i class="fa fa-3x fa-exclamation-triangle"></i></div>
<div class="announcement_content">
<div class="announcement_text emoji_poss">${announcement.content}</div>
<div class="announcement_reactions">${reactions}</div>
<div class="announcement_date">${datetime}</div>
</div></div>`);
return html;
}
