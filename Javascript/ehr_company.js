var company_data;

//IMPORTANT!!
//Add the companies who have custom pages to this array
//TEMP!!
var companiesWithCustomPages = [47,50,100];

$(document).ready(function() {
	consumeAPI();
} );

// Pulls the data from the DB and calls the start functions
function consumeAPI() {
	//Get table data from the API
	$.getJSON("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/company?order=sort_by_nbr&app_name=ehrSelect", callback);
	function callback(json) {
		company_data = json;
		companyButtons();
		if (window.location.hash.substring(1) > 40) {
			setActiveCompany(window.location.hash.substring(1));
		} else {
			setActiveCompany(47);
		}
	}
	return;
}

// Builds the company pills in the side bar.
function companyButtons() {
	var sideBar = '';
	for (var i = 0; i < company_data.record.length; i++) {
		var id = company_data.record[i].id;
		sideBar += '<li class="" id="' + id + '" onClick="setActiveCompany(this.id)"><a href="#' + id + '">' + company_data.record[i].company_name + '</a></li>';
		//Add extra company that is not in the Database, after planet DDS so its up by the sponsors
		if (id == "50"){
			sideBar += '<li class="" id="100" onClick="setActiveCompany(this.id)"><a href="#100">Brightsquid</a></li>';
		}
	}
	document.getElementById("companyPills").innerHTML = sideBar;
}

// Populates the page with company info
function displayCompany(company_id) {
	index = companyIndex(company_id);
	mainPage = '';
	// Company Name
	mainPage += '<h3 class="coName">' + company_data.record[index].company_name + '</h3>';
	// Company logo and short bio
	mainPage += '<div class="meetBlurb"><p><img src="Images/CompanyLogos/' + company_data.record[index].id + '.png" width="250" height="100" alt=""/>' + company_data.record[index].background + '</p></div>';
	// Company contact info
	mainPage += '<div class="contactInfo">'
                	+ company_data.record[index].company_name + '<br>'
            		+ company_data.record[index].address + '<br>'
            		+ company_data.record[index].city + ', ' + company_data.record[index].state + ' ' + company_data.record[index].zip + '<br>'
            		+ 'Phone: ' + company_data.record[index].phone + '<br>'
            		+ 'Website: <a href="' + company_data.record[index].web_address + '" target="_blank">' + company_data.record[index].company_name + '</a><br>';

    // Add special link if needed
	if (company_data.record[index].special_link != undefined && company_data.record[index].special_link != ""){
		mainPage += 'Special Link: <a href="' + company_data.record[index].special_link + '" target="_blank"> Click Here</a></div>';
	}
    //Connect the new HTML to the page
	document.getElementById("mainCompanyContent").innerHTML = mainPage;
}

// Sets the given company to active and calls displayCompany too
function setActiveCompany(company_id) {
	if (document.getElementById(company_id).className == ""){
		document.getElementById(company_id).className = "active";
		//Check if the company has a custom page
		if (companiesWithCustomPages.indexOf(parseInt(company_id)) !== -1) {
			$( "#mainCompanyContent" ).load( 'CompanyCustomPages/'+ company_id +'.html' );
		} else {
			displayCompany(company_id);
		}
		//Set all othe other companies to not active
		for (var i = 0; i < company_data.record.length; i++) {
			var temp_id = company_data.record[i].id;
			if (temp_id !== parseInt(company_id)){
				document.getElementById(temp_id).className = "";
			};
		};

		if (company_id !== '100'){
			document.getElementById('100').className = "";
		}
	} 
}

// Returns the company index in the json from the API
function companyIndex(company_id) {
	for (var i = 0; i < company_data.record.length; i++) {
		if (company_data.record[i].id == company_id){
			return i;
		};
	};
}
