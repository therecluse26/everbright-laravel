var initPhotoSwipeFromDOM=function(b){var j=function(m){var t=m.childNodes,l=t.length,p=[],o,q,s,r;for(var n=0;n<l;n++){o=t[n];if(o.nodeType!==1){continue}q=o.children[0];s=q.getAttribute("data-size").split("x");r={src:q.getAttribute("href"),w:parseInt(s[0],10),h:parseInt(s[1],10)};if(o.children.length>1){r.title=o.children[1].innerHTML}if(q.children.length>0){r.msrc=q.children[0].getAttribute("src")}r.el=o;p.push(r)}return p};var c=function c(l,i){return l&&(i(l)?l:c(l.parentNode,i))};var g=function(q){q=q||window.event;q.preventDefault?q.preventDefault():q.returnValue=false;var n=q.target||q.srcElement;var t=c(n,function(i){return(i.tagName&&i.tagName.toUpperCase()==="FIGURE")});if(!t){return}var r=t.parentNode,s=t.parentNode.childNodes,o=s.length,l=0,p;for(var m=0;m<o;m++){if(s[m].nodeType!==1){continue}if(s[m]===t){p=l;break}l++}if(p>=0){f(p,r)}return false};var h=function(){var n=window.location.hash.substring(1),p={};if(n.length<5){return p}var m=n.split("&");for(var l=0;l<m.length;l++){if(!m[l]){continue}var o=m[l].split("=");if(o.length<2){continue}p[o[0]]=o[1]}if(p.gid){p.gid=parseInt(p.gid,10)}return p};var f=function(m,n,p,q){var i=document.querySelectorAll(".pswp")[0],s,r,o;o=j(n);r={galleryUID:n.getAttribute("data-pswp-uid"),getThumbBoundsFn:function(t){var w=o[t].el.getElementsByTagName("img")[0],v=window.pageYOffset||document.documentElement.scrollTop,u=w.getBoundingClientRect();return{x:u.left,y:u.top+v,w:u.width}}};if(q){if(r.galleryPIDs){for(var l=0;l<o.length;l++){if(o[l].pid==m){r.index=l;break}}}else{r.index=parseInt(m,10)-1}}else{r.index=parseInt(m,10)}if(isNaN(r.index)){return}if(p){r.showAnimationDuration=0}s=new PhotoSwipe(i,PhotoSwipeUI_Default,o,r);s.init()};var k=document.querySelectorAll(b);for(var e=0,d=k.length;e<d;e++){k[e].setAttribute("data-pswp-uid",e+1);k[e].onclick=g}var a=h();if(a.pid&&a.gid){f(a.pid,k[a.gid-1],true,true)}};

var $imagegrid = $('.photo-grid').masonry({
  itemSelector: '.photo-grid-image',
  gutter: 5,
  fitWidth: true
});

$imagegrid.imagesLoaded().progress( function() {
  $imagegrid.masonry();
  initPhotoSwipeFromDOM('.photo-grid');
});
