var currentView = "home";
var company_id;
var companyJSON;
var productJSON;

function changeView(viewID) {
	$('#'+currentView).css('display', 'none');
	$('#'+viewID).css('display', 'block');
	currentView = viewID;
}

function submitCode(){
	// Retrieve company code from input
	var codeInput = $('#cCode').val();
	// Call API to find company with that code
	$.getJSON("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/company?ids=" + codeInput + "&id_field=company_code&app_name=ehrSelect", function(json){
		companyJSON = json;
		// Set company ID
		company_id = companyJSON.record[0].id;
		// Use company ID to find all of the company's products ids
		$.getJSON("http://ec2-54-201-29-242.us-west-2.compute.amazonaws.com:80/rest/ehr/product?filter=company_id%3D" + company_id + "&app_name=ehrSelect", function(json){
			productJSON = json;
			// Create overview of products page
			createOverview(companyJSON, productJSON);
			// product_id = codeInput;
			changeView('overview');
		});
	}).error(function(){
		$('#cCodeError').text('error: Incorrect company code, please try again');
	});
}

function createOverview(companyJSON, productJSON){
	var overviewHTML = '<h1>Company and Products Overview</h1></br><span>Thank you for taking the time to edit your information for Dental Software Compare.</span></br><span>Hit the buttons below to edit your company and or product data.</span>';
	// Add company edit button
	overviewHTML += '<div class="textNextBtn"><span>Company: '+ companyJSON.record[0].company_name +'</span><button type="button" id="cDataEditBtn" class="btn btn-primary" onclick="enterCompanyEdit()">Edit Company Data</button></div>';
	// Add edit buttons for each product the company owns
	for (var i = 0; i < productJSON.record.length; i++) {
		overviewHTML += '<div class="textNextBtn"><span>Product: '+ productJSON.record[i].product_name +'</span><button type="button" id="pDataEditBtn" class="btn btn-primary" onclick="enterProductEdit('+ productJSON.record[i].id +')">Edit Product Data</button></div>';
	};
	// Add back button
	var onclick = "'home'";
	overviewHTML += '<button type="button" id="homeBtn" class="btn btn-primary smallTopPadding" onclick="changeView('+ onclick +')">Back</button>';
	// Place HTML in dom
	$('#overviewContainer').html(overviewHTML);
}

function enterCompanyEdit(){
	$('#companyPageName').text('Company: ' + companyJSON.record[0].company_name);
	changeView('companyEdit');
	rebuildCompanyTable(company_id);
}

function enterProductEdit(product_id){
	var productName;
	for (var i = 0; i < productJSON.record.length; i++) {
		if(productJSON.record[i].id == product_id){
			productName = productJSON.record[i].product_name;
			$('#productPageName').text('Product: ' + productName);
		}
	};
	changeView('productEdit');
	rebuildProductTables(product_id);
}

/* 		TABLE FUNCTIONS			*/

var basicProductEditor;
var shortanswerProductEditor;
var companyEditor;
var basicProductTable;
var shortanswerProductTable;
var companyTable;

// Builds editor for product table with Yes No N/A answers
function buildBasicProductEditor(){
	basicProductEditor = new $.fn.dataTable.Editor( {
		ajax: 'php/table.product_feature_view_basic.php',
		table: '#product_feature_view_basic',
		fields: [
			{
				"label": "Feature Implementation:",
				"name": "prod_feature_desc",
				"type": "select",
				"options": [
					"   ",
					"Yes",
					"No",
					"N\/A"
				]
			},
			{
				"label": "Feature Notes:",
				"name": "prod_feature_notes"
			}
		]
	} );

	// Activate an inline edit on click of a table cell
    $('#product_feature_view_basic').on( 'click', 'tbody td:not(:first-child)', function (e) {
        basicProductEditor.inline( this, {
        	buttons: { label: 'Submit', fn: function () { this.submit(); } }
        } );
    } );
}

// Builds editor for product table with short answers
function buildShortanswerProductEditor(){
 	shortanswerProductEditor = new $.fn.dataTable.Editor( {
		ajax: 'php/table.product_feature_view_shortanswer.php',
		table: '#product_feature_view_shortanswer',
		fields: [
			{
				"label": "Feature Implementation:",
				"name": "prod_feature_desc"
			},
			{
				"label": "Feature Notes:",
				"name": "prod_feature_notes"
			}
		]
	} );

	// Activate an inline edit on click of a table cell
    $('#product_feature_view_shortanswer').on( 'click', 'tbody td:not(:first-child)', function (e) {
        shortanswerProductEditor.inline( this, {
        	buttons: { label: 'Submit', fn: function () { this.submit(); } }
        } );
    } );
}

// Builds editor for company info table
function buildCompanyEditor() {
		companyEditor = new $.fn.dataTable.Editor( {
		ajax: 'php/table.company.php',
		table: '#company',
		fields: [
			{
				"label": "Name:",
				"name": "company_name"
			},
			{
				"label": "Background:",
				"name": "background",
				"type": "textarea"
			},
			{
				"label": "Address:",
				"name": "address"
			},
			{
				"label": "City:",
				"name": "city"
			},
			{
				"label": "State:",
				"name": "state"
			},
			{
				"label": "Zip:",
				"name": "zip"
			},
			{
				"label": "Phone:",
				"name": "phone"
			},
			{
				"label": "Web Address:",
				"name": "web_address"
			},
			{
				"label": "Custom Link:",
				"name": "special_link"
			}
		]
	} );
}

// Builds Product table for Yes No and N/A answers
function buildBasicProductTable(product_id){
	basicProductTable = $('#product_feature_view_basic').DataTable( {
		dom: 'frtip',
		ajax: {
		    type : "POST",
		    url : 'php/table.product_feature_view_basic.php',
		    dataSrc : function (json) {
		      var return_data = new Array();
		      for(var i=0;i< json.data.length; i++){
		      		if(json.data[i].product_id == product_id){
						return_data.push(json.data[i]);
		      		}
		      }
		      return return_data;
		    }
		},
		columns: [
			{
				"data": "product_id"
			},
			{
				"data": "category_title"
			},
			{
				"data": "feature_name"
			},
			{
				"data": "prod_feature_desc"
			},
			{
				"data": "prod_feature_notes"
			}
		],
		columnDefs: [
            {
               "targets": [ 0 ],
               "visible": false
            },
            {  
              "targets": [ 1, 2 ],
              "width": '20%'
          	},
          	{
          	  "targets": [ 3 ],
          	  "width": '20%'
          	},
          	{ 
          		"className": "boldCol", "targets": [ 1, 2 ] 
          	}
        ],
        order: [[ 1, "asc" ]],
        scrollY: "400px",
        scrollCollapse: true,
        paging: false,
        info: false,
        select: {
            style:    'os',
            selector: 'td:first-child'
        }
	} );
}

// Builds product table for short answers
function buildShortanswerProductTable(product_id){
 	shortanswerProductTable = $('#product_feature_view_shortanswer').DataTable( {
		dom: 'rtip',
		ajax: {
		    type : "POST",
		    url : 'php/table.product_feature_view_shortanswer.php',
		    dataSrc : function (json) {
		      var return_data = new Array();
		      for(var i=0;i< json.data.length; i++){
		      		if(json.data[i].product_id == product_id){
						return_data.push(json.data[i]);
		      		}
		      }
		      return return_data;
		    }
		},
		columns: [
			{
				"data": "product_id"
			},
			{
				"data": "category_title"
			},
			{
				"data": "feature_name"
			},
			{
				"data": "prod_feature_desc"
			},
			{
				"data": "prod_feature_notes"
			}
		],
		columnDefs: [
            {
               "targets": [ 0 ],
               "visible": false
            },
            {  
              "targets": [ 1, 2, 3 ],
              "width": '20%'
          	},
          	{ 
          		"className": "boldCol", "targets": [ 1, 2 ] 
          	}
        ],
        info: false,
        paging: false,
        order: [[ 1, "asc" ]],
        select: {
            style:    'os',
            selector: 'td:first-child'
        }
	} );
}

// Builds Company info table
function buildCompanyTable(company_id){
		companyTable = $('#company').DataTable( {
		dom: 'Brtip',
		ajax: {
		    type : "POST",
		    url : 'php/table.company.php',
		    dataSrc : function (json) {
		      var return_data = new Array();
		      for(var i=0;i< json.data.length; i++){
		      		if(json.data[i].DT_RowId == "row_"+company_id){
						return_data.push(json.data[i]);
		      		}
		      }
		      return return_data;
		    }
		},
		columns: [
			{
				"data": "company_name"
			},
			{
				"data": "background"
			},
			{
				"data": "address"
			},
			{
				"data": "city"
			},
			{
				"data": "state"
			},
			{
				"data": "zip"
			},
			{
				"data": "phone"
			},
			{
				"data": "web_address"
			},
			{
				"data": "special_link"
			}
		],
		paging: false,
        ordering: false,
        info: false,
		select: true,
		lengthChange: false,
		initComplete: function( settings ) {
	      var api = new $.fn.dataTable.Api( settings );
	      api.rows(["[id='row_"+ company_id +"']"]).select();
	    },
		buttons: [
			{ extend: 'edit',   editor: companyEditor },
		]
	} );
}

// Rebuilds company table for different company
function rebuildCompanyTable(company_id){
	if (companyTable != undefined) {
		companyTable.destroy();
	}
	buildCompanyTable(company_id);
}

// Rebuilds product tables for different product
function rebuildProductTables(product_id){
	if(basicProductTable != undefined){
		basicProductTable.destroy();
		shortanswerProductTable.destroy();
	}
	buildBasicProductTable(product_id);
	buildShortanswerProductTable(product_id);
}
