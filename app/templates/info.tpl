<script id="info-template" type="text/x-handlebars-template">
   <div id="headerInfo">
      <button class="btnBack icon-search" rel="#/"><span>Back</span></button>
      <h1>{{title}}</h1>
      <img src="{{avatar}}" width="30" height="30" />
      {{totalPictures}} pictures - updated {{updated}}
   </div>
   <div class="content" id="gridContent" style="{{overflow}}{{height}}"></div>
 </script>