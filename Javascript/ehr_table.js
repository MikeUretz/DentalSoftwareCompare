//Variables for Data storage
var table_data;
var company_data;
var table;
//Whitelist is used to filter the table, the main one is to be developed at load and used as reference for the actual whitelist
var white_list_main = [];
var white_list = [];
var company_blacklist = [];
var company_ids = [];
var numberOfCompanies = 0;
window.onresize = function(event) {
    table.fixedColumns().relayout();
    table.draw(false);
};

//Convert whitelist into binary representaion
function convertWhiteList(){
	var binaryRep = "";
	var hexRep = "";
	for (var i = 0; i < white_list_main.length; i++) {
		if (white_list.indexOf(white_list_main[i]) != -1){
			binaryRep += "1";
		} else {
			binaryRep += "0";
		}
		if (binaryRep.length == 4) {
			var temp = Bin2Hex(binaryRep);
			hexRep += temp;
			binaryRep = "";
		};
	};
	var temp = Bin2Hex(binaryRep);
	hexRep += temp;
	return hexRep;
}

//Convert hex number to binary representaion of feature whitelist
function convertHexToBin(hexRep) {
	var binRep = "";
	for (var i = 0; i < hexRep.length; i++) {
		binRep += pad(Hex2Bin(hexRep.charAt(i)),4);
	};
	return binRep;
}

//Returns arugments for URL sharing of table construction
function buildURLArg() { 
	var hexRep = convertWhiteList();
	var arguments = "#" + hexRep;
	for (var i = 0; i < company_blacklist.length; i++) {
		arguments += "&";
		arguments += company_blacklist[i];
	};
	return arguments;
}

//If a URL arg exists, run search on those args
function checkForURLArg() {
	var URLArg = window.location.hash.substring(1);
	if (URLArg == "") {
		return;
	}
	var argArray = URLArg.split("&");
	var binRep = convertHexToBin(argArray[0]);
	var newWhite_list = [];
	for (var i = 0; i < white_list_main.length; i++) {
		if (binRep.charAt(i) == "1"){
			newWhite_list.push(white_list_main[i]);
		};
	}
	white_list = newWhite_list;
	for (var i = 1; i < argArray.length; i++) {
		//Change these values if the group size comparisons need changing
		if (argArray[i] == 's') {
			groupFilter(2, 10000);
		} else if (argArray[i] == 'm') {
			groupFilter(10, 10000);
		} else if (argArray[i] == 'l') {
			groupFilter(50, 10000);
		} else{
			removeCompany(argArray[i]);
		}
	};
	table.draw(false);
}

function fillShareModal() {
	var modalContent = "Copy and share this link to show your customized table! </br></br>";
	var url = "http://dentalsoftwarecompare.com/table.html" + buildURLArg();
	document.getElementById('shareModal').innerHTML = modalContent + url;
}

//Search function
$.fn.dataTable.ext.search.push(    
    function( settings, data, dataIndex ) {
    	//Split the ids from the table into cat id and feat id
        var value = data[0].split(",");
        //take the seccond id, which will be the feat id for features and cat id for categories
        var id = value[1];
        //calculate the offset for the extra feature selector based on known 200 offset
        var otherFeatID = (id - 200);
        //Get the child node of the main element
 		var children = document.getElementById(id).childNodes;
 		//Get the element for changing background color
 		var pillElement = document.getElementById('color'+ id);
 		//If the element is in the whitelist, then show it in the table and change the glyph icon to minus for remove, also changes background color of the selector
    	if (jQuery.inArray(parseInt(value[0]), white_list) !== -1 && jQuery.inArray(parseInt(value[1]), white_list) !== -1) {
    		children[0].className = "glyphicon glyphicon-minus-sign";
    		//Change background color
    		pillElement.style.background = '#3E5672';
    		//If the element is a feature, then also change the seccondary feature button and background color
    		if (id < 1000) {
    			var otherChildren = document.getElementById(otherFeatID).childNodes;
    			var otherPillElement = document.getElementById('color'+ otherFeatID);
    			otherPillElement.style.background = '#3E5672';
    			otherChildren[0].className = "glyphicon glyphicon-minus-sign";
    		}
    		return true;
    	} else {
    		children[0].className = "glyphicon glyphicon-plus-sign";
    		//Change background color
    		pillElement.style.background = '#7b97b7';
    		//If the element is a feature, then also change the seccondary feature button and background color
    		if (id < 1000) {
    			var otherChildren = document.getElementById(otherFeatID).childNodes;
    			var otherPillElement = document.getElementById('color'+ otherFeatID);
    			otherPillElement.style.background = '#7b97b7';
    			otherChildren[0].className = "glyphicon glyphicon-plus-sign";
    		}
    		return false;
    	}
    }
);

//Click functions for selector dropdowns
$(document).ready(function() {
	$("#searchCompany").click(function(){
        $(".searchPanelCompany").slideToggle("slow");
        //sets the arrow up or down on click
        var children = document.getElementById('mytest1').childNodes;
        if (children[0].className == "glyphicon glyphicon-triangle-bottom"){
        	children[0].className = "glyphicon glyphicon-triangle-top";
        } else{
        	children[0].className = "glyphicon glyphicon-triangle-bottom";
        }  
    });
	$("#searchCategory").click(function(){
		$(".searchPanelCategory").slideToggle("slow");
		//sets the arrow up or down on click
        var children = document.getElementById('mytest2').childNodes;
        if (children[0].className == "glyphicon glyphicon-triangle-bottom"){
        	children[0].className = "glyphicon glyphicon-triangle-top";
        } else{
        	children[0].className = "glyphicon glyphicon-triangle-bottom";
        }
	});
	$("#searchFeaturesOnly").click(function(){
  		$(".searchPanelFeaturesOnly").slideToggle("slow");
  		//sets the arrow up or down on click
        var children = document.getElementById('mytest3').childNodes;
        if (children[0].className == "glyphicon glyphicon-triangle-bottom"){
        	children[0].className = "glyphicon glyphicon-triangle-top";
        } else{
        	children[0].className = "glyphicon glyphicon-triangle-bottom";
        }
 	});
	consumeAPI();
} );

//Bypass the local storage for now until we decide on a timeout length
function consumeAPI(){
	noLocalConsumeAPI();
	// //If the browser supports local storage, use it
	// if(typeof(Storage) !== "undefined") {
	// 	//Check if the table is already downloaded
 //        if (localStorage.tableData && localStorage.companyData) {
 //        	var retrievedTable = localStorage.getItem('tableData');
 //        	var retrievedCompany = localStorage.getItem('companyData');
 //            table_data = JSON.parse(retrievedTable);
 //            company_data = JSON.parse(retrievedCompany)
 //            drawTable();
 //        } 
 //        //If it has not been downloaded, get it from the api and store it locally
 //        else {
 //        	LocalConsumeAPI();
 //        }
 //    }
 //    //If the browser does not support local storage, download it as normal.
 //    else {
 //    	noLocalConsumeAPI();
 //    }

	return;
}

function LocalConsumeAPI(){
	//Get table data from the API
	$.getJSON("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/ehr_table_data?app_name=ehrSelect", callback1);
	function callback1(json_table){
		$.getJSON("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/company?fields=company_name%2Cid&app_name=ehrSelect", callback2);
		function callback2(json_company) {
			//Store company data locally
			localStorage.setItem('companyData', JSON.stringify(json_company));
			//Store table data locally
			localStorage.setItem('tableData', JSON.stringify(json_table));
			//Set global company data
			company_data = json_company;
			//Set Global table data
			table_data = json_table;
			drawTable();
		}
	}
}

//Calls api for table and company data and stores them locally
function noLocalConsumeAPI(){
	//Get table data from the API
	$.getJSON("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/ehr_table_data?app_name=ehrSelect", callback1);
	function callback1(json_table){
		$.getJSON("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/company?fields=company_name%2Cid&app_name=ehrSelect", callback2);
		function callback2(json_company) {
			//Set global company data
			company_data = json_company;
			//Set Global table data
			table_data = json_table;
			drawTable();
		}
	}
}

//Calls api for table and company data to use just once
function drawTable() {
	//Call header function
	tableHeaders(table_data);
	//Call table body function
	tableBody(table_data);
	//Call company selector function
	companySelectors(table_data);
	//Calls category selector function
	categorySelectors(table_data);
	//Calls feature selector function
	featureSelectors(table_data);
	//hide loading symbol
	$('.loading').hide();
	//connect the table
	connectTable();
	//Set up table based on url args
	checkForURLArg();
	//Check if user needs to submit their name and email
	checkUserCookie();
}

//Develops the sidepanel area for companies
function companySelectors(table_data) {
	//Start string for hmtl
	var companyHTML = '';
	//Set starting point for company names
	var feat_id = table_data.record[0].feature_id;
	var i = 0;
	//Set the starting colum number for filtering
	var columnNumber = 2;
	//While there are unique companies left
	while (feat_id == table_data.record[i].feature_id){
		var company_clickID = columnNumber;
		var company_name = table_data.record[i].company_name;
		i++;
		//Check to see if the company has more than one product
		while (company_name == table_data.record[i].company_name){
			columnNumber++;
			company_clickID += "," + columnNumber;
			i++;
		}
		//Add the compnaies selector to companyHTML
		companyHTML += '<div class="companyContainer" id="color'+ company_clickID +'"><div class="companyOption" id="' + company_name + '">' + company_name + '</div><div class="selectCompany"><a onclick="addRemoveCompany(this)" id="' + company_clickID + '"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span></a></div></div>';
     	columnNumber++;	
     	company_ids.push(company_clickID);		
	}
	//Send the created html to the document
	document.getElementById("companyList").innerHTML = companyHTML;
}

//Develops the sidepanel area for the categories and features
function categorySelectors(table_data) {
	//Start string for hmtl
	var categoryHTML = '';
	var dataArrayLength = table_data.record.length;
	//Compare point to know when a new category is needed
	var currentCategoryID = table_data.record[0].category_id;
	var currentCategoryName = table_data.record[0].category_title;
	//Compare point to know when a new feature is needed
	var currentFeatureID = table_data.record[0].feature_id;
	var currentFeatureName = table_data.record[0].feature_name;
	for (var i = 0; i < dataArrayLength; i++) {
		//Adds HTML for category filter
		categoryHTML += selectorHTML(currentCategoryID, currentCategoryName, 0);
		while (currentCategoryID == table_data.record[i].category_id){
			//Adds html for each feature under the current category
			categoryHTML += selectorHTML(currentFeatureID, currentFeatureName, 1);
			//Skip over redundant features
			while (i < dataArrayLength && currentFeatureID == table_data.record[i].feature_id){
				i++
			}
			//prevents reading on index that does not exist after last category
			if (i >= dataArrayLength) {
				//Send the created html to the document
				document.getElementById("categoryList").innerHTML = categoryHTML;
				return;
			};
			//Reset current features for next loop of the first while
			currentFeatureID = table_data.record[i].feature_id;
			currentFeatureName = table_data.record[i].feature_name;
		}
		//Close HTML for current category
		categoryHTML += '</div></div>'
		//Reset current category info for next category
		currentCategoryID = table_data.record[i].category_id;
		currentCategoryName = table_data.record[i].category_title;
	};	
}

//Develops the sidepanel area for features only
function featureSelectors(table_data) {
	//Start string for hmtl
	var featureHTML = '';
	var dataArrayLength = table_data.record.length;
	//Compare point to know when a new feature is needed
	var currentFeatureID = table_data.record[0].feature_id;
	var currentFeatureName = table_data.record[0].feature_name;

	for (var i = 0; i < dataArrayLength; i++) {
		//Adds html for each feature
		featureHTML += selectorHTML(currentFeatureID, currentFeatureName, 2);
		//Skip over redundant features
		while (i < dataArrayLength && currentFeatureID == table_data.record[i].feature_id){
				i++
			}
		//prevents reading on index that does not exist after last category
		if (i >= dataArrayLength) {
			//Send the created html to the document
			document.getElementById("featureList").innerHTML = featureHTML;
			return;
		};
		//Reset current features for next loop of the first while
		currentFeatureID = table_data.record[i].feature_id;
		currentFeatureName = table_data.record[i].feature_name;
	}
}

//Returns formated HTML for category selectors based on type, 0 = category, 1 = feature, 2 = Feature only
function selectorHTML(id, name, type) {
	var tempHTML = '';
	if (type == 0) {
		tempHTML += '<div class="searchPanelCategory"><div class="categories"><div class="categoryContainer" id="panel' + id + '">';
		tempHTML += '<div class="findIt"><div class="findCategory"><a onclick="searchTable(this)" id="' + (id + 200) + '"><span class="glyphicon glyphicon-zoom-in"></span></a></div></div>';
		tempHTML += '<div class="selectIt" id="color'+ id +'"><div class="categoryOption" id="' + name + '">' + name + '</div><div class="categorySelect"><a onclick="addRemoveWhitelist(this)" id="' + id + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></a></div>';
		tempHTML += '<div class="featureDropDown"><a id="catDroppanel'+ id +'"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></a></div></div></div></div>';
		tempHTML += '<div class="clearIt"></div><div class="dropPanel" id="Droppanel' + id + '">'
	} else if (type == 1) {
		tempHTML += '<div class="featureContainer"><div class="findIt"><div class="findFeature"><a onclick="searchTable(this)" id="' + (id + 200) + '"><span class="glyphicon glyphicon-zoom-in"></span></a></div></div>';
		tempHTML += '<div class="selectIt" id="color'+ id +'"><div class="featureOption" id="' + name + '">' + name + '</div><div class="featureSelect"><a onclick="addRemoveWhitelist(this)" id="' + id + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></a></div></div></div>';
	} else {
		tempHTML += '<div class="featureOnlyContainer"><div class="findIt"><div class="findFeatureOnly"><a onclick="searchTable(this)" id="' + (id + 200) + '"><span class="glyphicon glyphicon-zoom-in"></span></a></div></div>';
		tempHTML += '<div class="selectIt" id="color'+ (id - 200) +'"><div class="featureOnlyOption" id="' + name + '">' + name + '</div><div class="featureOnlySelect"><a onclick="addRemoveWhitelist(this)" id="' + (id - 200) + '"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></a></div></div></div>';
	}
	return tempHTML;
}

//Develops the table header 
function tableHeaders(table_data) {
	//Start header level 1, includes feature
	var tHead = '<tr><th rowspan="2">Ids</th><th rowspan="2">Features</th>';
	//Set reference on feature id to limit the companies
	var first_feature_id = table_data.record[0].feature_id;
	var i = 0;
	//While there are more records with the same feature id, add company header column for each to level 1
	while (table_data.record[i].feature_id == first_feature_id) {
		var company_id;
		//determine company id for link to company page
		for (var j = 0; j < company_data.record.length; j++) {
			if (company_data.record[j].company_name == table_data.record[i].company_name) {
				company_id = company_data.record[j].id;
			}
		};
		tHead += '<th><a href="/company.html#' + company_id + '" target="_blank">' + table_data.record[i].company_name + '</a> <a type="button" class="btn btn-primary btn-sm" target="_blank" href="http://dentalsoftwarecompare.com/WordPress/index.php/test-form-page/">Get Quote</a></th>';
		i++;
		numberOfCompanies++;
	};
	//Reset index
	i = 0;
	//Start header level 2
	tHead += '</tr><tr>';
	//While there are more records with the same feature id, add product header column for each to level 2
	while (table_data.record[i].feature_id == first_feature_id) {
		tHead += '<th>' + table_data.record[i].product_name + '</th>';
		i++;
	};
	//Close last header column
	tHead += '</tr>';
	//Attach generated html to table header in index page
	document.getElementById("ehrTableHead").innerHTML = tHead;
	return;
}

//Develops the table body
function tableBody(table_data) {
	//tBody will contain all html for the table body
	var tBody = '';
	//Set reference for when to start next feature row
	var feature_id = '';
	//Set reference for when to start a new category
	var category_id = '';
	//For every row in the data
	for (var i = 0; i < table_data.record.length; i++) {
		//If there is a new category add a column span for the new category
		if (category_id !== table_data.record[i].category_id) {
			category_id = table_data.record[i].category_id;
			//Check to make sure the category is not in the blacklist before adding it
			if (jQuery.inArray(table_data.record[i].category_id, white_list) == -1) {
				tBody += tableCell(table_data, i, 2);
				//Add the category id to the main whitelist
				white_list_main.push(category_id);
			} else {
				//If the category is in the blacklist, skip over the rest of the features with that id
				while (i < table_data.record.length && category_id == table_data.record[i].category_id) {
					i++;
				}
				i--; //add buffer for continue
				continue;
			};
		};
		//Check to make sure the next feature is in the blacklist
		if (jQuery.inArray(table_data.record[i].feature_id, white_list) == -1) {
			//If in the same row, add next cell
			if (feature_id == table_data.record[i].feature_id) {
				tBody += tableCell(table_data, i, 0);	
			} else {
				//If new row, start next row with feature name and first product description
				tBody += tableCell(table_data, i, 1);
				tBody += tableCell(table_data, i, 0);
				//Reset reference for when to start next row
				feature_id = table_data.record[i].feature_id;
				//Add the feature id to the main whitelist
				white_list_main.push(feature_id);
			};
		};
	};
	//Close last row
	tBody += '</tr>'
	//Fill the whitelist with the newly created main list
	white_list = white_list_main.slice();
	//Attach generated html to table body in index page
	document.getElementById("ehrTableBody").innerHTML = tBody;
	return;
}

//Returns formated HTML for popovers based on type, 0 = prod_feature_notes, 1 = feature_desc, 2 = category_desc
function infoPopover(table_data, index, type) {
	if (type == 0) {
		var popover = '<a href="#" tabindex="0" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-container="body" data-content="' + table_data.record[index].prod_feature_notes + '"><i class="info glyphicon glyphicon-info-sign color"></i></a>'
	} else if (type == 1) {
		var popover = '<a href="#" tabindex="0" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-container="body" data-content="' + table_data.record[index].feature_desc + '"><i class="info glyphicon glyphicon-info-sign color"></i></a>'
	} else {
		var popover = '<a href="#" tabindex="0" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-container="body" data-content="' + table_data.record[index].category_desc + '"><i class="info glyphicon glyphicon-info-sign color"></i></a>'
	};
	return popover;
}

//Returns formated HTML for a video icon link to new window
function linkPopover(table_data, index){
	var popover = '<div onclick="doModal(\''+table_data.record[index].feature_name+'\',\''+ table_data.record[index].more_info_link +'\')" class="info glyphicon glyphicon-link color"></div>';
	return popover;
}

//Returns table cell based on index and type, 0 = prod_feature_desc, 1 = feature_name, 2 = category_title
function tableCell(table_data, index, type) {
	var cell = '';
	if (type == 0) { //feature desc
		var featClass = "";
		//Check if red or green class is needed for table color: Yes = green, No = red
		if (table_data.record[index].prod_feature_desc.localeCompare("Yes") == 0) {
			featClass = "green";
		} else if (table_data.record[index].prod_feature_desc.localeCompare("No") == 0) {
			featClass = "red";
		}
		//Check if popovers are needed for the cell
		if (table_data.record[index].more_info_link != undefined && table_data.record[index].more_info_link != "" && table_data.record[index].prod_feature_notes != undefined && table_data.record[index].prod_feature_notes != "") {
			cell = '<td class="' + featClass + '">' + table_data.record[index].prod_feature_desc + infoPopover(table_data, index, 0) + linkPopover(tableData, index) + '</td>';
		} else if (table_data.record[index].prod_feature_notes != undefined && table_data.record[index].prod_feature_notes != "") {
			cell = '<td class="' + featClass + '">' + table_data.record[index].prod_feature_desc + infoPopover(table_data, index, 0) + '</td>';
		} else if (table_data.record[index].more_info_link != undefined && table_data.record[index].more_info_link != "") {
			cell = '<td class="' + featClass + '">' + table_data.record[index].prod_feature_desc + linkPopover(table_data, index) + '</td>';
		} else {
			cell = '<td class="' + featClass + '">' + table_data.record[index].prod_feature_desc + '</td>';
		};
	} else if (type == 1) { //feature name (New Row is created here)
		//Check if popover is needed for next feature
		if (table_data.record[index].feature_desc != undefined && table_data.record[index].prod_feature_notes != "") {
			cell = '</tr><td>' + table_data.record[index].category_id + ',' + table_data.record[index].feature_id + '</td><td>' + table_data.record[index].feature_name + infoPopover(table_data, index, 1) + '</td>';
		} else {
			cell = '</tr><td>' + table_data.record[index].category_id + ',' + table_data.record[index].feature_id + '</td><td>' + table_data.record[index].feature_name + '</td>';
		};
	} else { //category title (New Row is created here)
		//Check if popover is needed for next category
		if (table_data.record[index].category_desc != undefined && table_data.record[index].prod_feature_notes != "") {
			cell = '<tr><td>' + table_data.record[index].category_id + ',' + table_data.record[index].category_id + '</td><td class="categoryTableColor">' + table_data.record[index].category_title + infoPopover(table_data, index, 2) + '</td>' + cellSpan() + '</tr>';
		} else {
			cell = '<tr><td>' + table_data.record[index].category_id + ',' + table_data.record[index].category_id + '</td><td class="categoryTableColor">' + table_data.record[index].category_title + '</td>' + cellSpan() + '</tr>';
		};
	};
	return cell;
}

//Returns the correct HTML to add a column span
function cellSpan() {
	var span = '';
	//fill empty cells with place holders
	for (var i = 0; i < numberOfCompanies; i++) {
		span += '<td class="categoryTableColor"></td>'
	};
	return span;
}
				
//connects the DataTables plugin to the generated table
function connectTable() {
	//Allows Popovers to function
	$('[data-toggle="popover"]').popover();
	//Allows feature dropdowns to work
	$(".featureDropDown").click(function(e){
		var dropID = $(this).parent().parent().attr('id');
		//console.log(dropID);
		$('#Drop' + dropID).slideToggle("slow");
		//sets the arrow up or down on click
        var children = document.getElementById('catDrop' + dropID).childNodes;
        if (children[0].className == "glyphicon glyphicon-triangle-bottom"){
        	children[0].className = "glyphicon glyphicon-triangle-top";
        } else{
        	children[0].className = "glyphicon glyphicon-triangle-bottom";
        }
	});

	 table = $('#ehrTable').DataTable( {
        "scrollY": "350px",
        "scrollX": true,
        "paging": false,
        "ordering": false,
        "info": false,
        "columnDefs": [
            {
               "targets": [ 0 ],
               "visible": false,
            },
            {  
              "targets": [ 1 ],
              "width": '10%',
          	}
        ],
        "fixedColumns": {
            leftColumns: 2
        }
    } );
    table.draw();
}

function searchTable(element) {
	var id = parseInt($(element).attr('id'));
	//remove the 200 that was added to make unique ids
	id = (id - 200);
	var temp_white_list = [];
	//If the id is larger than 1000 then it is a category and we have to add all the categories features to the whitelist
	if (id > 1000) {
		temp_white_list = idsOfFeaturesByCategory(id);
	} else {
		var cat_ID = featureCategory(id, 1);
		temp_white_list.push(cat_ID);
		temp_white_list.push(id);
	};
	//Replace the whitelist with the newly created one.
	white_list = temp_white_list;
	table.draw(false);
}

//Toggles if a feature will be in the table or not. If it is already in the blacklist array, remove it, otherwise add it.
function addRemoveWhitelist(element) {
	var id = parseInt($(element).attr('id'));
	//Used to make sure we have unique ids with feature buttons
	if (id < 400) {
		id = (id + 200);
	}
	var arrayIndex = jQuery.inArray(id, white_list);
	//If the element is shown, remove it, otherwise add it.
	if (arrayIndex !== -1) {
		//If category then remove the category and its features
		if (id > 1000) {
			var array = idsOfFeaturesByCategory(id);
			for (var i = 0; i < array.length; i++) {
				white_list.splice(jQuery.inArray(array[i], white_list), 1);
			};
		} else {
			var cat_ID = featureCategory(id, 1);
			//If the category is used for other features
			if (isCategoryUsed(cat_ID, id)) {
				//Just the Feature will be removed the table
				white_list.splice(arrayIndex, 1);
			} else {
				//The feature and category is removed
				white_list.splice(arrayIndex, 1);
				white_list.splice(jQuery.inArray(cat_ID, white_list), 1);
			};
			
		}
	} else {
		//If category then add the category and its features
		if (id > 1000) {
			var array = idsOfFeaturesByCategory(id);
			for (var i = 0; i < array.length; i++) {
				white_list.push(array[i], 1);
			};
		} else {
			var cat_ID = featureCategory(id, 1);
			//Add the feature
			white_list.push(id, 1);
			//If the Feature category is not in the whitelist, add it too
			if (jQuery.inArray(cat_ID, white_list) == -1) {
				white_list.push(cat_ID);
			};
		}
	}
	table.rows().recalcHeight().draw(false);
}

//Returns array of category id and feature ids under that category 
function idsOfFeaturesByCategory(id) {
	var temp_white_list = [];
	//Add the category id to the temp array
	temp_white_list.push(id);
	//Find the location in the main array for the category
	var white_list_index = jQuery.inArray(id, white_list_main);
	//Index of the array one after the category index
	var i = white_list_index + 1;
	//Add all the feature ids under the current category to the temp array
	while (white_list_main[i] < 1000) {
		temp_white_list.push(white_list_main[i]);
		i++;
	};
	//Return the temp array
	return temp_white_list;
}

//Returns the category id for a given feature id
function featureCategory(id) {
	var white_list_index = jQuery.inArray(id, white_list_main);
	var i = white_list_index -1;
	while (i > -1) {
		if (white_list_main[i] > 1000) {
			return white_list_main[i];
		};
		i--;
	};
}

//Returns true if category is active in a way other than the current feature
function isCategoryUsed(cat_ID, feat_ID) {
	var white_list_index = jQuery.inArray(cat_ID, white_list_main);
	var i = white_list_index +1;
	for (var i = white_list_index; white_list_main[i] < 1000; i++) {
		if (jQuery.inArray(white_list_main[i], white_list) !== -1 && white_list_main[i] !== feat_ID) {
			return false;
		};
	};
	return true;
}

//add and remove called from elements in the page
function addRemoveCompany(element) {
	var rowID = $(element).attr('id');
	//hides or shows each column in the array created by split
	if (table.column(rowID).visible()) {
		removeCompany(rowID);
	}else{
		addCompany(rowID);
	};
	table.draw();
}

//Adds a company to the table
function addCompany(id){
	if (id != 10 && id != 11) {
		var children = document.getElementById(id).childNodes;
		var pillElement = document.getElementById('color'+ id);
		children[0].className = "glyphicon glyphicon-minus-sign";
		pillElement.style.background = '#3E5672';
	}
	var index = company_blacklist.indexOf(id);
	table.column(id).visible(true);
	company_blacklist.splice(index, 1);
	//deals with QSI having multiple products
	if (id == "10,11"){
		table.column("11").visible(true);
	}
}

//removes a company to the table
function removeCompany(id){
	if (id != 10 && id != 11) {
		var children = document.getElementById(id).childNodes;
		var pillElement = document.getElementById('color'+ id);
		children[0].className = "glyphicon glyphicon-plus-sign";
		pillElement.style.background = '#7b97b7';
	}
	table.column(id).visible(false);
	company_blacklist.push(id);
	//deals with QSI having multiple products
	if (id == "10,11"){
		table.column("11").visible(false);
	}
}

function resetTable() {
	white_list = white_list_main.slice();
	while (company_blacklist.length > 0){
		addCompany(company_blacklist[0]);
	}
	table.draw();
}

function clearTable() {
	white_list = [];
	table.draw();
}

function groupFilter(range_min, range_max){
	//reset company filter
	while (company_blacklist.length > 0){
		addCompany(company_blacklist[0]);
	}
	// Grab data about company group sizes
	var row_data = table.row(2).data();
	var i;
	// Loop over the data and remove companies as needed.
	for (i=2; i<row_data.length; i++){
		if (row_data[i] == "") {
			row_data[i] = "0";
		}
		// If the company is out of given range, remove it.
		if (parseInt(row_data[i]) > range_max || parseInt(row_data[i]) < range_min) {
			removeCompany(i);
		}
	}
}

//Useful Functions
function checkBin(n){return/^[01]{1,64}$/.test(n)}
function checkDec(n){return/^[0-9]{1,64}$/.test(n)}
function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
function pad(s,z){s=""+s;return s.length<z?pad("0"+s,z):s}
function unpad(s){s=""+s;return s.replace(/^0+/,'')}

//Decimal operations
function Dec2Bin(n){if(!checkDec(n)||n<0)return 0;return n.toString(2)}
function Dec2Hex(n){if(!checkDec(n)||n<0)return 0;return n.toString(16)}

//Binary Operations
function Bin2Dec(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(10)}
function Bin2Hex(n){if(!checkBin(n))return 0;return parseInt(n,2).toString(16)}

//Hexadecimal Operations
function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
function Hex2Dec(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(10)}

function doModal(heading, videoLink) {
    html =  '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>'+heading+'</h4>'
    html += '</div>';
    html += '<div class="modal-body">';
    html +=  '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+videoLink+'" frameborder="0" allowfullscreen></iframe>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
    html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // footer
    html += '</div>';  // modalWindow
    $('body').append(html);
    $("#dynamicModal").modal();
    $("#dynamicModal").modal('show');

    $('#dynamicModal').on('hidden.bs.modal', function (e) {
        $(this).remove();
    });

}