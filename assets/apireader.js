$(document).ready(function(){ 
// making sure the document is fully loaded especially regarding the form

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INITIALISING VARIABLES + KEY LINKS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	$('#footerpostsearch').hide();

	var gotopage =	1;
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
		var urlbase ='http://api.amp.active.com/v2/search?category=event&topic=running'; //  scope is running only in this project
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
	

		number_results = 0;

		$('#footerbeforesearch').show();
		$('#footerpostsearch').hide();


		$('#resultscount').html('<div class="col" id="resultscount"></div>');
		$('#searchbar').html('<div class="col" id="searchbar"></div>');
		$('#race-data-container').html(`<div class="container-fluid" id="loader"><img src="assets/loader.gif"></div>`);
		// loader GIF makes the loading time much more tolerable in case of a slow response (asynchronicity and callbacks/promises).
	}




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ API REQUEST FUNCTION (MAIN FUNCTION) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


	// Using AJAX method instead of getJSON to have a bit more control 
	// https://www.youtube.com/watch?v=j-S5MBs4y0Q

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
				
				// inspired by https://stackoverflow.com/questions/5825465/why-is-jqxhr-responsetext-returning-a-string-instead-of-a-json-object
				// and also https://stackoverflow.com/questions/16576983/replace-multiple-characters-in-one-replace-call
				// this is all to get a nice an clean error message which does not mess with the css as withtout this jqXHR.responseText is return as a h1 tag

	            $('#race-data-container').html('<p id="message">Error, please select other details an try again but if it persists please contact the dev <a href="mailto:ultraphael@gmail.com">Raph Zenou</a> and quote these technical details:<br>Status code: '+ jqXHR.status +' | ' + errorThrown + '</p>');

	            // for more details on the error messages we can use :
	            // var errormessage = jqXHR.responseText.replace('<h1>','').replace('</h1>','');
	            // I decided to remove it at it was too technical for the average user

	        },

			success : function(data) 
			{
				console.log('API Call successful, starting the parsing and html building...');
				console.table(data);

	// ••••••••••• BUILDING THE PAGE NAVIGATION •••••••••••


				// extraction of number of results from the API response
				var number_results = data.total_results;
				// number of pages computed based on the above and the 'resultsperpage' var
				var numberofpages = Math.ceil(number_results / resultsperpage);
				// appending the key numbers and page navigation with our new results (number of pages and resultsperpage)
			
				// creating the dropdown navigation menu
				var raceListNumbers = `Number of results : ` + number_results + ` | Page <select id="pagenumberinput">`;
				
				for (let i=1; i<=numberofpages;i++)
				{
					if (i==pagenumber) 
					{ 
					// select the current page in the dropdown for a better UX
					 raceListNumbers += `<option selected='selected' value='`+i+`'>`+i+`</option>`;

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
					
					// Making sure we are displaying an active event 

					if (value.assetStatus.assetStatusName=="VISIBLE") {

						// First let's sort the date out (it is given D-1 by the API)
					
						var date = new Date(value.activityStartDate.slice(0,10));
						date.setDate(date.getDate()+1);
						date = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();

						// Second let's find a working link (loads are given empty by the API.)
						var url="";

						if (value.urlAdr!=="") {
							url = value.urlAdr;
						 } else if (value.registrantSearchUrlAdr!=="") {
						 	url = value.registrantSearchUrlAdr;
						 } else if (value.homePageUrlAdr!=="") {
						 	url = value.homePageUrlAdr;
						 } else {
						 	// fall back in case of not a single link is provided 
						 	url = `http://www.google.com/search?q=` + value.assetName
						 }
							
							
						// now let's build the list ! 

						raceList += `<div class="row event-box"><div class="col"><img class="event-img" src="`+value.logoUrlAdr
						+`" onError="this.onerror=null;this.src='https://image.freepik.com/free-icon/running-man_318-1564.jpg';"/>`
						+ date + `</div><div class="col">`
						// Error handling for race logos not provided by the API 
						
						+ value.assetName
						+ `by/for ` + value.organization.organizationName
						// + ` - <a href="` + value.registrantSearchUrlAdr + `" target="_blank">Register</a>`
						+ `</div><div class="col"> - <a href="` + url + `" target="_blank">More Info</a></div>`
			



						// if(value.registrantSearchUrlAdr !==null) 
						// {
						// + ` - <a href="` + value.registrantSearchUrlAdr + `" target="_blank">Register</a>`
						// }

						// if(value.homePageUrlAdr !==null) 
						// {
						// + ` - <a href="` + value.homePageUrlAdr  + `" target="_blank">More Info</a>`
						// }
						
						+ ` - <a href="https://www.google.co.uk/maps/search/` +  value.place.postalCode+ `" target="_blank">Map</a>` 
						+`</div>`;	
					}

				});

				// closing the race list div
				raceList += '</div>';



// ••••••••••• APPENDING THE HTML TO ADD RESULTS AND NAVIGATION •••••••••••


				// 2nd type of error handling in case of no results available for the details entered in case of a succesful API call

				if (number_results === 0 ) { 
					$('#race-data-container').html(`<p id="message"> Oops!There were no results with these filters, please try again! <br><br>Have you made sure the City is in the UK or dates are in the right order for instance ? </p>`);
				
				} else { 

				// Append all the info collected and formatted to the html document
					
					$('#race-data-container').html(raceList);
					$('#navigation').html(raceListNumbers);
					$('#footerbeforesearch').hide();
					$('#footerpostsearch').show();
					// these two footers above come from the fact that when I added html to the main container the basic footer was not moving down properly
					// this is probably not the best fix but it works and provides a good UX 


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
		console.log('...Clearing values (not parameters');

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
	$("#navigation").on('change','#pagenumberinput', function(e){
		// e.preventDefault(); 

		// same comments as for the Search button

		var gotopage_click = $('#pagenumberinput').val();
		console.log('Going to page :');
		console.log(gotopage_click);
		Request(gotopage_click);
		// return false;
	});



});// closing $(document).ready(function(){ 





