<?php
include_once __DIR__ . '/../Administrator/header.php';
include_once __DIR__ . '/../config/connection.php';

header("Content-Type: application/json");

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader)) {
    echo json_encode(['type' => 'error', 'message' => 'Authorization token is missing']);
    exit;    
}

$token = str_replace("Bearer ", "", $authHeader);
$userData = validateToken($token);

if ($userData) {
    $stmt = $conn->prepare("SELECT customer_name, email, phone, address, profile_image, loyalty_points, preference, used_black_tier FROM car_customers WHERE customer_id = ?");
    $stmt->bind_param("i", $userData['customer_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc(); 

        if (empty($user['profile_image'])) {
            $user['profile_image'] = 'uni.jpg';
        }

        echo json_encode(['type' => 'success', 'user' => $user]);
    } else {
        echo json_encode(['type' => 'error', 'message' => 'User not found']);
    }
} else {
    echo json_encode(['type' => 'error', 'message' => 'Invalid token']);
}

function validateToken($token) {
    $decoded = json_decode(base64_decode($token), true);
    if (!$decoded) {
        return null;  // Pang Debugg
    }
    if (isset($decoded['customer_id'])) {
        return $decoded;
    }
    return null;
}

?>                                       