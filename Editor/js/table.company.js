
/*
 * Editor client script for DB table company
 * Created by http://editor.datatables.net/generator
 */

 var editor;
 var table;

function buildCompanyEditor(company_id) {
		editor = new $.fn.dataTable.Editor( {
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
			}
		]
	} );
}
function buildCompanyTable(company_id){
		table = $('#company').DataTable( {
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
			}
		],
		paging: false,
        ordering: false,
        info: false,
		select: true,
		lengthChange: false,
		buttons: [
			{ extend: 'edit',   editor: editor },
		]
	} );
}
function rebuildCompanyTable(company_id){
	table.destroy();
	buildCompanyTable(company_id);
}
