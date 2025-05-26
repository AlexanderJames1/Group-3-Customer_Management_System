<?php
include_once __DIR__ . '/../Administrator/header.php';
include_once __DIR__ . '/../config/connection.php';

header('Content-Type: application/json');

$sql = "
    SELECT
        c.profile_image,
        o.full_name,
        o.customer_id,
        COUNT(o.order_id) AS total_orders,
        COALESCE(SUM(o.quantity * p.price), 0) AS total_spent
    FROM car_orders o
    LEFT JOIN car_products p ON o.product_id = p.product_id
    LEFT JOIN car_customers c ON o.customer_id = c.customer_id
    GROUP BY o.customer_id
    ";

// SELECT
//     c.profile_image,
//     o.full_name,
//     o.customer_id,
//     COUNT(o.order_id) AS total_orders,
//     COALESCE(SUM(o.quantity * p.price), 0) AS total_spent
// FROM car_orders o
// LEFT JOIN car_products p ON o.product_id = p.product_id
// LEFT JOIN car_customers c ON o.customer_id = c.customer_id
// GROUP BY o.customer_id


$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        'success' => false,
        'error' => $conn->error
    ]);
    exit;
}

$segments = [];

while ($row = $result->fetch_assoc()) {
    $segment = '';

    if ($row['total_spent'] > 1000000) {
        $segment = 'VIP';
    } else if ($row['total_spent'] > 100000) {
        $segment = 'Loyal';
    } else if ($row['total_spent'] > 50000) {
        $segment = 'Big Spender';
    } else if ($row['total_spent'] > 10000) {
        $segment = 'Occasional';
    } else {
        $segment = 'Newbie';
    }

    $segments[] = [
        'profile_image' => $row['profile_image'],
        'full_name' => $row['full_name'],
        'customer_id' => $row['customer_id'],
        'total_orders' => (int)$row['total_orders'],
        'total_spent' => (float)$row['total_spent'],
        'segment' => $segment
    ];
}

echo json_encode(['success' => true, 'data' => $segments]);
?>
