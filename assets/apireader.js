$(document).ready(function(){ 
// making sure the document is fully loaded especially regarding the form

	// Initiliasing variables
	var raceList = "<p><ul>"; 
	var raceListNumbers ="<p>Number of results : ";
	var number_results = 0;
	var resultsperpage  = 10;
	var city = 'london';
	var gotopage =	1;
	// defaulted to page one for search results

	$('#gobutton').hide();
	$('#pagenumberinput').hide();
	$('#upbutton').hide();

	// http://api.amp.active.com/v2/search?query=running&category=event&start_date=2013-07-04..&near=San%20Diego,CA,US&radius=50&api_key=y3ptgtcc32fd8dcakhcck2c8
	// API key: y3ptgtcc32fd8dcakhcck2c8

	// API documentation : 
	// http://developer.active.com/docs/read/v2_Activity_API_Search
	// http://developer.active.com/docs/v2_activity_api_search#ranges

	// Other ideas :
	// https://www.w3schools.com/howto/howto_js_autocomplete.asp


	function URLbuilder(page)
	{

		console.log('URL builder function called');
		// url has been modified to fix a CORS Error :
		// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
		// https://cors-anywhere.herokuapp.com/

		var urlcomplete = "";
		var urlbase ='https://cors-anywhere.herokuapp.com/http://api.amp.active.com/v2/search?query=running&category=event';
		var number_results = 0;

		var pagenumber = page;
		//defaulted to 1
		var urlpage = '&current_page='+pagenumber;
		resultsperpage = $('#resultperpage').val();
		// parseInto to make sure any string input could potentially be used

		var urlresultperpage = '&per_page='+resultsperpage;
		var numberofpages = 0;

		var urlstartdate = '&start_date='+$('#startdate').val()+'..';
		var urlenddate = $('#enddate').val();
		// var urlstartdate = '&start_date='+$('#startdate').val().slice(6,10)+'-'+$('#startdate').val().slice(0,2)+'-'+$('#startdate').val().slice(3,5)+'..';
		// var urlenddate = $('#enddate').val().slice(6,10)+'-'+$('#enddate').val().slice(0,2)+'-'+$('#enddate').val().slice(3,5);
		
		var urlorder = $('#sortby').val(); // could be 'date_desc' or 'distance'
		var city = $('#inputcity').val().toLowerCase();
		var urlplace = '&near=' + city+ ',GB'; // location (city, country)
		// var urlradius = '&radius=50'; // in miles
		var urlradius = '&radius='+$('#radius').val(); // in miles

		var apikey = '&api_key=y3ptgtcc32fd8dcakhcck2c8';

		urlcomplete = urlbase + urlpage + urlresultperpage + urlstartdate + urlenddate + urlorder + urlplace + urlradius + apikey;

		console.log('Results per page:');
		console.log(resultsperpage);
		console.log('Page number:');
		console.log(pagenumber);
		console.log('URL:');
		console.log(urlcomplete);
		console.log('Start:');
		console.log(urlstartdate);
		console.log('End:');
		console.log(urlenddate);



		return [urlcomplete, resultsperpage, pagenumber];
	}

// Function to refresh the data to zero when a new request is submitted or when the page is cleared
	function Initialise() 
	{
		raceList = "<div id=event-list>"; 
		raceListNumbers ="<p>Number of results : ";
		number_results = 0;
		$('#race-data-container').html(`<div class="container-fluid" id="loader"><img src="assets/loader.gif"></div>`);
	}

	// Using AJAX method instead of getJSON to have a bit more control 
	// https://www.youtube.com/watch?v=j-S5MBs4y0Q

	function DisplayPages(pagenumber, numberofpages)
	{

		if (numberofpages >0) {
			$('#race-data-container').append("<br><br><p> Page " + pagenumber + " out of " + numberofpages + "</p>");
			$('#gobutton').show();
			$('#pagenumberinput').show();
			}
		}
		
		// if (pagenumber === 1) {$('#race-data-container')
		// 	.append('<a id="linkpage" href="#">LINK</a>');

		// } else if (pagenumber == numberofpages)  { // not === because of the imperfect math.ceil result

		// $('#race-data-container').append("<p>" + pagenumber + " ..." + numberofpages + " Last</p>");

		// } else {

		// $('#race-data-container').append("<p> In between " + pagenumber + " and " + numberofpages + "</p>");
		// }



	function NewRequest(urlapi, resultsperpage, pagenumber)
	{

		// doc https://api.jquery.com/jquery.ajax/
		// standard ajax request

		$.ajax (
		{
			url: urlapi,
			dataType: 'json',
			type: 'get',
			cache: false,

			// 1 type of error handling courtesy of the official doc but also https://jsfiddle.net/Sk8erPeter/AGpP5/

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
					// sometimes the API data returns null on the date so this is to avoid getting an error 
					if(value.salesStartDate==null) 
					{
						date = 'TBD';
					} else {
						date = value.salesStartDate.slice(0,10);
					}

					// raceList += `<div class="event-box">`+ date + ` - ` + value.assetName + `</div>`;	
					raceList += `<div class="event-box"><img class="event-img" src="`+value.logoUrlAdr+`" onError="this.onerror=null;this.src='https://image.freepik.com/free-icon/running-man_318-1564.jpg';"/>`
					// Error handling for logos
					+ value.assetName
					+ ` by ` + value.organization.organizationName
					+ ` on ` + date 
					+ ` - <a href="` + value.registrantSearchUrlAdr + `" target=_"blank">Register</a>` 
					+ ` - <a href="` + value.homePageUrlAdr  + `" target=_"blank">More Info</a>` 
					// + value.assetDescriptions[0].description 

					+ `</div>`;	
	

				});


				// closing the html unordered list
				raceList += "</div>";

				// 2nd type of error handling in case of no results available for the details entered in case of a succesful API call

				if (number_results === 0 ) { 
					$('#race-data-container').html("<p> No results, please try again!</p>");
				} else { 

				// Append all the info collected and formatted to the html document

					$('#race-data-container').html(raceListNumbers);
					$('#race-data-container').append(raceList);

					if(resultsperpage >= 20) 
					{
						$('#upbutton').show();
					} else {
						$('#upbutton').hide();
					}
					console.log('5 - API Parsing and results populating done');
				}

			DisplayPages(pagenumber, numberofpages);

			}
		});
	}

	function Request(gotopage) 
	{
		Initialise();
		var parameters = URLbuilder(gotopage);
		// fetching data from the URLbuilder function that uses the user input using page 1 as the default page and unique parameter
        //other parameters are taken from the user's input
		NewRequest(parameters[0], parameters[1], parameters[2]);
		// sending the request with the correct data coming from the URLBuilder 'return' which is an array of 3 elements 
		// that we called stored in the 'parameters' variable
	}

// clicking on the Search button
	$("#searchbutton").click( function(e)
	{

		e.preventDefault(); 
		// to avoid page refresh on click
		// courtesy of https://stackoverflow.com/questions/33465557/how-to-stop-page-reload-on-button-click-jquery
		
			$('#gobutton').hide();
			$('#pagenumberinput').hide();
	
		Request(1);
		return false;
	});

// clicking on the Clear button
	$("#clearbutton").click(function(e)
	{

		e.preventDefault(); 
		// to avoid page refresh on click
		// courtesy of https://stackoverflow.com/questions/33465557/how-to-stop-page-reload-on-button-click-jquery
		console.log('...Clearing');

		Initialise();
		//Initialising
		gotopage =1;

		$('#race-data-container').html(`<span> Please enter details and hit "Search" </span>`);
		//Giving user suggestions


		$('#gobutton').hide();
		$('#pagenumberinput').hide();
		$('#upbutton').hide();
	

		return false;
	});

// clicking on the Go button
	$("#gobutton").click(function(e)
	{
		e.preventDefault(); 

		// same comments as for the Search button

		var gotopage_click = $('#pagenumberinput').val();
		console.log(gotopage_click);
		Request(gotopage_click);
		return false;
	});

});





