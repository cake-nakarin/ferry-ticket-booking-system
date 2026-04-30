# WordPress Integration Guide

## 📋 Embedding Single Page in WordPress

### Option 1: Using a Plugin (Recommended)

1. **Create a Custom Plugin** in `/wp-content/plugins/ferry-booking/`

```php
<?php
/**
 * Plugin Name: Ferry Ticket Booking
 * Plugin Description: Ferry ticket booking system
 * Version: 1.0.0
 * Author: Your Name
 */

// Add shortcode to embed the booking app
add_shortcode('ferry_booking', function() {
    $plugin_url = plugin_dir_url(__FILE__);
    ob_start();
    ?>
    <div id="ferry-booking-app"></div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    
    <!-- Configure API URL for WordPress -->
    <script>
        window.FERRY_API_URL = '<?php echo esc_url(rest_url('ferry-booking/v1')); ?>';
    </script>
    
    <?php include plugin_dir_path(__FILE__) . 'single-page.html'; ?>
    <?php
    return ob_get_clean();
});
```

2. **Add shortcode to page:**
```
[ferry_booking]
```

### Option 2: Manual Page Template

1. Copy `single-page.html` content to WordPress Theme
2. Create a new page template in your theme:

```php
<?php
/**
 * Template Name: Ferry Booking Page
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="ferry-booking-app"></div>
    
    <!-- Include Vue and Axios -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    
    <!-- Configure API for WordPress -->
    <script>
        window.FERRY_API_URL = '<?php echo esc_url(rest_url('ferry-booking/v1')); ?>';
    </script>
    
    <!-- Your Vue app code here -->
    <script>
        // ... paste the Vue app code from single-page.html
    </script>
    
    <?php wp_footer(); ?>
</body>
</html>
```

### Option 3: Insert as Block (Block Editor)

Use a custom block plugin to insert the single-page HTML as a reusable block.

## 🔌 REST API Integration

### Create REST Endpoints in WordPress

```php
add_action('rest_api_init', function() {
    register_rest_route('ferry-booking/v1', '/tickets', array(
        'methods' => 'GET',
        'callback' => 'get_ferry_tickets',
        'permission_callback' => '__return_true'
    ));
    
    register_rest_route('ferry-booking/v1', '/bookings', array(
        'methods' => 'POST',
        'callback' => 'create_ferry_booking',
        'permission_callback' => '__return_true'
    ));
});

function get_ferry_tickets($request) {
    $departure = $request->get_param('departure');
    $destination = $request->get_param('destination');
    $date = $request->get_param('date');
    
    // Query your database here
    $tickets = array(); // Fetch from DB
    
    return new WP_REST_Response($tickets, 200);
}

function create_ferry_booking($request) {
    $data = $request->get_json_params();
    
    // Process booking
    // Save to database
    
    return new WP_REST_Response(array('status' => 'success'), 200);
}
```

## 🎯 Usage in WordPress

### Add to Page:

1. Go to WordPress Dashboard
2. Create/Edit a Page
3. Add shortcode:
   ```
   [ferry_booking]
   ```
4. Publish

Or manually copy the `single-page.html` content into a template.

## ⚙️ Configuration

### Set Custom API URL:

In your WordPress header (before Vue app loads):

```javascript
window.FERRY_API_URL = 'https://your-api-domain.com/api';
```

### Environment Variables:

Create `.env.php` in plugin folder:

```php
<?php
define('FERRY_API_URL', 'https://your-api.com/api');
define('FERRY_DEBUG', false);
?>
```

Then in template:

```php
<?php
require_once plugin_dir_path(__FILE__) . '.env.php';
?>
<script>
    window.FERRY_API_URL = '<?php echo esc_url(FERRY_API_URL); ?>';
</script>
```

## 📦 What's Included

- `single-page.html` - Complete standalone application
  - Vue 3 from CDN
  - Axios for API calls
  - All CSS inline
  - Mock data built-in
  - No build process needed

## 🚀 Quick Embed

Simply copy and paste this into your WordPress page template:

```html
<div id="ferry-booking-app"></div>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<!-- Copy entire <script> section from single-page.html -->
```

## 🔐 Security Notes

- Enable CORS on your API server
- Use proper authentication tokens if needed
- Validate all input data on server side
- Sanitize WordPress inputs with `esc_url()`, `sanitize_text_field()`, etc.

## 📞 Support

- Vue 3 Docs: https://vuejs.org/
- WordPress REST API: https://developer.wordpress.org/rest-api/
- Axios Docs: https://axios-http.com/
