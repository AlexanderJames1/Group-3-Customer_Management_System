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
$adminData = validateToken($token);

if ($adminData) {
    $stmt = $conn->prepare("SELECT admin_name, email, phone, profile_image FROM car_admins WHERE admin_id = ?");
    $stmt->bind_param("i", $adminData['admin_id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc(); 

        if (empty($admin['profile_image'])) {
            $admin['profile_image'] = 'uni.jpg';
        }

        echo json_encode(['type' => 'success', 'admin' => $admin]);
    } else {
        echo json_encode(['type' => 'error', 'message' => 'admin not found']);
    }
} else {
    echo json_encode(['type' => 'error', 'message' => 'Invalid token']);
}

function validateToken($token) {
    $decoded = json_decode(base64_decode($token), true);
    if (!$decoded) {
        return null;  // Pang Debugg
    }
    if (isset($decoded['admin_id'])) {
        return $decoded;
    }
    return null;
}

?>                                       