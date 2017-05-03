<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'mudenteh_wrdp1');

/** MySQL database username */
define('DB_USER', 'mudenteh_wrdp1');

/** MySQL database password */
define('DB_PASSWORD', 'JO2rlQaxdmpNZte');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ')q:@_y|Aa@ btx`Q}.=bM?P5.%co%A[8;AONOXTcJ|LR|e|x1};PqOs]@aP]Y sU');
define('SECURE_AUTH_KEY',  'f,;xX$:^`>9Xk<2-+qpmzJHc,a9o1qWWW^59!RY#i@7:H@c@3dMKg%Mr*gp!=<Z.');
define('LOGGED_IN_KEY',    'yxAk@7pbj8P+v11H[JUup UXQG#bm/.Yu<aC8YxUkM~v~O1=.Bu6{u]}(&#SXq; ');
define('NONCE_KEY',        'P$UK!S7}L>42W[sN]rz#|pZV:mXRIB23&leUD*FKHLbh|#P[6Gx*k$vVFJi6nye]');
define('AUTH_SALT',        'sSx:s&`nbl(/]UwYhp%/y:+.Y45e0YYxZBO_C(x3ufJ{dhrcfng=Fw<}}63(g>jD');
define('SECURE_AUTH_SALT', '2/xIJF,uT^H!eK#~G,tp6x^d20*Ze]mOIgo?mGUH>8NJ<<$C~zzuz9y0u!Ph)ceX');
define('LOGGED_IN_SALT',   'vBh*Z;ye>dPLGM#] O!31oaRPOZNvpRX<ao7J2PLt`;ec2_6lJc06Hu8`wyb@Rs1');
define('NONCE_SALT',       'J)Ta~MqtG<b#Y/OKL 51KX`{|z_4O?]GwGFC~HyqqS^U!8z C );+mr7NOIP-gd(');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

