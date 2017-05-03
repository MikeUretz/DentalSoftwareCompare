<?php if (!defined('DATATABLES')) exit(); // Ensure being used in DataTables env.

// Enable error reporting for debugging (remove for production)
error_reporting(E_ALL);
ini_set('display_errors', '1');


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Database user / pass
 */
$sql_details = array(
	"type" => "Mysql",  // Database type: "Mysql", "Postgres", "Sqlite" or "Sqlserver"
	"user" => "valleyboy07",       // Database user name
	"pass" => "E4Azz2me",       // Database password
	"host" => "ehr-dev.cbvayrcjjw1j.us-west-2.rds.amazonaws.com",       // Database host
	"port" => "3306",       // Database connection port (can be left empty for default)
	"db"   => "ehr",       // Database name
	"dsn"  => "charset=utf8"        // PHP DSN extra information. Set as `charset=utf8` if you are using MySQL
);


