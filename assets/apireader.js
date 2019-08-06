// $(document).ready(function(){});


var urlbase ='https://cors-anywhere.herokuapp.com/http://api.amp.active.com/v2/search?query=running&category=event';
var pagenumber = 1;
var urlpage = '&current_page='+pagenumber;
var resultsperpage = 5;
var urlresultperpage = '&per_page='+resultsperpage;

var urlstartdate = '&start_date=2009-01-01..';
var urlenddate = '2019-06-30';
var urlorder = '&sort=date_asc'; // could be 'date_desc' or 'distance'
var urlplace = '&near=london,GB'; // location (city, country)
var urlradius = '&radius=50'; // in miles
var apikey = '&api_key=y3ptgtcc32fd8dcakhcck2c8';

var urlcomplete = urlbase + urlpage + urlresultperpage + urlstartdate + urlenddate + urlorder + urlplace + urlradius + apikey

var number_results = 0;
var raceList = "<p>Number of results : ";
// Using AJAX method instead of getJSON to have a bit more control 
// https://www.youtube.com/watch?v=j-S5MBs4y0Q


function NewRequest()
{




		$.ajax (
		{
			url: urlcomplete,
			dataType: 'json',
			type: 'get',
			cache: false,

			// error handling courtesy of https://jsfiddle.net/Sk8erPeter/AGpP5/

			error: function(jqXHR, textStatus, errorThrown) 
			{
                $('#race-data-container').append('<p><span>API Error, please contact the dev Raph Zenou and quote these details:<br>Status code: '+jqXHR.status+' | ' + errorThrown + ' | '+ jqXHR.responseText + '</span></p>');
            },

			success : function(data) 
			{
				console.log("nb of results");
				console.log(data);
				number_results = data.total_results;
				raceList += number_results + "</p><br><ul>";

				$(data.results).each(function(index, value)

				{
					raceList += "<li> "+ value.salesStartDate 
					// + " - " + value.assetAttributes[0].attribute.attributeValue
					+ " - " + value.assetName + "</li>";	
				});


					
				raceList += "</ul>";

				// Error message in case of no results available for the details entered



				if (number_results === 0 ) { 
					$('#race-data-container').append("<p> No results, please try again!</p>");
				} else { 
					$('#race-data-container').append(raceList);
				}
				
				console.log("After Appending HTML");
				

			}
		});


}

$("#searchbutton").click(NewRequest());



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