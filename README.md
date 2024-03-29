# UK RaceFinder

The "UK RaceFinder" website is a user friendly tool that enables runners of all abilities to look for their next challenge in the UK.

It is built upon the ACTIVE.com API that is a reference in the fitness world for event registrations.

 
## UX
 
The user form has been designed mainly using the JQuery UI technology as after some research it seemed to be the best and most efficient way to implement user friendly suggestions and therefore ensure a smooth experience with as little as possible manual inputs from users. This also limits the risk of erroneous requests as these suggestions nudge the user in limiting their requests within the application scope. However I have decided to not prevent users from inputting "out of scope" or erroneous criteria as error messages manage these very well and this would complicate the code.

AJAX technology enables users to make new requests or simply navigate between pages (which technically are new requests too) without refreshing the page. During the time between the API call and results or error message display a loading wheel (GIF) is used to reassure the user that the request is being processed. 
 

## Features

The main and only feature of this project is an running race search function based on the ACTIVE.com API.

It allows the user to enter key details such as dates, place (UK cities with an autocomplete feature), distance from the city in order to see whether an event could be found matching these criteria.

Then the results are displayed nicely and allow the user to have a glance at their details but also to click on the events page's link if further details are needed.

When user input is wrong, no result is available for the criteria entered or if the API response is not working properly the script will provide the user with relevant error messages.

As described in the Testing section most errors I could think of should be covered by this error handling process.


## Technologies Used

In this section, you should mention all of the languages, frameworks, libraries, and any other tools that you have used to construct this project. For each, provide its name, a link to its official site and a short sentence of why it was used.


- [Javascript](https://jquery.com)
    - The project uses **JavaScript ES6** that among others allow the use of template literal syntax.
- [JQuery](https://jquery.com)
    - The project uses **JQuery** to simplify DOM manipulation and AJAX requests to the API.
- [JQuery UI](https://jqueryui.com)
	- The project uses **JQuery** to provide a great UX and facilitate the input with little hassle.
- [Bootstrap]()
	- The project uses **Bootstrap** to enable responsive design.


## Testing

- API Data Quality : 
	It is important to focus here on the code and UX as unfortunately the quality of the API output is sometimes pretty bad and inconsistent.
	For example some races will have a active.com register link available, some others won't so in that case I used other available links such as the organisers website to not leave users with dead urls.
	
	Worth noting that the race descriptions are also really inconsistent: some are short names but others can include a date and other information.

	Eventually race logos are not always provided and I chose to display a generic logo in that case (see point below)

- Manual Testing:

	Manual testing has been carried out by myself with as many combinations as possible in terms of user input (dates, cities, distances from cities, sorting etc.). 

	This has allowed me to detect the obvious bugs or poor user experiences and correct them.

	I have also asked friends and family to try the app and the main feddback I got was to ensure the error messages were not too technical for the average user. I amended them accordingly.

- Only error message in the console: "hotrace.gif:1 GET http://www.active.com/images/events/hotrace.gif 502 (Bad Gateway)"
	It appears for results (races) that have no logo provided (logoUrlAdr: "http://www.active.com/images/events/hotrace.gif")
	This error is not fixable by myself (only the API owner) and does not prevent the app from functioning well as the error is managed and the logo replaced by a default.


- User scenarios:

			 1. Using all default values:
			    1. Simply click on the Search button without amending any filters
			    2. Error messages is likely to be displayed as the default values are really restrictive notably in terms of dates
			    3. Try again after enlarging the date range or distance from city as suggested by the error message
			    4. Results are finally displayed

			 2. Not using the cities suggested by the autocomplete function and entering a wrong city name:
			    1. If the city does not exist at all the error messages will be a technical API error message '400 - Bad Request'
			    2. If the city exists but is not located in the UK the error message will suggest to use other details

			 3. Overriding the date pickers and entering dates manually:
			    1. If the dates is in the right format and order it works
			    2. If the date is in the wrong format an technical API error message will be displayed suggesting to contact me

			 4. Using all types of "secondary" inputs such as the number of results per page or the sorting:
			 	No specific issues generated by these secondary inputs.

			 5. Testing all links, this resulted in a big piece of workaround to make sure to provide at least a link as the API was inconsistent in 	the data it provided.

			 6. Tried all possible combinations of queries I could think of. 

- Code Quality:

	Code has been run on https://jshint.com but this website does not seem to be able to handle JQuery, however interesting to highlight that this made me realise that the template literal syntax would be incompatible with older versions than ES6.

	The script has also been commented as much and clearly as possible to enable other developers to understand it easily.


- Automated Testing:

	I am yet to find a way of testing the app as it uses JQuery. Will hopefully sort that out in the future.


- Screen sizes : 
	
	Various screen sizes have been tested thanks to the built in Google Chrome developer tools but also by using my own mobile (Samsung S8). Thanks to the use of Bootstrap it is all looking OK on computer, mobile or tablet with various resolutions.



## Deployment

Deployment has been carried out thanks to GitHub Pages using the master branch and the index.html as required by this platform.
The deployement process is extremely straightforward thanks to this technology.

Code is run and test locally simply using Google Chrome and its built in console / developer tools.


## Credits

- AJAX Method used instead of getJSON to have a bit more control : https://www.youtube.com/watch?v=j-S5MBs4y0Q
- AJAX request error handling : https://jsfiddle.net/Sk8erPeter/AGpP5/
- CORS Error fix when calling the API : https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
- Date picker input :  https://jqueryui.com/datepicker/
- Autocomplete form for Cities : https://jqueryui.com/autocomplete/#default
- Avoiding page refresh on buttons click : https://stackoverflow.com/questions/33465557/how-to-stop-page-reload-on-button-click-jquery
- Action on page number selector navigation dropdown menu change : https://stackoverflow.com/questions/15420558/jquery-click-event-not-working-after-append-method

### Content

Race Data comes from the ACTIVE.com API : 

API documentation : 
http://developer.active.com/docs/read/v2_Activity_API_Search
http://developer.active.com/docs/v2_activity_api_search#ranges

API key was provided by ACTIVE.com after signing up on http://developer.active.com/apis . 


### Media

The photos used in this site were obtained from :
	- pexels.com (runners in the Jumbotron)
	- loading.io for the loader GIF
	- freepik.com for the default race logo when not provided by the API (the running person logo)


### Acknowledgements

- I received inspiration for this project from Hayley Schaefer weather related API project (example projects provided in the course).
