<?php
    include_once __DIR__ . '/../Administrator/header.php';
    include_once __DIR__ . '/../config/connection.php';    
    header('Content-Type: application/json');

    $res = ['error' => false];
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = isset($_POST['action']) ? $_POST['action'] : '';
        switch ($action) {
            case 'update':
                updateCustomer(); 
                break;
            case 'delete':
                deleteCustomer(); 
                break;
            default:
                echo json_encode(['type' => 'error', 'message' => 'Invalid action']);
                break;
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        fetchCustomers();
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Only POST and GET methods are allowed']);
    }

    function fetchCustomers(){
        global $conn;
        $result = $conn->query("SELECT * FROM car_customers");
        $customers = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(['type' => 'success', 'data' => $customers]);
    }

    function updateCustomer(){
        global $conn;
    
        $customer_id = $_POST['customer_id'] ?? '';
        $customer_name = $_POST['customer_name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $address = $_POST['address'] ?? '';
    
        $imageUpdated = false;
        $image = ''; // Initialize variable for image
    
        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
            $image = preg_replace("/[^A-Za-z0-9.\-_]/", "_", $_FILES['profile_image']['name']);
            $tmp_name = $_FILES['profile_image']['tmp_name'];
    
            $uploadDir = realpath(__DIR__ . '/../uploads');
            $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $image;
    
            if (!move_uploaded_file($tmp_name, $uploadPath)) {
                echo json_encode(['type' => 'error', 'message' => 'Failed to upload image']);
                return;
            }
    
            $imageUpdated = true;
        }
    
        if ($imageUpdated) {
            // Update the customer profile with the new image
            $stmt = $conn->prepare("UPDATE car_customers SET customer_name = ?, email = ?, phone = ?, address = ?, profile_image = ? WHERE customer_id = ?");
            $stmt->bind_param("sssssi", $customer_name, $email, $phone, $address, $image, $customer_id);
        } else {
            // Fetch the existing image if no new image is uploaded
            $result = $conn->prepare("SELECT profile_image FROM car_customers WHERE customer_id = ?");
            $result->bind_param("i", $customer_id);
            $result->execute();
            $result->bind_result($existingImage);
            $result->fetch();
            $result->close();
    
            $image = $existingImage ?: 'uni.jpg'; // Use existing or fallback to default image
    
            // Update customer profile without changing the image
            $stmt = $conn->prepare("UPDATE car_customers SET customer_name = ?, email = ?, phone = ?, address = ?, profile_image = ? WHERE customer_id = ?");
            $stmt->bind_param("sssssi", $customer_name, $email, $phone, $address, $image, $customer_id);
        }
    
        if ($stmt->execute()) {
            echo json_encode([
                'type' => 'success',
                'message' => 'Customer updated successfully',
                'profile_image' => $image // Return the image being used
            ]);
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Failed to update customer']);
        }
    
        $stmt->close();
    }    
        

        function deleteCustomer() {
            global $conn;
        
            $id = $_POST['customer_id'] ?? '';
            if (!$id) {
                echo json_encode(['type' => 'error', 'message' => 'Customers ID is required for deletion']);
                return;
            }
        
            $stmt = $conn->prepare("DELETE FROM car_customers WHERE customer_id=?");
            $stmt->bind_param("i", $id);
        
            if ($stmt->execute()) {
                echo json_encode(['type' => 'success', 'message' => 'Customers deleted successfully']);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to delete customers']);
            }
        
            $stmt->close();
        }
        
?>
