/*!
 * iScroll Lite base on iScroll v4.1.6 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */

(function(){var e=Math,t=function(e){return e>>0},n=/webkit/i.test(navigator.appVersion)?"webkit":/firefox/i.test(navigator.userAgent)?"Moz":"opera"in window?"O":"",r=/android/gi.test(navigator.appVersion),i=/iphone|ipad/gi.test(navigator.appVersion),s=/playbook/gi.test(navigator.appVersion),o=/hp-tablet/gi.test(navigator.appVersion),u="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,a="ontouchstart"in window&&!o,f=n+"Transform"in document.documentElement.style,l=i||s,c=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){return setTimeout(e,17)}}(),h=function(){return window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout}(),p="onorientationchange"in window?"orientationchange":"resize",d=a?"touchstart":"mousedown",v=a?"touchmove":"mousemove",m=a?"touchend":"mouseup",g=a?"touchcancel":"mouseup",y="translate"+(u?"3d(":"("),b=u?",0)":")",w=function(e,t){var r=this,i=document,s;r.wrapper=typeof e=="object"?e:i.getElementById(e),r.wrapper.style.overflow="hidden",r.scroller=r.wrapper.children[0],r.options={hScroll:!0,vScroll:!0,x:0,y:0,bounce:!0,bounceLock:!1,momentum:!0,lockDirection:!0,useTransform:!0,useTransition:!1,onRefresh:null,onBeforeScrollStart:function(e){e.preventDefault()},onScrollStart:null,onBeforeScrollMove:null,onScrollMove:null,onBeforeScrollEnd:null,onScrollEnd:null,onTouchEnd:null,onDestroy:null};for(s in t)r.options[s]=t[s];r.x=r.options.x,r.y=r.options.y,r.options.useTransform=f?r.options.useTransform:!1,r.options.hScrollbar=r.options.hScroll&&r.options.hScrollbar,r.options.vScrollbar=r.options.vScroll&&r.options.vScrollbar,r.options.useTransition=l&&r.options.useTransition,r.scroller.style.width=r.scroller.style.width,r.scroller.style[n+"TransitionProperty"]=r.options.useTransform?"-"+n.toLowerCase()+"-transform":"top left",r.scroller.style[n+"TransitionDuration"]="0",r.scroller.style[n+"TransformOrigin"]="0 0",r.options.useTransition&&(r.scroller.style[n+"TransitionTimingFunction"]="cubic-bezier(0.33,0.66,0.66,1)"),r.options.useTransform?r.scroller.style[n+"Transform"]=y+r.x+"px,"+r.y+"px"+b:r.scroller.style.cssText+=";position:absolute;top:"+r.y+"px;left:"+r.x+"px",r.refresh(),r._bind(p,window),r._bind(d),a||r._bind("mouseout",r.wrapper)};w.prototype={enabled:!0,x:0,y:0,steps:[],scale:1,handleEvent:function(e){var t=this;switch(e.type){case d:if(!a&&e.button!==0)return;t._start(e);break;case v:t._move(e);break;case m:case g:t._end(e);break;case p:t._resize();break;case"mouseout":t._mouseout(e);break;case"webkitTransitionEnd":t._transitionEnd(e)}},_resize:function(){this.refresh()},_pos:function(e,r){e=this.hScroll?e:0,r=this.vScroll?r:0,this.options.useTransform?this.scroller.style[n+"Transform"]=y+e+"px,"+r+"px"+b+" scale("+this.scale+")":(e=t(e),r=t(r),this.scroller.style.left=e+"px",this.scroller.style.top=r+"px"),this.x=e,this.y=r},_start:function(e){var t=this,r=a?e.touches[0]:e,i,s,o;if(!t.enabled)return;t.options.onBeforeScrollStart&&t.options.onBeforeScrollStart.call(t,e),t.options.useTransition&&t._transitionTime(0),t.moved=!1,t.animating=!1,t.zoomed=!1,t.distX=0,t.distY=0,t.absDistX=0,t.absDistY=0,t.dirX=0,t.dirY=0;if(t.options.momentum){t.options.useTransform?(i=getComputedStyle(t.scroller,null)[n+"Transform"].replace(/[^0-9-.,]/g,"").split(","),s=i[4]*1,o=i[5]*1):(s=getComputedStyle(t.scroller,null).left.replace(/[^0-9-]/g,"")*1,o=getComputedStyle(t.scroller,null).top.replace(/[^0-9-]/g,"")*1);if(s!=t.x||o!=t.y)t.options.useTransition?t._unbind("webkitTransitionEnd"):h(t.aniTime),t.steps=[],t._pos(s,o)}t.startX=t.x,t.startY=t.y,t.pointX=r.pageX,t.pointY=r.pageY,t.startTime=e.timeStamp||Date.now(),t.options.onScrollStart&&t.options.onScrollStart.call(t,e),t._bind(v),t._bind(m),t._bind(g)},_move:function(t){var n=this,r=a?t.touches[0]:t,i=r.pageX-n.pointX,s=r.pageY-n.pointY,o=n.x+i,u=n.y+s,f=t.timeStamp||Date.now();n.options.onBeforeScrollMove&&n.options.onBeforeScrollMove.call(n,t),n.pointX=r.pageX,n.pointY=r.pageY;if(o>0||o<n.maxScrollX)o=n.options.bounce?n.x+i/2:o>=0||n.maxScrollX>=0?0:n.maxScrollX;if(u>0||u<n.maxScrollY)u=n.options.bounce?n.y+s/2:u>=0||n.maxScrollY>=0?0:n.maxScrollY;n.distX+=i,n.distY+=s,n.absDistX=e.abs(n.distX),n.absDistY=e.abs(n.distY);if(n.absDistX<6&&n.absDistY<6)return;n.options.lockDirection&&(n.absDistX>n.absDistY+5?(u=n.y,s=0):n.absDistY>n.absDistX+5&&(o=n.x,i=0)),n.moved=!0,n._pos(o,u),n.dirX=i>0?-1:i<0?1:0,n.dirY=s>0?-1:s<0?1:0,f-n.startTime>300&&(n.startTime=f,n.startX=n.x,n.startY=n.y),n.options.onScrollMove&&n.options.onScrollMove.call(n,t)},_end:function(n){if(a&&n.touches.length!=0)return;var r=this,i=a?n.changedTouches[0]:n,s,o,u={dist:0,time:0},f={dist:0,time:0},l=(n.timeStamp||Date.now())-r.startTime,c=r.x,h=r.y,p;r._unbind(v),r._unbind(m),r._unbind(g),r.options.onBeforeScrollEnd&&r.options.onBeforeScrollEnd.call(r,n);if(!r.moved){if(a){s=i.target;while(s.nodeType!=1)s=s.parentNode;s.tagName!="SELECT"&&s.tagName!="INPUT"&&s.tagName!="TEXTAREA"&&(o=document.createEvent("MouseEvents"),o.initMouseEvent("click",!0,!0,n.view,1,i.screenX,i.screenY,i.clientX,i.clientY,n.ctrlKey,n.altKey,n.shiftKey,n.metaKey,0,null),o._fake=!0,s.dispatchEvent(o))}r._resetPos(200),r.options.onTouchEnd&&r.options.onTouchEnd.call(r,n);return}if(l<300&&r.options.momentum){u=c?r._momentum(c-r.startX,l,-r.x,r.scrollerW-r.wrapperW+r.x,r.options.bounce?r.wrapperW:0):u,f=h?r._momentum(h-r.startY,l,-r.y,r.maxScrollY<0?r.scrollerH-r.wrapperH+r.y:0,r.options.bounce?r.wrapperH:0):f,c=r.x+u.dist,h=r.y+f.dist;if(r.x>0&&c>0||r.x<r.maxScrollX&&c<r.maxScrollX)u={dist:0,time:0};if(r.y>0&&h>0||r.y<r.maxScrollY&&h<r.maxScrollY)f={dist:0,time:0}}if(u.dist||f.dist){p=e.max(e.max(u.time,f.time),10),r.scrollTo(t(c),t(h),p),r.options.onTouchEnd&&r.options.onTouchEnd.call(r,n);return}r._resetPos(200),r.options.onTouchEnd&&r.options.onTouchEnd.call(r,n)},_resetPos:function(e){var t=this,n=t.x>=0?0:t.x<t.maxScrollX?t.maxScrollX:t.x,r=t.y>=0||t.maxScrollY>0?0:t.y<t.maxScrollY?t.maxScrollY:t.y;if(n==t.x&&r==t.y){t.moved&&(t.options.onScrollEnd&&t.options.onScrollEnd.call(t),t.moved=!1);return}t.scrollTo(n,r,e||0)},_mouseout:function(e){var t=e.relatedTarget;if(!t){this._end(e);return}while(t=t.parentNode)if(t==this.wrapper)return;this._end(e)},_transitionEnd:function(e){var t=this;if(e.target!=t.scroller)return;t._unbind("webkitTransitionEnd"),t._startAni()},_startAni:function(){var t=this,n=t.x,r=t.y,i=Date.now(),s,o,u;if(t.animating)return;if(!t.steps.length){t._resetPos(400);return}s=t.steps.shift(),s.x==n&&s.y==r&&(s.time=0),t.animating=!0,t.moved=!0;if(t.options.useTransition){t._transitionTime(s.time),t._pos(s.x,s.y),t.animating=!1,s.time?t._bind("webkitTransitionEnd"):t._resetPos(0);return}u=function(){var a=Date.now(),f,l;if(a>=i+s.time){t._pos(s.x,s.y),t.animating=!1,t.options.onAnimationEnd&&t.options.onAnimationEnd.call(t),t._startAni();return}a=(a-i)/s.time-1,o=e.sqrt(1-a*a),f=(s.x-n)*o+n,l=(s.y-r)*o+r,t._pos(f,l),t.animating&&(t.aniTime=c(u))},u()},_transitionTime:function(e){this.scroller.style[n+"TransitionDuration"]=e+"ms"},_momentum:function(n,r,i,s,o){var u=6e-4,a=e.abs(n)/r,f=a*a/(2*u),l=0,c=0;return n>0&&f>i?(c=o/(6/(f/a*u)),i+=c,a=a*i/f,f=i):n<0&&f>s&&(c=o/(6/(f/a*u)),s+=c,a=a*s/f,f=s),f*=n<0?-1:1,l=a/u,{dist:f,time:t(l)}},_offset:function(e){var t=-e.offsetLeft,n=-e.offsetTop;while(e=e.offsetParent)t-=e.offsetLeft,n-=e.offsetTop;return{left:t,top:n}},_bind:function(e,t,n){(t||this.scroller).addEventListener(e,this,!!n)},_unbind:function(e,t,n){(t||this.scroller).removeEventListener(e,this,!!n)},destroy:function(){var e=this;e.scroller.style[n+"Transform"]="",e._unbind(p,window),e._unbind(d),e._unbind(v),e._unbind(m),e._unbind(g),e._unbind("mouseout",e.wrapper),e.options.useTransition&&e._unbind("webkitTransitionEnd"),e.options.onDestroy&&e.options.onDestroy.call(e)},refresh:function(){var e=this,t;e.wrapperW=e.wrapper.clientWidth,e.wrapperH=e.wrapper.clientHeight,e.scrollerW=e.scroller.offsetWidth,e.scrollerH=e.scroller.offsetHeight,e.maxScrollX=e.wrapperW-e.scrollerW,e.maxScrollY=e.wrapperH-e.scrollerH,e.dirX=0,e.dirY=0,e.hScroll=e.options.hScroll&&e.maxScrollX<0,e.vScroll=e.options.vScroll&&(!e.options.bounceLock&&!e.hScroll||e.scrollerH>e.wrapperH),t=e._offset(e.wrapper),e.wrapperOffsetLeft=-t.left,e.wrapperOffsetTop=-t.top,e.scroller.style[n+"TransitionDuration"]="0",e._resetPos(200)},scrollTo:function(e,t,n,r){var i=this,s=e,o,u;i.stop(),s.length||(s=[{x:e,y:t,time:n,relative:r}]);for(o=0,u=s.length;o<u;o++)s[o].relative&&(s[o].x=i.x-s[o].x,s[o].y=i.y-s[o].y),i.steps.push({x:s[o].x,y:s[o].y,time:s[o].time||0});i._startAni()},scrollToElement:function(t,n){var r=this,i;t=t.nodeType?t:r.scroller.querySelector(t);if(!t)return;i=r._offset(t),i.left+=r.wrapperOffsetLeft,i.top+=r.wrapperOffsetTop,i.left=i.left>0?0:i.left<r.maxScrollX?r.maxScrollX:i.left,i.top=i.top>0?0:i.top<r.maxScrollY?r.maxScrollY:i.top,n=n===undefined?e.max(e.abs(i.left)*2,e.abs(i.top)*2):n,r.scrollTo(i.left,i.top,n)},disable:function(){this.stop(),this._resetPos(0),this.enabled=!1,this._unbind(v),this._unbind(m),this._unbind(g)},enable:function(){this.enabled=!0},stop:function(){h(this.aniTime),this.steps=[],this.moved=!1,this.animating=!1}},typeof exports!="undefined"?exports.iScroll=w:window.iScroll=w})()