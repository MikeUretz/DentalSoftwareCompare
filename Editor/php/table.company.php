<?php

/*
 * Editor server script for DB table company
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
Editor::inst( $db, 'company', 'id' )
	->fields(
		Field::inst( 'company_name' )
			->validator( 'Validate::notEmpty' ),
		Field::inst( 'background' ),
		Field::inst( 'address' ),
		Field::inst( 'city' ),
		Field::inst( 'state' ),
		Field::inst( 'zip' ),
		Field::inst( 'phone' ),
		Field::inst( 'web_address' )
			->validator( 'Validate::url' ),
		Field::inst( 'sort_by_nbr' ),
		Field::inst( 'contact_name' ),
		Field::inst( 'contact_email' ),
		Field::inst( 'special_link' ),
		Field::inst( 'company_code' )
	)
	->process( $_POST )
	->json();
