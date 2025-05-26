<?php
include_once __DIR__ . '/../Administrator/header.php';
include_once __DIR__ . '/../config/connection.php';    
header('Content-Type: application/json');

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['customer_id'], $data['reward_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);
    exit;
}

$customer_id = intval($data['customer_id']);
$reward_id = intval($data['reward_id']);

// Fetch customer's current points
$customerQuery = $conn->prepare("SELECT loyalty_points FROM car_customer WHERE customer_id = ?");
$customerQuery->bind_param("i", $customer_id);
$customerQuery->execute();
$customerResult = $customerQuery->get_result();

if ($customerResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Customer not found."
    ]);
    exit;
}

$customer = $customerResult->fetch_assoc();
$currentPoints = $customer['loyalty_points'];

// Fetch reward details
$rewardQuery = $conn->prepare("SELECT points_required FROM rewards WHERE id = ?");
$rewardQuery->bind_param("i", $reward_id);
$rewardQuery->execute();
$rewardResult = $rewardQuery->get_result();

if ($rewardResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Reward not found."
    ]);
    exit;
}

$reward = $rewardResult->fetch_assoc();
$pointsRequired = $reward['points_required'];

if ($currentPoints < $pointsRequired) {
    echo json_encode([
        "success" => false,
        "message" => "Not enough loyalty points."
    ]);
    exit;
}

// Deduct points
$newPoints = $currentPoints - $pointsRequired;
$updateQuery = $conn->prepare("UPDATE car_customer SET loyalty_points = ? WHERE customer_id = ?");
$updateQuery->bind_param("ii", $newPoints, $customer_id);

if ($updateQuery->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Reward redeemed successfully.",
        "newPoints" => $newPoints
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to redeem reward."
    ]);
}
?>
