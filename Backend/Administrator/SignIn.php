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
        loginUser($data);
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


function loginUser($data) {
    global $conn;

    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if ($email && $password) {
        $stmt = $conn->prepare("SELECT * FROM car_customers WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            if (password_verify($password, $user['password'])) {
                $payload = [
                    'customer_id' => $user['customer_id'] 
                ];
                $token = base64_encode(json_encode($payload));

                echo json_encode([
                    'type' => 'success',
                    'message' => 'Login successful',
                    'token' => $token,
                    'customer_id' => $user['customer_id'],
                    'customer_name' => $user['customer_name'],
                    'email' => $user['email'],
                    'phone' => $user['phone'],
                    'address' => $user['address'], 
                    'profile_image' => $user['profile_image'],
                    'loyalty_points' => $user['loyalty_points'],
                    'preference' => $user['preference'],
                    'used_black_tier' => $user['used_black_tier']
                ]);                
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Invalid email or password']);
            }
        } else {
            echo json_encode(['type' => 'error', 'message' => 'No user found with this email']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Please fill in all fields']);
    }
}


function signUp($data) {
    global $conn;

    $name = $data['customer_name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $phone = $data['phone'] ?? '';
    $address = $data['address'] ?? '';

    if ($name && $email && $address && $phone && $password) {
        $hashedPass = password_hash($password, PASSWORD_DEFAULT);

        $defaultImage = 'uni.jpg'; 
        $stmt = $conn->prepare("INSERT INTO car_customers (customer_name, email, password, phone, address, profile_image) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $name, $email, $hashedPass, $phone, $address, $defaultImage);

        if ($stmt->execute()) {
            $customer_id = $stmt->insert_id;
        
            $fetchStmt = $conn->prepare("SELECT * FROM car_customers WHERE customer_id = ?");
            $fetchStmt->bind_param("i", $customer_id);
            $fetchStmt->execute();
            $result = $fetchStmt->get_result();
            $user = $result->fetch_assoc();
        
            $payload = ['customer_id' => $customer_id];
            $token = base64_encode(json_encode($payload));
        
            echo json_encode([
                'type' => 'success',
                'message' => 'Registration successful',
                'token' => $token,
                'customer_id' => $user['customer_id'],
                'customer_name' => $user['customer_name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'address' => $user['address'], 
                'profile_image' => $user['profile_image'],
                'loyalty_points' => $user['loyalty_points'],
                'preference' => $user['preference'],
                'used_black_tier' => $user['used_black_tier']
            ]);          
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Registration failed']);
        }
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Please fill in all fields']);
    }
}

?>
