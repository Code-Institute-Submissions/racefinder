$(document).ready(function(){

// jQuery methods go here...


console.log("Pre Parsing");


var urlbase ='https://cors-anywhere.herokuapp.com/http://api.amp.active.com/v2/search?query=running&category=event';
var urlpage = '&current_page=1';
var urlresultperpage = '&per_page=1000';
var urlstartdate = '&start_date=2019-01-01..';
var urlenddate = '2019-06-30';
var urlorder = '&sort=date_asc';
// could be 'date_desc' or 'distance'

// var urlplace = '&near=San%20Diego,CA,US';§
var urlplace = '&near=london,GB';

var urlradius = '&radius=50';
var apikey = '&api_key=y3ptgtcc32fd8dcakhcck2c8';

var raceList = "<ul>";



var urlcomplete = urlbase + urlpage + urlresultperpage + urlstartdate + urlenddate + urlorder + urlplace + urlradius + apikey

// Using AJAX method instead of getJSON to have a bit more control 
// https://www.youtube.com/watch?v=j-S5MBs4y0Q


	$("#searchbutton").click(NewRequest());


	function NewRequest()
	{
		$.ajax (
		{
			url: urlcomplete,
			dataType: 'json',
			type: 'get',
			cache: false,

			success : function(data) 
			{
				console.log("During Parsing");
				console.log(data);
				$(data.results).each(function(index, value)

				{
					raceList += "<li> "+ value.salesStartDate 
					// + " - " + value.assetAttributes[0].attribute.attributeValue
					+ " - " + value.assetName + "</li>";	
				});
					
				console.log("Post Parsing");
				raceList += "</ul>";
				console.log("HTML result");
				$('#race-data-container').append(raceList);
				console.log("After Appending HTML");
			}
		});
	}
	



});



// http://api.amp.active.com/v2/search?query=running&category=event&start_date=2013-07-04..&near=San%20Diego,CA,US&radius=50&api_key=y3ptgtcc32fd8dcakhcck2c8
// API key: y3ptgtcc32fd8dcakhcck2c8
// http://developer.active.com/docs/v2_activity_api_search#ranges

// CORS ERROR potential fix :
// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
// https://cors-anywhere.herokuapp.com/

// https://cors-anywhere.herokuapp.com/http://api.amp.active.com/v2/search?query=running&category=event&start_date=2013-07-04..&near=San%20Diego,CA,US&radius=50&api_key=y3ptgtcc32fd8dcakhcck2c8




// ideas :
// https://www.w3schools.com/howto/howto_js_autocomplete.asp


// API documentation : 
// http://developer.active.com/docs/read/v2_Activity_API_Search