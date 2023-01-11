/**********************************************************************************

@Description	: This nodeJS script uses serpAPI to search Google for a string 
				and grabbs emails associated with the results.Originally meant for
				Shopify sites though can be modified to get any site.
@Creator		: DarkZeus2002
@Date			: 2022.08.15
@Last Modified	: 2022.08.17
@Revision		: rev7

**********************************************************************************/

/***************************Best Search Tems**************************************
@ https://www.youtube.com/watch?time_continue=148&v=tdBEt2Kys_0&feature=emb_logo&ab_channel=OnHOW
@ intext:"powered by shopify" intext:"category";
@ site:myshopify.com intext:"category";
@ 
**********************************************************************************/

/*Importing required libs*/
const axios = require('axios');
const fs = require('fs');
const us_states = require ('./us_states');
/*VARIABLES*/

state='Connecticut';


/*Data output file related vars*/
const content = 'pos,Url,Email\n'
const output='data/08.Insurance ('+state+').csv';

/*Auth details - serpapi*/
api_key ='<SERP API KEY>';//serpapi

e_prov_arr=["gmail.com","yahoo.com","hotmail.com","outlook.com","aol.com","icloud.com","protonmail.com","gmx.com"];
//e_prov_arr=[]

fs.writeFile(output, content, err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
})
/*Search details*/
/*
async function get_r(){
for(x=0;x<us_states.length;x++){
	var email='';
	var fnd=0;
	var site_html='';
	var email1='';
	var fb='';
	var yt='';
	var insta='';
	var pint='';
	var twt='';
	pos_emails=[];
	may_emails=[];
	emails=[];
	fs.appendFile(output, us_states[x].name + '\n', function (err) {
		if (err) throw err;
			console.log('Saved!');
	});	
	await httpGet(us_states[x].name,''); 
}}
get_r();
*/

async function get_e(){
for(x=0;x<e_prov_arr.length;x++){
	var email='';
	var fnd=0;
	var site_html='';
	var email1='';
	var fb='';
	var yt='';
	var insta='';
	var pint='';
	var twt='';
	pos_emails=[];
	may_emails=[];
	emails=[];
/*	fs.appendFile(output, us_states[x].name + '\n', function (err) {
		if (err) throw err;
			console.log('Saved!');
	});	*/
	await httpGet(state,e_prov_arr[x]); 
}}
results = 100; // total results needed per page result count (max 100)
start=1; //
total=400; // total results needed (max ~400)
get_e();

/*Alternative pages to look for email (put MOST PROBABLE first to contain the email to reduce time)*/
//contact_pages=["pages/contact-us","pages/contact","pages/about-us","pages/contact-old","pages/aboutus"];

/*Essensial Vard (!DO NOT CHANGE!)*/


//Adding the first line to data file - must comment if appending//


/*main API function*/
async function httpGet(state,e_prov){
	for(m=((start-1)/results);m<(total/results);m++){
		/*Readying the API call*/
		search = 'ceo or founder "insurance" '+ state +' contact email "@'+e_prov+'" site:linkedin.com'; //search string
		url = 'https://serpapi.com/search.json?engine=google&q='+search+'&num='+results+'&start='+(m*results+1)+'&api_key='+api_key; //URL of the fandom site

		full_url = url; //Building the API call
		console.log(full_url + "\n\n"); //Debugging line
		
		/*API call*/
		await axios
		  .get(full_url)
		  .then(async res => {
				//console.log(res.data.items);
				data=res.data.organic_results; // Isolating the normal results

				for(i=0;i<data.length;i++){
					site=data[i].link; // Getting the URLs of the sites
					site_text=data[i].snippet;
					may_emails=site_text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
					console.log(((m*results)+1+i)+ '. url : ' + site + 'emails :' + may_emails);
					may_emails=[...new Set(may_emails)];
					may_emails=may_emails.join('/');
					console.log (m + ' ' + results +' ' + i)
					emails[((m*results)+i)]=((m*results)+1+i)+ ',' + site + ',' + may_emails + '\n';
					if(!may_emails[i]){
						may_emails[i] = 'undefined';
					}
					
					/*
					if (may_emails[0]){	
						for(j=0;j<may_emails.length;j++){
							metol=may_emails[j].toLowerCase(); // may-emails-to-lowercase so can check for possible image files and such
							if((metol.indexOf(".png") === -1) && (metol.indexOf(".jpg") === -1) && (metol.indexOf(".jpeg")=== -1) && (metol.indexOf(".gif")=== -1) && (metol.indexOf(".webp")=== -1)){
								pos_emails.push(may_emails[j]);
							}
						}
						email=pos_emails.join('/'); // joining possible emails to a string
						fnd=1; // telling that absolute email is not found
						return email;
					}else{
						fnd=0; // telling that email is not found
						email="not found";
						return email;
					}
					console.log(email); // Debugging line
					/*Calling email grabber function*/
									console.log(data.length);
				}
				if(data.length<results){
					console.log(m);
					m=(total/results)+2;
					console.log("No more results were fond. \n Aborting...");
				}
				
			})
			.catch(error => {
				console.error(error); //Logging errors if there were any
			});
	}
	emails=[...new Set(emails)];
	emails=emails.join("");
	fs.appendFile(output, emails + '\n', function (err) {
		if (err) throw err;
			console.log('Saved!');
	});
	console.log(emails);
}

/*Email grabber function*/

//setInterval(httpGet,1000); //Test mode set to 1 second //calling the fetch function every 1h
//,contactanos,
