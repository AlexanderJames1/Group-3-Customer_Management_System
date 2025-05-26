<?php
    include_once __DIR__ . '/../Administrator/header.php';
    include_once __DIR__ . '/../config/connection.php';    
    header('Content-Type: application/json');

    $res = ['error' => false];
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = isset($_POST['action']) ? $_POST['action'] : '';
        switch ($action) {
            case 'insert':
                insertProduct();
                break;
            case 'update':
                updateProduct(); 
                break;
            case 'delete':
                deleteProduct(); 
                break;
            default:
                echo json_encode(['type' => 'error', 'message' => 'Invalid action']);
                break;
        }
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        fetchProducts();
    } else {
        echo json_encode(['type' => 'error', 'message' => 'Only POST and GET methods are allowed']);
    }

    function insertProduct(){
        global $conn;
        
        $category = $_POST['category'] ?? '';
        $brand = $_POST['brand'] ?? '';
        $model = $_POST['model'] ?? '';
        $description = $_POST['descriptions'] ?? '';
        $price = $_POST['price'] ?? '';
        $stocks = $_POST['stock_quantity'] ?? '';
        $image = preg_replace("/[^A-Za-z0-9.\-_]/", "_", $_FILES['image']['name']);
        $tmp_name = $_FILES['image']['tmp_name'];

        $uploadDir = realpath(__DIR__ . '/../uploads'); 
                $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $image;

        if (move_uploaded_file($tmp_name, $uploadPath)) {
            $stmt = $conn->prepare("INSERT INTO car_products (category, brand, model, descriptions, price, stock_quantity, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssdis", $category, $brand, $model, $description, $price, $stocks, $image);

            if ($stmt->execute()) {
                echo json_encode(['type' => 'success', 'message' => 'Product inserted successfully']);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to insert product']);
            }
            $stmt->close();
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Failed to upload image']);
        }
    }

    function fetchProducts(){
        global $conn;
        $result = $conn->query("SELECT * FROM car_products");
        $products = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode(['type' => 'success', 'data' => $products]);
    }

    function updateProduct(){
        global $conn;

            $id = $_POST['product_id'] ?? '';
            $category = $_POST['category'] ?? '';
            $brand = $_POST['brand'] ?? '';
            $model = $_POST['model'] ?? '';
            $description = $_POST['descriptions'] ?? '';
            $price = $_POST['price'] ?? '';
            $stocks = $_POST['stock_quantity'] ?? '';
            
            $imageUpdated = false;
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $image = preg_replace("/[^A-Za-z0-9.\-_]/", "_", $_FILES['image']['name']);
                $tmp_name = $_FILES['image']['tmp_name'];
                
                $uploadDir = realpath(__DIR__ . '/../uploads'); 
                $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $image;
            
                if (!move_uploaded_file($tmp_name, $uploadPath)) {
                    echo json_encode(['type' => 'error', 'message' => 'Failed to upload image']);
                    return;
                }

                $imageUpdated = true;
            }
        
            if ($imageUpdated) {
                $stmt = $conn->prepare("UPDATE car_products SET category=?, brand=?, model=?, descriptions=?, price=?, stock_quantity=?, image=? WHERE product_id=?");
                $stmt->bind_param("ssssdiss", $category, $brand, $model, $description, $price, $stocks, $image, $id);
            } else {
                $stmt = $conn->prepare("UPDATE car_products SET category=?, brand=?, model=?, descriptions=?, price=?, stock_quantity=? WHERE product_id=?");
                $stmt->bind_param("ssssdis", $category, $brand, $model, $description, $price, $stocks, $id);
            }            
        
            if ($stmt->execute()) {
                echo json_encode(['type' => 'success', 'message' => 'Product updated successfully']);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to update product']);
            }
        
            $stmt->close();
        }
        

        function deleteProduct() {
            global $conn;
        
            $id = $_POST['product_id'] ?? '';
            if (!$id) {
                echo json_encode(['type' => 'error', 'message' => 'Product ID is required for deletion']);
                return;
            }
        
            $stmt = $conn->prepare("DELETE FROM car_products WHERE product_id=?");
            $stmt->bind_param("i", $id);
        
            if ($stmt->execute()) {
                echo json_encode(['type' => 'success', 'message' => 'Product deleted successfully']);
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Failed to delete product']);
            }
        
            $stmt->close();
        }
        
?>
