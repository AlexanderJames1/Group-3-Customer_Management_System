<?php
include_once __DIR__ . '/../Administrator/header.php';
include_once __DIR__ . '/../config/connection.php';

header("Content-Type: application/json");

$res = ['error' => false];
$data = json_decode(file_get_contents("php://input"), true);
$action = isset($data['action']) ? $data['action'] : '';

if (!$action) {
    echo json_encode([
        'type' => 'error',
        'message' => 'No action specified',
        'data' => $data
    ]);
    return;
}

switch ($action) {
    case 'login':
        loginAdmin($data);
        break;
    case 'signup':
        signUp($data);
        break;
    default:
        echo json_encode([
            'type' => 'error',
            'message' => 'Invalid action'
        ]);
        break;
}


function loginAdmin($data) {
    global $conn;

    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if ($email && $password) {
        $stmt = $conn->prepare("SELECT * FROM car_admins WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $admin = $result->fetch_assoc();

            if (password_verify($password, $admin['password'])) {
                $payload = [
                    'admin_id' => $admin['admin_id'] 
                ];
                $token = base64_encode(json_encode($payload));

                echo json_encode([
                    'type' => 'success',
                    'message' => 'Login successful',
                    'token' => $token,
                    'admin_id' => $admin['admin_id'],
                    'admin_name' => $admin['admin_name'],
                    'email' => $admin['email'],
                    'phone' => $admin['phone'],
                    'profile_image' => $admin['profile_image'],
                ]);                
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Invalid email or password']);
            }
        } else {
            echo json_encode(['type' => 'error', 'message' => 'No admin found with this email']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Please fill in all fields']);
    }
}


function signUp($data) {
    global $conn;

    $name = $data['admin_name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $phone = $data['phone'] ?? '';

    if ($name && $email && $phone && $password) {
        $hashedPass = password_hash($password, PASSWORD_DEFAULT);

        $defaultImage = 'uni.jpg'; 
        $stmt = $conn->prepare("INSERT INTO car_admins (admin_name, email, password, phone, profile_image) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $hashedPass, $phone, $defaultImage);

        if ($stmt->execute()) {
            $admin_id = $stmt->insert_id;
        
            $fetchStmt = $conn->prepare("SELECT * FROM car_admins WHERE admin_id = ?");
            $fetchStmt->bind_param("i", $admin_id);
            $fetchStmt->execute();
            $result = $fetchStmt->get_result();
            $admin = $result->fetch_assoc();
        
            $payload = ['admin_id' => $admin_id];
            $token = base64_encode(json_encode($payload));
        
            echo json_encode([
                'type' => 'success',
                'message' => 'Registration successful',
                'token' => $token,
                'admin_id' => $admin['admin_id'],
                'admin_name' => $admin['admin_name'],
                'email' => $admin['email'],
                'phone' => $admin['phone'],
                'profile_image' => $admin['profile_image'],
            ]);          
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Registration failed']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Please fill in all fields']);
    }
}

?>
