var Lawnchair=function(){if(!JSON)throw"JSON unavailable! Include http://www.json.org/json2.js to fix.";if(arguments.length<=2&&arguments.length>0){var e=typeof arguments[0]=="function"?arguments[0]:arguments[1],t=typeof arguments[0]=="function"?{}:arguments[0];if(typeof e!="function")throw"No callback was provided";var n=this instanceof Lawnchair?this:new Lawnchair(t,e);n.record=t.record||"record",n.name=t.name||"records";var r;if(t.adapter)r=Lawnchair.adapters[n.indexOf(Lawnchair.adapters,t.adapter)],r=r.valid()?r:undefined;else for(var i=0,s=Lawnchair.adapters.length;i<s;i++)if(r=Lawnchair.adapters[i].valid()?Lawnchair.adapters[i]:undefined)break;if(!r)throw"No valid adapter.";for(var o in r)n[o]=r[o];i=0;for(s=Lawnchair.plugins.length;i<s;i++)Lawnchair.plugins[i].call(n);return n.init(t,e),n}throw"Incorrect # of ctor args!"};Lawnchair.adapters=[],Lawnchair.adapter=function(e,t){t.adapter=e;var n="adapter valid init keys save batch get exists all remove nuke".split(" "),r=this.prototype.indexOf,i;for(i in t)if(r(n,i)===-1)throw"Invalid adapter! Nonstandard method: "+i;Lawnchair.adapters.push(t)},Lawnchair.plugins=[],Lawnchair.plugin=function(e){for(var t in e)t==="init"?Lawnchair.plugins.push(e[t]):this.prototype[t]=e[t]},Lawnchair.prototype={isArray:Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"},indexOf:function(e,t,n,r){if(e.indexOf)return e.indexOf(t);n=0;for(r=e.length;n<r;n++)if(e[n]===t)return n;return-1},lambda:function(e){return this.fn(this.record,e)},fn:function(e,t){return typeof t=="string"?new Function(e,t):t},uuid:function(){var e=function(){return((1+Math.random())*65536|0).toString(16).substring(1)};return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()},each:function(e){var t=this.lambda(e);if(this.__results){e=0;for(var n=this.__results.length;e<n;e++)t.call(this,this.__results[e],e)}else this.all(function(e){for(var n=0,r=e.length;n<r;n++)t.call(this,e[n],n)});return this}},Lawnchair.adapter("dom",{valid:function(){return!!window.Storage},init:function(e,t){this.storage=window.localStorage;var n=this;this.indexer={key:n.name+"._index_",all:function(){return JSON.parse(n.storage.getItem(this.key))==null&&n.storage.setItem(this.key,JSON.stringify([])),JSON.parse(n.storage.getItem(this.key))},add:function(e){var t=this.all();t.push(e),n.storage.setItem(this.key,JSON.stringify(t))},del:function(e){for(var t=this.all(),r=[],i=0,s=t.length;i<s;i++)t[i]!=e&&r.push(t[i]);n.storage.setItem(this.key,JSON.stringify(r))},find:function(e){for(var t=this.all(),n=0,r=t.length;n<r;n++)if(e===t[n])return n;return!1}},t&&this.fn(this.name,t).call(this,this)},save:function(e,t){var n=e.key||this.uuid();return this.indexer.find(n)||this.indexer.add(n),delete e.key,this.storage.setItem(n,JSON.stringify(e)),t&&(e.key=n,this.lambda(t).call(this,e)),this},batch:function(e,t){for(var n=[],r=0,i=e.length;r<i;r++)this.save(e[r],function(e){n.push(e)});return t&&this.lambda(t).call(this,n),this},keys:function(){callback&&this.lambda(callback).call(this,this.indexer.all())},get:function(e,t){if(this.isArray(e)){for(var n=[],r=0,i=e.length;r<i;r++){var s=JSON.parse(this.storage.getItem(e[r]));s&&(s.key=e[r],n.push(s))}t&&this.lambda(t).call(this,n)}else{if(s=JSON.parse(this.storage.getItem(e)))s.key=e;t&&this.lambda(t).call(this,s)}return this},all:function(e){for(var t=this.indexer.all(),n=[],r,i=0,s=t.length;i<s;i++)r=JSON.parse(this.storage.getItem(t[i])),r.key=t[i],n.push(r);return e&&this.fn(this.name,e).call(this,n),this},remove:function(e,t){var n=typeof e=="string"?e:e.key;return this.indexer.del(n),this.storage.removeItem(n),t&&this.lambda(t).call(this),this},nuke:function(e){return this.all(function(t){for(var n=0,r=t.length;n<r;n++)this.remove(t[n]);e&&this.lambda(e).call(this)}),this}}),Lawnchair.adapter("window-name",function(e,t){var n=window.top.name?JSON.parse(window.top.name):{};return{valid:function(){return typeof window.top.name!="undefined"},init:function(r,i){n[this.name]={index:[],store:{}},e=n[this.name].index,t=n[this.name].store,this.fn(this.name,i).call(this,this)},keys:function(t){return this.fn("keys",t).call(this,e),this},save:function(r,i){var s=r.key||this.uuid();return r.key&&delete r.key,this.exists(s,function(o){o||e.push(s),t[s]=r,window.top.name=JSON.stringify(n),i&&(r.key=s,this.lambda(i).call(this,r))}),this},batch:function(e,t){for(var n=[],r=0,i=e.length;r<i;r++)this.save(e[r],function(e){n.push(e)});return t&&this.lambda(t).call(this,n),this},get:function(e,n){var r;if(this.isArray(e)){r=[];for(var i=0,s=e.length;i<s;i++)r.push(t[e[i]])}else if(r=t[e])r.key=e;return n&&this.lambda(n).call(this,r),this},exists:function(e,n){return this.lambda(n).call(this,!!t[e]),this},all:function(n){for(var r=[],i=0,s=e.length;i<s;i++){var o=t[e[i]];o.key=e[i],r.push(o)}return this.fn(this.name,n).call(this,r),this},remove:function(r,i){for(var s=this.isArray(r)?r:[r],o=0,u=s.length;o<u;o++)delete t[s[o]],e.splice(this.indexOf(e,s[o]),1);return window.top.name=JSON.stringify(n),i&&this.lambda(i).call(this),this},nuke:function(t){return storage={},e=[],window.top.name=JSON.stringify(n),t&&this.lambda(t).call(this),this}}}()),define("modules/../../assets/js/lawnchair",[],function(){}),define("modules/app",["../../assets/js/lawnchair"],function(e){Array.prototype.remove=function(e,t){var n=this.slice((t||e)+1||this.length);return this.length=e<0?this.length+e:e,this.push.apply(this,n)};var t={config:{ppp:20,buffer:80,storageId:"local"},orientation:"portrait",isMobile:/ip(hone|od|ad)|android|blackberry.*applewebkit/i.test(navigator.userAgent),history:{},favs:{},rels:{},current:{tumblrId:null,gridPage:0,detailPic:0,animation:"none",reset:function(e){t.current.tumblrId=e,t.current.gridPage=0,t.current.detailPic=0,t.current.animation="none"}},$mainApp:$("#mainApp"),$loadbar:$("#loadbarWrapper"),$hpCover:$("#homeCover"),init:function(){t.checkDeviceOrientation(),typeof window.onorientationchange!="undefined"&&window.addEventListener("orientationchange",function(){window.scrollTo(0,1),(Math.abs(window.orientation)==0||90||180)&&t.checkDeviceOrientation()},!1),window.navigator.standalone?$("body").bind("touchmove",function(e){e.preventDefault()}):(t.isMobile&&t.$mainApp.addClass("browser"),window.scrollTo(0,1)),t.storage=Lawnchair({name:t.config.storageId},function(){}),t.storage.get(t.config.storageId,function(e){if(e===null){var n={history:[],favs:[],rels:[]};t.storage.save({key:t.config.storageId,value:n},function(){})}}),require(["modules/routing"],function(e){e.init(),e.getRoute()==""&&(location.href="#/")}),require(["modules/tabs"],function(e){e.init(),t.hideCover()})},checkDeviceOrientation:function(){if(typeof window.onorientationchange!="undefined"){var e=Math.abs(window.orientation);t.orientation=e==90?"landscape":"portrait"}},showLoadbar:function(){t.$loadbar.addClass("visible")},hideLoadbar:function(){t.$loadbar.removeClass("visible")},hideCover:function(){t.$hpCover.addClass("anim fade out").bind("webkitAnimationEnd",function(){$(this).hide()})},errors:{showAlert:function(e){alert(e)},message:{empty:"Please enter a valid tumblr ID",404:"The site you entered doesn't exist.",503:"Tumblr seems down at the moment. Please try again later.",noPictures:"This tumblr doesn't contain pictures.",noConnection:"No internet connection detected",generic:"An error occurred. Please try again later."}},showMessage:function(e){alert(e)}};return t})