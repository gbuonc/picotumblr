define(["../../assets/js/iscroll","modules/app"],function(e,t){$hpHistory=$("recentSites > div");var n={recent:{update:function(){var e=t.recent.sites.length;if(e>0){var n="";for(i=0;i<=e;i++)n+='<a href="#/'+t.recent.sites[i].id+'"><img src="'+t.recent.sites[i].av+'"/></a>';$hpHistory.html(n)}}}};return n})