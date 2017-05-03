
/*
 * Editor client script for DB table product_feature_view_shortanswer
 * Created by http://editor.datatables.net/generator
 */
 var shortanswerProductEditor;
 var shortanswerProductTable;

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
        shortanswerProductEditor.inline( this );
    } );
 }

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
              "width": '20%',
          	}
        ],
        ordering: false,
        info: false,
        paging: false,
        select: {
            style:    'os',
            selector: 'td:first-child'
        }
	} );
 }

 function rebuildShortanswerProductTable(product_id){
 	shortanswerProductTable.destroy();
 	buildShortanswerProductTable(product_id);
 }


