<?php
include_once __DIR__ . '/../Administrator/header.php';
include_once __DIR__ . '/../config/connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = $_GET['id'];
    $sql = "SELECT * FROM car_customers WHERE customer_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $customer = $result->fetch_assoc();
        echo json_encode($customer);
    } else {
        echo json_encode([]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["customer_id"]) && isset($data["preference"])) {
        $customerId = $data["customer_id"];
        $preference = $data["preference"];

        $sql = "UPDATE car_customers SET preference = ? WHERE customer_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $preference, $customerId);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
    }
    exit;
}

echo json_encode(["status" => "error", "message" => "Unsupported request"]);
?>
