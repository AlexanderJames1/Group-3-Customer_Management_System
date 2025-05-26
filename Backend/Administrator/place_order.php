<?php
include_once __DIR__ . '/../Administrator/header.php';
include_once __DIR__ . '/../config/connection.php';

header('Content-Type: application/json');

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// If only checking voucher usage
if (isset($data['check_black_tier']) && $data['check_black_tier'] && isset($data['customer_id'])) {
    $stmt = $conn->prepare("SELECT used_black_tier FROM car_customers WHERE customer_id = ?");
    $stmt->bind_param("i", $data['customer_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $voucherData = $result->fetch_assoc();

    if ($voucherData['used_black_tier']) {
        echo json_encode(["success" => false, "message" => "Black Tier voucher already used."]);
    } else {
        echo json_encode(["success" => true, "message" => "Black Tier voucher is available."]);
    }
    exit;
}

// Fetch customer data if only customer_id is sent
if (isset($data['customer_id']) && count($data) === 1) {
    $customer_id = $data['customer_id'];

    $stmt = $conn->prepare("SELECT * FROM car_customers WHERE customer_id = ?");
    $stmt->bind_param("i", $customer_id);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode([
                "success" => true,
                "user" => $user
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "User not found"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Query failed"
        ]);
    }

    $stmt->close();
    $conn->close();
    exit;
}
    error_log(print_r($data, true)); // Logs to Apache or PHP error log
if (
    isset($data['customer_id']) &&
    isset($data['car_id']) &&
    isset($data['quantity']) &&
    isset($data['payment_method']) &&
    isset($data['shipping_info']) &&
    isset($data['updated_loyalty_points'])
) {
    $customer_id = $data['customer_id'];
    $car_id = $data['car_id'];
    $quantity = $data['quantity'];
    $payment_method = $data['payment_method'];
    $shipping = $data['shipping_info'];
    $updated_loyalty_points = $data['updated_loyalty_points']; 

       // Read brand and model from incoming data
    $brand = $data['brand'] ?? '';
    $model = $data['model'] ?? '';

    // 1.  car exists and get stock
    $stmt = $conn->prepare("SELECT stock_quantity, price FROM car_products WHERE product_id = ?");
    $stmt->bind_param("i", $car_id);
    $stmt->execute();   
    $result = $stmt->get_result();
    $car = $result->fetch_assoc();

    if (!$car) {
        echo json_encode(["success" => false, "message" => "Car not found"]);
        exit;
    }

    // 2. Deduct the loyalty points from the user and update the database
    $stmt = $conn->prepare("UPDATE car_customers SET loyalty_points = ? WHERE customer_id = ?");
    $stmt->bind_param("ii", $updated_loyalty_points, $customer_id);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to update loyalty points."]);
        exit;
    }

    if ($car['stock_quantity'] < $quantity)     {
        echo json_encode(["success" => false, "message" => "Not enough stock"]);
        exit;
    }

    // Check if Black Tier was used
    if (isset($data['voucher']) && $data['voucher'] === 'Black Tier') {
        $stmt = $conn->prepare("SELECT used_black_tier FROM car_customers WHERE customer_id = ?");
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $voucherData = $result->fetch_assoc();

        if ($voucherData['used_black_tier']) {
            echo json_encode(["success" => false, "message" => "Black Tier voucher already used."]);
            exit;
        }
    }

    // 2. Check if customer exists
    $stmt = $conn->prepare("INSERT INTO car_orders (brand, model, quantity, payment_method, full_name, address, city, phone, order_date, customer_id, product_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)");
    $stmt->bind_param(
        "ssisssssii",
        $brand,
        $model,
        $quantity,
        $payment_method,
        $shipping['fullName'],
        $shipping['address'],
        $shipping['city'],
        $shipping['phone'],
        $customer_id,
        $car_id
    );

      if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Failed to place order", "error" => $stmt->error]);
        exit;
    }    

    // 3. Update car stock
    $stmt = $conn->prepare("UPDATE car_products SET stock_quantity = stock_quantity - ? WHERE product_id = ?");
    $stmt->bind_param("ii", $quantity, $car_id);
    $stmt->execute();

     // 4. Calculate and update loyalty points
     $total_price = $car['price'] * $quantity;  
     $points_earned = floor($total_price / 100);
 
     $stmt = $conn->prepare("UPDATE car_customers SET loyalty_points = loyalty_points + ? WHERE customer_id = ?");
     $stmt->bind_param("ii", $points_earned, $customer_id);
     $stmt->execute();

     // 5. Retrieve updated loyalty points
     $stmt = $conn->prepare("SELECT loyalty_points FROM car_customers WHERE customer_id = ?");
     $stmt->bind_param("i", $customer_id);
     $stmt->execute();
     $result = $stmt->get_result();
     $customer = $result->fetch_assoc();

     // Mark Black Tier as used if applied
    if (isset($data['voucher']) && $data['voucher'] === 'Black Tier') {
        $stmt = $conn->prepare("UPDATE car_customers SET used_black_tier = 1 WHERE customer_id = ?");
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
    }
 
     echo json_encode([
        "success" => true,
        "points_earned" => $points_earned,
        "loyalty_points" => $customer['loyalty_points']
     ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}
