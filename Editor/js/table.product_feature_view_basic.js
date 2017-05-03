
/*
 * Editor client script for DB table product_feature_view_basic
 * Created by http://editor.datatables.net/generator
 */

var basicProductEditor;
var basicProductTable;


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
        basicProductEditor.inline( this );
    } );
}

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
              "targets": [ 1, 2, 3 ],
              "width": '20%',
          	}
        ],
        scrollY: "500px",
        scrollCollapse: true,
        paging: false,
        info: false,
        select: {
            style:    'os',
            selector: 'td:first-child',
            blurable: true
        }
	} );
}

function rebuildBasicProductTable(product_id){
	basicProductTable.destroy();
	buildBasicProductTable(product_id);
}
