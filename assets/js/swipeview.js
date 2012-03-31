/*!
 * SwipeView v0.11 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Vertical mod by Per-Olov Jernberg, http://possan.se
 * Released under MIT license, http://cubiq.org/license
 */
var SwipeView = (function(){
	
	var hasTouch = 'ontouchstart' in window,
		resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove',
		endEvent = hasTouch ? 'touchend' : 'mouseup',
		cancelEvent = hasTouch ? 'touchcancel' : 'mouseup';
		
	var	SwipeView = function (el, options) {
		this.__construct( el, options );
	};
	
	SwipeView.prototype = {
		
		currentMasterPage: 1,
		pos: 0,
		page: 0,
		pageIndex: 0,
		customEvents: [],
		
		onFlip: function (fn) {
			this.wrapper.addEventListener('swipeview-flip', fn, false);
			this.customEvents.push(['flip', fn]);
		},
		 
		onMoveOut: function (fn) {
			this.wrapper.addEventListener('swipeview-moveout', fn, false);
			this.customEvents.push(['moveout', fn]);
		},

		onMoveIn: function (fn) {
			this.wrapper.addEventListener('swipeview-movein', fn, false);
			this.customEvents.push(['movein', fn]);
		},
		
		onClick: function (fn) {
			this.wrapper.addEventListener('swipeview-click', fn, false);
			this.customEvents.push(['click', fn]);
		},
		
		onTouchStart: function (fn) {
			this.wrapper.addEventListener('swipeview-touchstart', fn, false);
			this.customEvents.push(['touchstart', fn]);
		},

		destroy: function () {
			var i, l;
			// for (i=0, l=this.customEvents.length; i<l; i++) {
			//             this.wrapper.removeEventListener('swipeview-' + this.customEvents[i][0], this.customEvents[i][1], false);
			//          }
			while ( this.customEvents.length ) {
            this.wrapper.removeEventListener('swipeview-' + this.customEvents[0][0],this.customEvents[0][1], false);
            this.customEvents.shift();
         }
			
			this.customEvents = [];
			
			// Remove the event listeners
			window.removeEventListener(resizeEvent, this, false);
			this.wrapper.removeEventListener(startEvent, this, false);
			this.wrapper.removeEventListener(moveEvent, this, false);
			this.wrapper.removeEventListener(endEvent, this, false);
			this.slider.removeEventListener('webkitTransitionEnd', this, false);
		},

		refreshSize: function () {
			this.wrapperSize = this.options.vertical ? this.wrapper.clientHeight : this.wrapper.clientWidth;
			this.pageSize = this.wrapperSize;
			this.maxPos = -this.options.numberOfPages * this.pageSize + this.wrapperSize;
			this.snapThreshold = this.options.snapThreshold === null
				? Math.round(this.pageSize * .15)
				: /%/.test(this.options.snapThreshold)
					? Math.round(this.pageSize * this.options.snapThreshold.replace('%', '') / 100)
					: this.options.snapThreshold;
		},
		
		updatePageCount: function (n) {
			this.options.numberOfPages = n;
			this.maxPos = -this.options.numberOfPages * this.pageSize + this.wrapperSize;
		},
		
		goToPage: function (p) {

			if( this.options.dynamic ) {
				this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
				for (var i=0; i<3; i++) {
					className = this.masterPages[i].className;
					/(^|\s)swipeview-loading(\s|$)/.test(className) || (this.masterPages[i].className = !className ? 'swipeview-loading' : className + ' swipeview-loading');
				}
			}
			
			p = p < 0 ? 0 : p > this.options.numberOfPages-1 ? this.options.numberOfPages-1 : p;
			this.page = p;
			this.pageIndex = p;
			
			this.slider.style.webkitTransitionDuration = '0';
			this.__pos(-p * this.pageSize);
			
			if( this.options.dynamic )
				this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;
			else
				this.currentMasterPage = this.page;
			
			if( this.options.dynamic ){
				this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className + ' swipeview-active';
				var mp0,mp1,mp2;
				if (this.currentMasterPage == 0) {
					mp0 = this.masterPages[2];
					mp1 = this.masterPages[0];
					mp2 = this.masterPages[1];
				} else if (this.currentMasterPage == 1) {
					mp0 = this.masterPages[0];
					mp1 = this.masterPages[1];
					mp2 = this.masterPages[2];
				} else {
					mp0 = this.masterPages[1];
					mp1 = this.masterPages[2];
					mp2 = this.masterPages[0];
				}

				var leftpageindex = this.page == 0 ? this.options.numberOfPages-1 : this.page - 1;
				var rightpageindex = this.page == this.options.numberOfPages-1 ? 0 : this.page + 1;

				this.__movePage( mp0, leftpageindex, this.page * 100 - 100 );
				this.__movePage( mp1, this.page, this.page * 100 );
				this.__movePage( mp2, rightpageindex, this.page * 100 + 100 );
				
			}
			else {
				
			} 
			
			this.__flip();
		},
		
		//gotoPage: this.goToPage,
		
		next: function () {			
			if (!this.options.loop && this.pos == this.maxPos)
				return;
			this.direction = -1;
			this.pos -= 1;
			this.__checkPosition();
		},

		prev: function () {
			if (!this.options.loop && this.pos == 0)
				return;
			this.direction = 1;
			this.pos += 1;
			this.__checkPosition();
		},

		handleEvent: function (e) {
			switch (e.type) {
				case startEvent:
					this.__start(e);
					break;
				case moveEvent:
					this.__move(e);
					break;
				case cancelEvent:
				case endEvent:
					this.__end(e);
					break;
				case resizeEvent:
				 	this.__resize();
					break;
				case 'webkitTransitionEnd':
				   this.swiping = false;
					if (e.target == this.slider && !this.options.hastyPageFlip) this.__flip();
					break;
			}
		},


		/**
		 *
		 * Pseudo private methods
		 *
		 */
		
		__construct: function( el, options ) {
		
			var i,
				div,
				className,
				pageIndex;

			this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
			this.options = {
				text: null,
				numberOfPages: 3,
				snapThreshold: null,
				hastyPageFlip: false,
				vertical: false,
				loop: true,
				dynamic: true,
				createPage: null,
				updatePage: null,
				beforeShow: null,
				positionPage: null,
				preventFastSwiping: true
			}
		
			// User defined options
			for (i in options) this.options[i] = options[i];
			
			// console.log( '__construct ', this.options.text, ' in ',this.wrapper );
			
			this.wrapper.style.overflow = 'hidden';
			this.wrapper.style.position = 'relative';
			
			this.topmult = this.options.vertical ? 1.0 : 0.0;
			this.leftmult = this.options.vertical ? 0.0 : 1.0;
			
			this.masterPages = [];
			
			div = document.createElement('div');
			div.id = 'swipeview-slider';
			div.style.cssText = 'position:relative;top:0;left:0;height:100%;width:100%;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);-webkit-transition-timining-function:ease-out';
			this.wrapper.appendChild(div);
			this.slider = div;

			this.refreshSize();
			
			if( this.options.dynamic ) {  
				
				for (i=-1; i<2; i++) {
					div = document.createElement('div');
					div.id = 'swipeview-masterpage-' + (i+1);

					var left = (this.leftmult * i*100) + '%';
					var top = (this.topmult * i*100) + '%';
					div.style.cssText = '-webkit-transform:translateZ(0);position:absolute;height:100%;width:100%;left:'+left+';top:'+top;

					if (!div.dataset) div.dataset = {};
					pageIndex = i == -1 ? this.options.numberOfPages - 1 : i;
					div.dataset.pageIndex = pageIndex;
					div.dataset.upcomingPageIndex = pageIndex;
					// if (!this.options.loop && i == -1) div.style.visibility = 'hidden';
					if (!this.options.loop && i == -1) div.style.visibility = '';

					this.slider.appendChild(div);
					this.masterPages.push(div);

					if( this.options.createPage != null )
						this.options.createPage( div, pageIndex );
					if( i==0 )
						if( this.options.beforeShow != null )
							this.options.beforeShow( div, pageIndex );
				}

				className = this.masterPages[1].className;
				this.masterPages[1].className = !className ? 'swipeview-active' : className + ' swipeview-active';
			} 
			else {
				
				for (i=0; i<this.options.numberOfPages; i++) {
					div = document.createElement('div');
					div.id = 'swipeview-masterpage-' + i;

					var left = (this.leftmult * i*100) + '%';
					var top = (this.topmult * i*100) + '%';
					div.style.cssText = '-webkit-transform:translateZ(0);position:absolute;height:100%;width:100%;left:'+left+';top:'+top;

					if (!div.dataset) div.dataset = {};
					div.dataset.pageIndex = i;
					div.dataset.upcomingPageIndex = i;

				//	if (i != 0)
				//		div.style.visibility = 'hidden';

					this.slider.appendChild(div);
					this.masterPages.push(div);

					if( this.options.createPage != null )
						this.options.createPage( div, i );
					if( i==0 )
						if( this.options.beforeShow != null )
							this.options.beforeShow( div, i );
				}

				// className = this.masterPages[0].className;
		//		this.masterPages[0].className = 'swipeview-active';

			}

			window.addEventListener(resizeEvent, this, false);
			this.wrapper.addEventListener(startEvent, this, false);
			this.wrapper.addEventListener(moveEvent, this, false);
			this.wrapper.addEventListener(endEvent, this, false);
			this.slider.addEventListener('webkitTransitionEnd', this, false);
		},
		
		__movePage: function( el, idx, pos ) {
			
			var x = this.topmult * pos;
			var y = this.leftmult * pos;
			
			if( this.options.positionPage != null ) {
				this.options.positionPage( el, idx, x,y );
				return;
			}
			
			el.dataset.upcomingPageIndex = idx;
			el.style.top = x + '%';
			el.style.left = y + '%';
		},
		
		__pos: function (v) {
			this.pos = v;
			if( this.options.vertical )
				this.slider.style.webkitTransform = 'translate3d(0,' + v + 'px,0)';
			else
				this.slider.style.webkitTransform = 'translate3d(' + v + 'px,0,0)';
		},

		__resize: function () {
			this.refreshSize();
			this.slider.style.webkitTransitionDuration = '0';
			this.__pos(-this.page * this.pageSize);
		},

		__start: function (e) {
			// e.preventDefault();
			// console.log('__start in '+this.options.text);

			if (this.initiated) return;
			if (this.options.preventFastSwiping && this.swiping) return;
			
			var point = hasTouch ? e.touches[0] : e;
			
			this.initiated = true;
			this.swiping = true;
			this.moved = false;
			this.thresholdExceeded = false;
			this.startX = point.pageX;
			this.startY = point.pageY;
			this.pointX = point.pageX;
			this.pointY = point.pageY;
			this.stepsX = 0;
			this.stepsY = 0;
			this.direction = 0;
			this.directionLocked = false;
			
			this.slider.style.webkitTransitionDuration = '0';
			
			this.__event('touchstart');
			
			if( this.options.beforeShow != null ){
				var mp0,mp2;
				if( this.options.dynamic ) {
					if (this.currentMasterPage == 0) {
						mp0 = this.masterPages[2];
						mp2 = this.masterPages[1];
					} else if (this.currentMasterPage == 1) {
						mp0 = this.masterPages[0];
						mp2 = this.masterPages[2];
					} else {
						mp0 = this.masterPages[1];
						mp2 = this.masterPages[0];
					}
				}
				else {
					if( this.page > 1 )	mp0 = this.masterPages[this.page-1];
					if( this.page < this.options.numberOfPages-1 ) mp2 = this.masterPages[this.page+1];
				}
				if( mp0 != null ) this.options.beforeShow( mp0, mp0.dataset.pageIndex );
				if( mp2 != null ) this.options.beforeShow( mp2, mp2.dataset.pageIndex );
			}
		},
		
		__move: function (e) {
			if (!this.initiated) return;

			var point = hasTouch ? e.touches[0] : e,
				deltaX = point.pageX - this.pointX,
				deltaY = point.pageY - this.pointY;
	
			var delta = this.options.vertical ? deltaY : deltaX;
		
			var newPos = this.pos + delta;
				
			var	dist = this.options.vertical 
				? Math.abs(point.pageY - this.startY)
				: Math.abs(point.pageX - this.startX);

			// console.log('__move in '+this.options.text);

			this.moved = true;
			this.pointX = point.pageX;
			this.pointY = point.pageY;

			this.direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;
			
			this.stepsX += Math.abs(deltaX);
			this.stepsY += Math.abs(deltaY);

			// We take a 10px buffer to figure out the direction of the swipe
			if (this.stepsX < 10 && this.stepsY < 10) {
//				e.preventDefault();
				return;
			}
			
			if( !this.directionLocked ) {
				if ((this.options.vertical && this.stepsX > this.stepsY) ||
				    (!this.options.vertical && this.stepsY > this.stepsX)) {
					this.initiated = false;
					return;
				}
			}

			// console.log('__move, locked and correct direction in '+this.options.text);

			e.preventDefault();

			this.directionLocked = true;

			if (!this.options.loop && (newPos > 0 || newPos < this.maxPos)) {
				newPos = this.pos + (delta / 2);
			}
			 
			if (!this.thresholdExceeded && dist >= this.snapThreshold) {
				this.thresholdExceeded = true;
				this.__event('moveout');
			} else if (this.thresholdExceeded && dist < this.snapThreshold) {
				this.thresholdExceeded = false;
				this.__event('movein');
			}
			
			this.__pos(newPos);
		},
		
		__end: function (e) {
			if (!this.initiated) return;
			
			var point = hasTouch ? e.changedTouches[0] : e;
			var dist = this.options.vertical
				? Math.abs(point.pageY - this.startY)
				: Math.abs(point.pageX - this.startX);

			this.initiated = false;
			
			if (!this.moved) {
			   this.swiping = false;
			   this.__event('click');
			   //return;			   
		   }

			if (!this.options.loop && (this.pos > 0 || this.pos < this.maxPos)) {
				dist = 0;
				this.__event('movein');
			}

			// Check if we exceeded the snap threshold
			if (dist < this.snapThreshold) {
				this.slider.style.webkitTransitionDuration = '300ms';
				this.__pos(-this.page * this.pageSize);
				return;
			}

			this.__checkPosition();
		},
		
		__checkPosition: function () {
			
			var pageFlip,
				pageFlipIndex,
				className;

			this.masterPages[this.currentMasterPage].className = this.masterPages[this.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
					
			var forward = this.direction > 0;

			// Flip the page
			if (forward) {
				this.direction ='backward';
				this.page = -Math.ceil(this.pos / this.pageSize);

				if( this.options.dynamic )
					this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;
				else
					this.currentMasterPage = this.page;
				
				this.pageIndex = this.pageIndex == 0 ? this.options.numberOfPages - 1 : this.pageIndex - 1;

				if( this.options.dynamic )
				{
					pageFlip = this.currentMasterPage - 1;
					pageFlip = pageFlip < 0 ? 2 : pageFlip;
					var pprev = this.page * 100 - 100;
					this.masterPages[pageFlip].style.top = (this.topmult * pprev) + '%';
					this.masterPages[pageFlip].style.left = (this.leftmult * pprev) + '%';
				}

				pageFlipIndex = this.page - 1;
			} else {
				this.direction ='forward';
				this.page = -Math.floor(this.pos / this.pageSize);

				if( this.options.dynamic )
					this.currentMasterPage = (this.page + 1) - Math.floor((this.page + 1) / 3) * 3;
				else
					this.currentMasterPage = this.page;
				
				this.pageIndex = this.pageIndex == this.options.numberOfPages - 1 ? 0 : this.pageIndex + 1;

				if( this.options.dynamic )
				{
					pageFlip = this.currentMasterPage + 1;
					pageFlip = pageFlip > 2 ? 0 : pageFlip;
					var pnext = this.page * 100 + 100;
					this.masterPages[pageFlip].style.top = (this.topmult * pnext) + '%';
					this.masterPages[pageFlip].style.left = (this.leftmult * pnext) + '%';
				}
			
				pageFlipIndex = this.page + 1;
			}

			// Add active class to current page
			className = this.masterPages[this.currentMasterPage].className;
			/(^|\s)swipeview-active(\s|$)/.test(className) || (this.masterPages[this.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active');

			if( this.options.dynamic )
			{
				// Add loading class to flipped page
				className = this.masterPages[pageFlip].className;
				/(^|\s)swipeview-loading(\s|$)/.test(className) || (this.masterPages[pageFlip].className = !className ? 'swipeview-loading' : className + ' swipeview-loading');
			
				pageFlipIndex = pageFlipIndex - Math.floor(pageFlipIndex / this.options.numberOfPages) * this.options.numberOfPages;
				this.masterPages[pageFlip].dataset.upcomingPageIndex = pageFlipIndex;		// Index to be loaded in the newly flipped page
			}

			this.slider.style.webkitTransitionDuration = '500ms';
			
			var newPos = -this.page * this.pageSize;
			
			if( this.options.dynamic )
			{
				if (!this.options.loop) {
					//this.masterPages[pageFlip].style.visibility = (newPos == 0 || newPos == this.maxPos) ? 'hidden' : '';
				}
			}

			if (this.pos == newPos) {
				this.__flip(); // If we swiped all the way long to the next page (extremely rare but still)
			} else {
				this.__pos(newPos);
				if (this.options.hastyPageFlip) 
					this.__flip();
			}
		},
		
		__flip: function () {
			this.__event('flip');
			if(this.options.dynamic ){
				for (var i=0; i<3; i++) {
					this.masterPages[i].className = this.masterPages[i].className.replace(/(^|\s)swipeview-loading(\s|$)/, '');
					// Remove the loading class
					this.masterPages[i].dataset.pageIndex = this.masterPages[i].dataset.upcomingPageIndex;
				}
			}
		},
		
		__event: function (type,opts) {
			var ev = document.createEvent("Event");
			ev.initEvent('swipeview-' + type, true, true);
			if( typeof(opts) !== 'undefined' )	
				for (i in opts) ev[i] = opts[i];
			this.wrapper.dispatchEvent(ev);
		}
	};
	
	// SwipeView.__construct( el, options );

	return SwipeView;
})();