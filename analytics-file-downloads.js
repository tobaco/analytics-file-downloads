/**
 * jQuery GTAG Track Downloads
 *
 * This script will allow Google Analytics to track when a user downloads file attachements
 *
 * Based on code from http://www.blastam.com/blog/index.php/2013/03/how-to-track-downloads-in-google-analytics-v2
 */
$(document).ready(function($) {
  var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
  var baseHref = '';
  if ($('base').attr('href') != undefined) baseHref = $('base').attr('href');

  $('a').on('click', function(event) {
    var el = $(this);
    var track = true;
    var href = (typeof(el.attr('href')) != 'undefined' ) ? el.attr('href') :"";
    var isThisDomain = href.match(document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0]);
    if (!href.match(/^javascript:/i)) {
  	var elEv = []; elEv.value=0, elEv.non_i=false;
      if (href.match(/^mailto\:/i)) {
        elEv.category = "email";
        elEv.action = "click";
        elEv.label = href.replace(/^mailto\:/i, '');
        elEv.loc = href;
      }
      else if (href.match(filetypes)) {
        var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
        elEv.category = "download";
        elEv.action = "click-" + extension[0];
        elEv.label = href.replace(/ /g,"-");
        elEv.loc = baseHref + href;
      }
      else if (href.match(/^https?\:/i) && !isThisDomain) {
        elEv.category = "extern";
        elEv.action = "click";
        elEv.label = href.replace(/^https?\:\/\//i, '');
        elEv.non_i = true;
        elEv.loc = href;
      }
      else if (href.match(/^tel\:/i)) {
        elEv.category = "telefon";
        elEv.action = "click";
        elEv.label = href.replace(/^tel\:/i, '');
        elEv.loc = href;
      }
      else track = false;

     	if (track && typeof gtag == 'function') {
        gtag('event', elEv.action.toLowerCase(), {
          'event_category': elEv.category.toLowerCase(),
          'event_label': elEv.label.toLowerCase(),
          'value': elEv.value,
          'non_interaction': elEv.non_i,
          'transport_type': 'beacon',
          'event_callback': function(){
            if ( el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank') {
              location.href = elEv.loc; };
            }
           }
        });
        if ( el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank') {
          return false;
        }
      }
    }
  });
});
