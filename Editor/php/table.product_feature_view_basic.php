<?php

/*
 * Editor server script for DB table product_feature_view_basic
 * Created by http://editor.datatables.net/generator
 */

// DataTables PHP library and database connection
include( "DataTables.php" );

// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate;

// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, 'product_feature_view_basic', 'id' )
	->fields(
		Field::inst( 'product_id' )
			->set( false ),
		Field::inst( 'category_title' )
			->set( false ),
		Field::inst( 'feature_name' )
			->set( false ),
		Field::inst( 'prod_feature_desc' ),
		Field::inst( 'prod_feature_notes' ),
		Field::inst( 'feature_id' )
			->set( false )
	)
	->process( $_POST )
	->json();
