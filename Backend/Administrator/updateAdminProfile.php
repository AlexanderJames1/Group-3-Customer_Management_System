<?php
include_once __DIR__ . '/../Administrator/header.php';
include_once __DIR__ . '/../config/connection.php';

header("Content-Type: application/json");

// Check Authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader)) {
    echo json_encode(['type' => 'error', 'message' => 'Authorization token is missing']);
    exit;    
}

$token = str_replace("Bearer ", "", $authHeader);
$adminData = validateToken($token);

if (!$adminData) {
    echo json_encode(['type' => 'error', 'message' => 'Invalid token']);
    exit;
}

$admin_id = $adminData['admin_id'];
$admin_name = $_POST['admin_name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';

if (empty($admin_name) || empty($email) || empty($phone)) {
    echo json_encode(['type' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Handle optional profile image upload
$uploadDir = __DIR__ . '/../uploads/';
$profileImage = '';

if (!empty($_FILES['profile_image']['name'])) {
    $imageTmpName = $_FILES['profile_image']['tmp_name'];
    $imageName = uniqid() . '_' . basename($_FILES['profile_image']['name']);
    $imagePath = $uploadDir . $imageName;

    if (move_uploaded_file($imageTmpName, $imagePath)) {
        $profileImage = $imageName;
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Failed to upload image']);
        exit;
    }
}

// Update admin info
if ($profileImage) {
    $stmt = $conn->prepare("UPDATE car_admins SET admin_name = ?, email = ?, phone = ?, profile_image = ? WHERE admin_id = ?");
    $stmt->bind_param("ssssi", $admin_name, $email, $phone, $profileImage, $admin_id);
} else {
    $stmt = $conn->prepare("UPDATE car_admins SET admin_name = ?, email = ?, phone = ? WHERE admin_id = ?");
    $stmt->bind_param("sssi", $admin_name, $email, $phone, $admin_id);
}

if ($stmt->execute()) {
    // Fetch updated data
    $query = $conn->prepare("SELECT admin_id, admin_name, email, phone, profile_image FROM car_admins WHERE admin_id = ?");
    $query->bind_param("i", $admin_id);
    $query->execute();
    $result = $query->get_result();
    $updatedAdmin = $result->fetch_assoc();

    if (empty($updatedAdmin['profile_image'])) {
        $updatedAdmin['profile_image'] = 'uni.jpg';
    }

    echo json_encode(['type' => 'success', 'message' => 'Profile updated successfully', 'admin' => $updatedAdmin]);
} else {
    echo json_encode(['type' => 'error', 'message' => 'Failed to update profile']);
}

function validateToken($token) {
    $decoded = json_decode(base64_decode($token), true);
    if (!$decoded) return null;
    return $decoded['admin_id'] ? $decoded : null;
}
?>
