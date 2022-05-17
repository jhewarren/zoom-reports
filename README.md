# zoom-reports
Update a google sheet with information from zoom about attendees for meetings

To use this you will need to know the meeting ID in question
and setup your own zoom developer account 
and setup a JWT app - copying the TOKEN into the include.gs file
(mostly documented here https://devforum.zoom.us/t/how-to-create-jwt-token-for-client/43936)

You will also need to populate a google sheet with the content below

### content for google sheets follows;
APIkey				email		
APIsecret				meeting		
APIToken				PageSize		300		
								
page_count:	page_size:	total_records:	next_page_token:					
1,	300,	55,	,					
								
#	Name	email	uId	id	Date	Joined	Left	mins
