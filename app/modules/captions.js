define([ '../../assets/js/iscroll'], function (iScr) {  
   captionButtons =$('#tmblButtons'),
   handle = $('#detailCaption .handle'),
   detailCaption = $('#detailCaption'),
   captionContent = $('#captionContent > div'),
   pin = $('#pin');   
	// set pinned caption (remains visible)
	pin.on('click', function(){	   
	   $(this).toggleClass('pinned');	
	   caption.isPinned = (caption.isPinned===true)?false:true; 
	});	
	// debug on desktop
   handle.on('click', function(){           
      caption.slide.toggle();
   });    
               
   var caption = {  
      isPinned: true,  
      pattern : /(http:\/\/).*(?=.tumblr)/,
      init: function(){
         caption.scrollable = new iScroll('captionContent');
      	return caption.slide= new slideInMenu('detailCaption', false, 'bottom'); 
      }, 
      update: function(){
         var currentCaption =$('.swipeview-active .caption').html();
         // empty caption buttons
         captionButtons.html(''); 
         // detect if a link to a tumblr site is present in caption. If so add as a button to caption
         if(currentCaption){
            // quite convoluted solution to get all tumblr sites in caption
         	// split all .com sites
         	tumblrRef = currentCaption.split('.com');
         	var buttons ='';
         	var l = tumblrRef.length;   
            for(i=0; i<l; i++){ 
               // if match pattern get tumblrid, get rid of http... and insert in a link 
               if(caption.pattern.test(tumblrRef[i])){                  
                  tumblrRef[i] = caption.pattern.exec(tumblrRef[i]); 
                  tumblrRef[i] = tumblrRef[i][0].replace("http://", "");                                 
                  buttons+='<a href="#/'+tumblrRef[i]+'">'+tumblrRef[i]+'</a>'; 
               }
            }                                         
            // add buttons to caption  
            captionButtons.html(buttons);        
         }   
         // empty previous caption 
         captionContent.html('').append(currentCaption);
         setTimeout(function () {
		      caption.scrollable.refresh();
	      }, 0);
         var h = detailCaption.height();
         captionButtons.css({'top':'auto', 'bottom':h+'px'});
         detailCaption.css({'bottom':'-'+h+'px'});
         // if pinned the caption automatically opens and stay open if a caption is present. Otherwise it closes as usual 
         if(caption.isPinned){
            if(currentCaption){
               caption.slide.open();
               handle.addClass('visible');
            }else{
               caption.slide.close();
               handle.removeClass('visible');
            } 
         }else{
            if(currentCaption){
               handle.addClass('visible');
            }else{
               handle.removeClass('visible');
            } 
         }       
      },
      close: function(){
      	caption.slide.close();         
      },
      closeWithoutAnimation: function(){
      	caption.slide.closeWithoutAnimation();         
      }
   };
    
   return caption;
});
