$(document).ready(function(){ 
// making sure the document is fully loaded especially regarding the form

	var urlbase ='https://cors-anywhere.herokuapp.com/http://api.amp.active.com/v2/search?query=running&category=event';

	// url has been modified to fix a CORS Error :
	// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
	// https://cors-anywhere.herokuapp.com/

	var urlcomplete = "";

	var number_results = 0;
	// creating the key numbers to be displayed above the race list
	var raceListNumbers ="<p>Number of results : ";
	var raceList = "<p><ul>";
	// Using AJAX method instead of getJSON to have a bit more control 
	// https://www.youtube.com/watch?v=j-S5MBs4y0Q


	function NewRequest(urlapi, resultsperpage, pagenumber)
	{

		// alert(document.getElementById('resultPerPage').value);



		// doc https://api.jquery.com/jquery.ajax/

		$.ajax (
		{
			url: urlapi,
			dataType: 'json',
			type: 'get',
			cache: false,

			// 1 type of error handling courtesy of https://jsfiddle.net/Sk8erPeter/AGpP5/

			error: function(jqXHR, textStatus, errorThrown) 
			{
	            $('#race-data-container').append('<p><span>API Error, please contact the dev Raph Zenou and quote these details:<br>Status code: '+jqXHR.status+' | ' + errorThrown + ' | '+ jqXHR.responseText + '</span></p>');
	        },

			success : function(data) 
			{
				console.log('4 - starting the API parsing');
				// extraction of number of results from the API response
				number_results = data.total_results;
				// number of pages computed based on the above and the 'resultsperpage' var
				numberofpages = Math.ceil(number_results / resultsperpage);
				// appending the key numbers with our new results (number of pages and resultsperpage)
				raceListNumbers += number_results + " | Results per page : " + resultsperpage+  " | Number of pages : " + numberofpages +"</p><br>";
				
				// Looping through the JSON data in order to create a html string containing the list of races
				$(data.results).each(function(index, value)

				{
					raceList += "<li> "+ value.salesStartDate.slice(0,10)
					+ " - " + value.assetName + "</li>";	
				});


				// closing the html unordered list
				raceList += "</ul>";

				// 2nd type of error handling in case of no results available for the details entered in case of a succesful API call

				if (number_results === 0 ) { 
					$('#race-data-container').html("<p> No results, please try again!</p>");
				} else { 

				// Append all the info collected and formatted to the html document

					$('#race-data-container').html(raceListNumbers);
					$('#race-data-container').append(raceList);
					$('#race-data-container').append("<p> Page " + pagenumber + " out of " + numberofpages + "</p>");
					
					// $('#race-data-container').append(`"<form><br><input type="text" id="resultPerPage" value="25">
				 //  <button class="btn" id="searchbutton">Go</button></form>`);
					console.log('5 - API Parsing and results populating done');
				}

			}
		});

	}

// clicking on the Search button
	$("#searchbutton").click( function(e)
	{

		e.preventDefault(); 
		// to avoid page refresh on click
		// courtesy of https://stackoverflow.com/questions/33465557/how-to-stop-page-reload-on-button-click-jquery

		console.log('1- Button clicked, now building URL');
		// clearing the results
		raceList = "<p><ul>"; 
		raceListNumbers ="<p>Number of results : ";
		number_results = 0;
		$('#race-data-container').html('<span> Loading... </span>');


		var pagenumber = 1;
		var urlpage = '&current_page='+pagenumber;
		var resultsperpage = $('#resultPerPage').val();
		//var resultsperpage = 25;
		var urlresultperpage = '&per_page='+resultsperpage;
		var numberofpages = 0;

		var urlstartdate = '&start_date=2018-01-01..';
		var urlenddate = '2019-06-30';
		var urlorder = '&sort=date_asc'; // could be 'date_desc' or 'distance'
		// var city = $('#inputCity').val();
		var city = 'london';
		var urlplace = '&near=' + city+ ',GB'; // location (city, country)
		var urlradius = '&radius=50'; // in miles
		var apikey = '&api_key=y3ptgtcc32fd8dcakhcck2c8';

		// buildingn the final url
		var urlcomplete = urlbase + urlpage + urlresultperpage + urlstartdate + urlenddate + urlorder + urlplace + urlradius + apikey;

		console.log('2.1 - Results per page input:'+ resultsperpage);


		console.log('2.2 - URL in use after button click:');

		console.log(urlcomplete);

		console.log('3 - now lets launch the API request');

		NewRequest(urlcomplete, resultsperpage, pagenumber );

		return false;


	});

});

// main function called when the button is clicked


// http://api.amp.active.com/v2/search?query=running&category=event&start_date=2013-07-04..&near=San%20Diego,CA,US&radius=50&api_key=y3ptgtcc32fd8dcakhcck2c8
// API key: y3ptgtcc32fd8dcakhcck2c8

// API documentation : 
// http://developer.active.com/docs/read/v2_Activity_API_Search
// http://developer.active.com/docs/v2_activity_api_search#ranges

// Other ideas :
// https://www.w3schools.com/howto/howto_js_autocomplete.asp

