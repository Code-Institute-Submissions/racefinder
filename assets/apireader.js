$(document).ready(function(){ 
// making sure the document is fully loaded especially regarding the form

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INITIALISING VARIABLES + KEY LINKS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	
	var gotopage =	1;
	// defaulted to page one for search results

	// http://api.amp.active.com/v2/search?query=running&category=event&start_date=2013-07-04..&near=San%20Diego,CA,US&radius=50&api_key=y3ptgtcc32fd8dcakhcck2c8
	// API key: y3ptgtcc32fd8dcakhcck2c8

	// API documentation : 
	// http://developer.active.com/docs/read/v2_Activity_API_Search
	// http://developer.active.com/docs/v2_activity_api_search#ranges


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ API URL BUILDER FUNCTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	function URLbuilder(page) {

		console.log('URL builder function called');


	// ••••••••••• BASE URL AND API •••••••••••


		// url has been modified to fix a CORS Error (see below var corsfix)
		// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
		var corsfix = 'https://cors-anywhere.herokuapp.com/' // quick fix provided by this website
		var urlbase ='http://api.amp.active.com/v2/search?query=running&category=event'; //scope is running only in this project
		// API key provided by ACTIVE.com after signing up on http://developer.active.com/apis
		var apikey = '&api_key=y3ptgtcc32fd8dcakhcck2c8';


	// ••••••••••• PAGES PARAMETERS •••••••••••

		var pagenumber = page; //function sole parameter stored in the following variable
		var urlpage = '&current_page='+pagenumber;
		var resultsperpage = $('#resultperpage').val(); //input by user
		var urlresultperpage = '&per_page='+resultsperpage;


	// ••••••••••• OTHER USER FILTERS •••••••••••


		var urlstartdate = '&start_date='+$('#startdate').val()+'..'; 
		var urlenddate = $('#enddate').val();

		var urlorder = $('#sortby').val(); // could be 'date_asc', date_desc' or 'distance'
		var city = $('#inputcity').val().toLowerCase(); //city input by user, default is London
		var urlplace = '&near=' + city+ ',GB'; // GB hardcoded as we only want UK races in this project
		var urlradius = '&radius='+$('#radius').val(); // radius from city in miles


	// ••••••••••• URL ASSEMBLING •••••••••••

		var urlcomplete = corsfix + urlbase + urlpage + urlresultperpage + urlstartdate + urlenddate + urlorder + urlplace + urlradius + apikey;
		return [urlcomplete, resultsperpage, pagenumber]; // array type of return
	}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INITIALISE FUNCTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	// Function to refresh the data to zero when a new request is submitted or when the page is cleared
	function Initialise() {
		// var raceList = "<div id=event-list>"; 
		// var raceListNumbers ="";

		number_results = 0;

		$('#resultscount').html('<div class="col" id="resultscount"></div>');
		$('#searchbar').html('<div class="col" id="searchbar"></div>');
		$('#race-data-container').html(`<div class="container-fluid" id="loader"><img src="assets/loader.gif"></div>`);
	}

	// Using AJAX method instead of getJSON to have a bit more control 
	// https://www.youtube.com/watch?v=j-S5MBs4y0Q


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ API REQUEST FUNCTION (MAIN FUNCTION) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	function NewRequest(urlapi, resultsperpage, pagenumber){

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
				var errormessage = jqXHR.responseText.replace('<h1>','').replace('</h1>','');
				// inspired by https://stackoverflow.com/questions/5825465/why-is-jqxhr-responsetext-returning-a-string-instead-of-a-json-object
				// and also https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
				// this is all to get a nice an clean error message which does not mess with the css as withtout this jqXHR.responseText is return as a h1 tag

	            $('#race-data-container').html('<p id="message">Error, please contact the dev <a href="mailto:ultraphael@gmail.com">Raph Zenou</a> and quote these technical details:<br>Status code: '+ jqXHR.status +' | ' + errorThrown + ' | '+ errormessage + '</p>');

	        },

			success : function(data) 
			{
				console.log('API Call successful, starting the parsing and html building...');

	// ••••••••••• BUILDING THE PAGE NAVIGATION •••••••••••


				// extraction of number of results from the API response
				var number_results = data.total_results;
				// number of pages computed based on the above and the 'resultsperpage' var
				var numberofpages = Math.ceil(number_results / resultsperpage);
				// appending the key numbers and page navigation with our new results (number of pages and resultsperpage)
				var raceListResults = `<div>Number of results : ` + number_results +`</div>`;
				var raceListNumbers = `Page <select id="pagenumberinput">`;
				// creating the dropdown menu
				for (let i=1; i<=numberofpages;i++)
				{
					if (i==pagenumber) 
					{ 
					// select the current page in the dropdown for a better UX
					 raceListNumbers += `<option selected='selected' value='`+i+`'>`+i+`</option>`;
					 console.log('selected page in dropdown is:');
					 console.log(i);

					} else {
					// otherwise just add the pages in standard options 
					raceListNumbers += `<option value='`+i+`'>`+i+`</option>`;

					}
				}

			
				raceListNumbers += `</select>  out of ` + numberofpages + ` | <a href="#jumbotron" id="upbutton">Back to Top<a/></div>`;




	// ••••••••••• BUILDING THE RACES LIST /  RESULTS •••••••••••
				
				var raceList = '<div id="racelist">'; 

				// Looping through the JSON data in order to create a html string containing the list of races
				$(data.results).each(function(index, value){
					// sometimes the API data returns null on the date so this is to avoid getting an error 
					if(value.salesStartDate==null) 
					{
						date = 'TBD';
					} else {
						date = value.salesStartDate.slice(0,10);
					}

					raceList += `<div class="event-box"><img class="event-img" src="`+value.logoUrlAdr
					+`" onError="this.onerror=null;this.src='https://image.freepik.com/free-icon/running-man_318-1564.jpg';"/>`
					// Error handling for race logos not provided by the API 
					
					+ value.assetName
					+ ` by ` + value.organization.organizationName
					+ ` on ` + date 
					// + ` - <a href="` + value.registrantSearchUrlAdr + `" target=_"blank">Register</a>` 
					// + ` - <a href="` + value.homePageUrlAdr  + `" target=_"blank">More Info</a>` 
					// + value.assetDescriptions[0].description 

					+ `URL ` + value.homePageUrlAdr 
					+`</div>`;	
	

				});

				// closing the html unordered list
				raceList += '</div>';



// ••••••••••• APPENDING THE HTML TO ADD RESULTS AND NAVIGATION •••••••••••


				// 2nd type of error handling in case of no results available for the details entered in case of a succesful API call

				if (number_results === 0 ) { 
					$('#race-data-container').html(`<p id="message"> Oops!There were no results with these filters, please try again! <br><br>Have you made sure the City is in the UK or dates are in the right order for instance ? </p>`);
				
				} else { 

				// Append all the info collected and formatted to the html document
					$('#resultscount').html(raceListResults);
					$('#race-data-container').html(raceList);
					$('#searchbar').html(raceListNumbers);



				}
			console.log('API Parsing and results populating done');


			}
		});
	}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ REQUEST FUNCTION CALLING THE ONES ABOVE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	function Request(gotopage) {
		Initialise();

		var parameters = URLbuilder(gotopage);
		// fetching data from the URLbuilder function that uses the user input using page 1 as the default page and unique parameter
        //other parameters are taken from the user's input

		NewRequest(parameters[0], parameters[1], parameters[2]);
		// sending the request with the correct data coming from the URLBuilder 'return' which is an array of 3 elements 
		// that we called stored in the 'parameters' variable
	}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ BUTTONS / NAVIGATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ••••••••••• SEARCH BUTTON •••••••••••

	$("#searchbutton").click( function(e){

		e.preventDefault(); 
		// to avoid page refresh on click
		// courtesy of https://stackoverflow.com/questions/33465557/how-to-stop-page-reload-on-button-click-jquery
		Request(1);
		return false;
	});

// ••••••••••• CLEAR BUTTON •••••••••••

	$("#clearbutton").click(function(e){

		e.preventDefault(); 
		// to avoid page refresh on click
		// courtesy of https://stackoverflow.com/questions/33465557/how-to-stop-page-reload-on-button-click-jquery
		console.log('...Clearing');

		$("#startdate").val(new Date().toDateInputValue());
  		$("#enddate").val(new Date().toDateInputValue());
  		$("#inputcity").val("London")

		Initialise();
		//Initialising
		gotopage =1;

		$('#race-data-container').html(`<p id="message">Please adjust your filters above and hit Search again!</p>`);
		//Giving user suggestions


		return false;
	});


// ••••••••••• PAGE NAVIGATION DROPDOWN MENU •••••••••••

// clicking on page number selector
// helped by this article on SOF : https://stackoverflow.com/questions/15420558/jquery-click-event-not-working-after-append-method
	$("#searchbar").on('change','#pagenumberinput', function(e){
		// e.preventDefault(); 

		// same comments as for the Search button

		var gotopage_click = $('#pagenumberinput').val();
		console.log('Going to page :');
		console.log(gotopage_click);
		Request(gotopage_click);
		// return false;
	});



});// closing $(document).ready(function(){ 





