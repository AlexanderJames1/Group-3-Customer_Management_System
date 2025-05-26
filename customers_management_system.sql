-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2025 at 05:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `customers_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `car_admins`
--

CREATE TABLE `car_admins` (
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `profile_image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_admins`
--

INSERT INTO `car_admins` (`admin_id`, `admin_name`, `password`, `email`, `phone`, `profile_image`) VALUES
(1, 'admin', '$2y$10$0b6zkhB20ywWOTg4ATs.1.2qYYnE1Wo/kNrb0qVN8ITFuGN5iB6ei', 'admin@gmail.com', '940690546', '683026260c6f3_22ec41c0-05b3-451d-a877-9f6a8c65c3d1.jpg'),
(2, 'admin', '$2y$10$bfYZuCZ/2pGbHkmeOta17u5p8P2YpDHxFRUpKrqcIQyuPRTmkinJO', 'admin@gmail.com', '2147483647', 'uni.jpg'),
(3, 'admin2', '$2y$10$Kn92LKzolQHoEJMYXW/CIOFlojqjA9eKGTuQAJLYt7s7yrrQzz3ly', 'admin2@gmail.com', '2147483647', 'uni.jpg'),
(5, 'admin4', '$2y$10$LiLur3S3Rr1lrFRSyHg14O7Y3/pWCBHHV8zoRBi7KzpNxPPjrYzn.', 'admin4@gmail.com', '2147483647', '683021db64937_pngwing.com (24).png'),
(6, 'admin4', '$2y$10$m5LQstOX11m3Lm/myKfkdeG2Y6Z00W3kFIE/HI2eHkFVNArkJx0WC', 'admin4@gmail.com', '2147483647', 'uni.jpg'),
(7, 'admin4', '$2y$10$Xp/n06.1v1ojWuwkRSm5yu6LkIK20FLEvnu7hnuNa5.OMRBiiIj9q', 'admin4@gmail.com', '985656404', '68301b5638dae_pngwing.com (27).png'),
(8, 'admin6', '$2y$10$jbzAGMpNyK/CufmGb11sh.wvp94/i8esi5sTZOwg.eAtDtIrFmv9S', 'admin6@gmail.com', '2147483647', 'uni.jpg'),
(9, 'admin7', '$2y$10$eklMysSLCLZ/dxq/Wuzrt.lPWLEOjFuyvnhF/tvtOB640TE7r0/mu', 'admin7@gmail.com', '987654321', 'uni.jpg'),
(10, 'admin10', '$2y$10$Q1IP9j9USX.KQBsiShmx9eL.NlKZ2fEV/H3CMr57dwsYnHgLfZbUS', 'admin10@gmail.com', '09876543212', '68316515e31e8_db62688f-0472-44b9-aab5-ca550762ffaa.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `car_customers`
--

CREATE TABLE `car_customers` (
  `customer_id` int(100) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `profile_image` varchar(250) NOT NULL,
  `loyalty_points` int(11) DEFAULT 0,
  `preference` varchar(100) NOT NULL,
  `used_black_tier` tinyint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_customers`
--

INSERT INTO `car_customers` (`customer_id`, `customer_name`, `email`, `password`, `phone`, `address`, `profile_image`, `loyalty_points`, `preference`, `used_black_tier`) VALUES
(85, 'Aldin', 'edin@gmail.com', '$2y$10$yd69qTgRDh0LQkvS/0.Mf.kQbKDutw8DOB8kl7sQ89UwYLCDxpkLy', '09494949440', 'Sorsogon', 'tongue_out_alden.jpg', 110, 'Gears, Fuels', 0),
(87, 'bumbleboy', 'New3@gmail.com', '$2y$10$pgYok4m4mpPNdOZNV0KgWOjT0M4lXMiObxQmJtR31lW8TN.b5fHJu', '09393343334', 'Dasma', 'f619d639-2416-49da-b84e-27e3df0829e5.jpg', 100690, 'Gears', 1),
(92, 'Fabe', 'New2@gmail.com', '$2y$10$fhehImTr.P/gWQvheOWt..tkbcpVCSd/KxnURhPz.N0O.OZZ89DRe', '09564534534', 'New York', 'db62688f-0472-44b9-aab5-ca550762ffaa.jpg', 21424841, 'Engine Parts', 1),
(94, 'Ishow4', 'New4@gmail.com', '$2y$10$yymgwa4fs531NzLEo3H.je1ONQwgrIqek3yviTzrXY6yvq1SZrmrG', '09493434343', 'State', '_guy.jpg', 550, 'Fuel & Fluids', 0),
(95, 'Caury Jane', 'New5@gmail.com', '$2y$10$DqVY7Khsab5b3tRJWvyuWefLdVhUgjJUXXDBwVlbHeFwFu6c0WlH.', '09393434343', 'Tokyo', '32a248a5-371c-446d-b59d-715fae758cba.jpg', 600000, 'Accessories', 0),
(96, 'New7', 'New7@gmail.com', '$2y$10$SdDgUXcrkKYdsYx0IX0v9uOGH4EUTEubXbNikkw9QOFOLZmzcaS1C', '09345353534', 'New7', 'uni.jpg', 0, 'Engine Parts', 0),
(97, 'Name', 'Name@gmail.com', '$2y$10$bM8tQUvkc2HqpFKBGo8HkeTJqSYleZf/.2iqVMUB/nmbNgzYI8P66', '09858534399', 'New', 'uni.jpg', 4000, 'Apparel, Gears', 0),
(98, 'Name2', 'Name2@gmail.com', '$2y$10$kb6KYXCOwzJHhh.F7A4N8.AFdAW9uy.wa0SjGGg1wIWqKj7QewFHO', '09329934343', 'Name2', 'uni.jpg', 0, 'Gears, Apparel, Car', 0),
(99, 'Name3', 'Name3@gmail.com', '$2y$10$Z.t5FeT69kOgBoTh1L4wCOwzIl55.p.fAKoBO798Gbhf5hAFyz9sa', '09234234324', 'Name3', 'uni.jpg', 100, 'Car, Accessories', 0);

-- --------------------------------------------------------

--
-- Table structure for table `car_orders`
--

CREATE TABLE `car_orders` (
  `order_id` int(11) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `payment_method` varchar(50) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `customer_id` int(100) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_orders`
--

INSERT INTO `car_orders` (`order_id`, `brand`, `model`, `quantity`, `payment_method`, `full_name`, `address`, `city`, `phone`, `order_date`, `customer_id`, `product_id`) VALUES
(156, 'Car Keys', 'keys', 7, 'cod', 'New', 'sdkfj', 'Sorsogon', '09495955544', '2025-05-17 21:44:26', 80, 24),
(157, 'Car Keys', 'keys', 5, 'cod', 'New', 'sdkfj', 'Sorsogon', '09495955544', '2025-05-17 21:45:45', 80, 24),
(158, 'Car Keys', 'keys', 1, 'cod', 'New', 'sdkfj', 'Sorsogon', '09495955544', '2025-05-17 21:46:10', 80, 24),
(159, 'Phone Holder', 'Phone holder', 1, 'cod', 'New', 'sdkfj', 'Sorsogon', '09495955544', '2025-05-17 21:47:34', 80, 23),
(160, 'Phone Holder', 'Phone holder', 1, 'cod', 'New', 'sdkfj', 'Sorsogon', '09495955544', '2025-05-17 21:56:01', 80, 23),
(161, 'Phone Holder', 'Phone holder', 1, 'paypal', 'New', 'sdkfj', 'Sorsogon6', '09495955544', '2025-05-17 21:56:46', 80, 23),
(162, 'Car Keys', 'keys', 20, 'credit_card', 'New3', 'cb', 'Sorsogon', '0959595955', '2025-05-17 22:14:38', 82, 24),
(163, 'Car Keys', 'keys', 5, 'cod', 'New3', 'cb', 'Sorsogon', '0959595955', '2025-05-17 22:16:33', 82, 24),
(164, 'Car Keys', 'keys', 10, 'cod', 'New3', 'cb', 'Sorsogon', '0959595955', '2025-05-17 22:17:05', 82, 24),
(165, 'BMW', 'JT5', 1, 'cod', 'New4', 'kdskkdk', 'Sorsogon', '094848585858', '2025-05-18 11:07:39', 83, 25),
(166, 'Car Keys', 'keys', 5, 'cod', 'New4', 'kdskkdk', 'Sorsogon', '094848585858', '2025-05-18 11:07:55', 83, 24),
(167, 'Ferrari', '555', 3, 'credit_card', 'New4', 'kdskkdk', 'Sorsogon6', '094848585858', '2025-05-18 11:08:34', 83, 20),
(168, 'Car Keys', 'keys', 1, 'cod', 'New4', 'kdskkdk', 'Sorsogon', '094848585858', '2025-05-18 11:08:56', 83, 24),
(169, 'Car Keys', 'keys', 1, 'cod', 'New4', 'kdskkdk', 'Sorsogon', '094848585858', '2025-05-18 12:11:45', 83, 24),
(170, 'Ferrari', 'VJET', 1, 'cod', 'New2', 'gcnhfcgnbv', 'Sorsogon6', '09399494994', '2025-05-19 22:58:28', 81, 18),
(171, 'StarWars', 'gear', 2, 'cod', 'New', 'Sorsogon', 'Sorsogon6', '09494949440', '2025-05-20 00:47:52', 85, 39),
(172, 'BMW', 'JT5', 1, 'cod', 'New', 'Sorsogon', 'Sorsogon6', '09494949440', '2025-05-20 00:48:11', 85, 25),
(173, 'BMW', 'dddddd', 1, 'cod', 'New2', 'New2', 'Sorsogon', '09494954534', '2025-05-20 00:50:43', 86, 22),
(174, 'Ferrari', '555', 3, 'paypal', 'Caury Jane', 'Tokyo', 'Sorsogon', '09393434343', '2025-05-20 07:54:25', 95, 20),
(175, 'Watch', 'Mi', 30, 'cod', 'Ishow4', 'State', 'Albay', '09493434343', '2025-05-20 08:07:02', 94, 33),
(176, 'gear chain', 'chain', 12, 'cod', 'bumbleboy', 'Dasma', 'Sorsogon7', '09393343334', '2025-05-20 08:13:07', 87, 42),
(177, 'Ferrari', '555', 1, 'cod', 'bumbleboy', 'Dasma', 'Sorsogon8', '09393343334', '2025-05-20 08:13:27', 87, 20),
(178, 'BMW', 'dddddd', 1, 'cod', 'Fabe', 'New York', 'Sorsogon7', '09564534534', '2025-05-20 08:19:15', 92, 22),
(179, 'Jacket C', 'Car J', 1, 'paypal', 'Fabe', 'New York', 'Albay', '09564534534', '2025-05-20 08:20:19', 92, 35),
(180, 'Black Jack', 'jk', 1, 'credit_card', 'Aldin', 'Sorsogon', 'Sorsogon', '09494949440', '2025-05-20 09:39:14', 85, 40),
(181, 'Jacket C', 'Car J', 3, 'cod', 'bumbleboy', 'Dasma', 'Albay', '09393343334', '2025-05-20 09:47:19', 87, 35),
(182, 'StarWars', 'gear', 2, 'credit_card', 'Name', 'New', 'Albay', '09858534399', '2025-05-20 10:23:39', 97, 39),
(183, 'Castrol', 'GTX', 1, 'credit_card', 'bumbleboy', 'Dasma', 'Sorsogon6', '09393343334', '2025-05-20 10:27:45', 87, 26),
(184, 'Ferrari', 'VJET2', 1, 'cod', 'bumbleboy', 'Dasma', 'Albay', '09393343334', '2025-05-20 10:28:18', 87, 18),
(185, 'Red BULL', 'Nova', 2, 'credit_card', 'bumbleboy', 'Dasma', 'Sorsogon8', '09393343334', '2025-05-24 14:28:39', 87, 36),
(186, 'Gear pods', 'pods', 1, 'cod', 'bumbleboy', 'Dasma', 'Sorsogon', '09393343334', '2025-05-24 14:29:09', 87, 32),
(187, 'Gear pods', 'pods', 1, 'cod', 'Aldin', 'Sorsogon', 'Sorsogon', '09494949440', '2025-05-24 14:32:44', 85, 32),
(188, 'Jacket C', 'Car J', 7, 'cod', 'Aldin', 'Sorsogon', 'Sorsogon', '09494949440', '2025-05-24 14:43:47', 85, 35),
(189, 'Red BULL', 'Nova', 4, 'cod', 'Aldin', 'Sorsogon', 'Sorsogon', '09494949440', '2025-05-24 14:44:12', 85, 36),
(190, 'Ferrari', 'VJET2', 10, 'cod', 'Name3', 'Name3', 'Sorsogon', '09234234324', '2025-05-24 15:26:59', 99, 18),
(191, 'Adaptor', '555', 20, 'credit_card', 'Name3', 'Name3', 'Sorsogon', '09234234324', '2025-05-24 15:27:47', 99, 43),
(192, 'Tire', 'JT5', 4, 'cod', 'Ishow4', 'State', 'Sorsogon', '09493434343', '2025-05-24 15:57:13', 94, 37),
(193, 'Castrol', 'GTX', 5, 'cod', 'Ishow4', 'State', 'Sorsogon', '09493434343', '2025-05-24 15:57:45', 94, 26);

-- --------------------------------------------------------

--
-- Table structure for table `car_products`
--

CREATE TABLE `car_products` (
  `product_id` int(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `descriptions` varchar(100) NOT NULL,
  `price` int(100) NOT NULL,
  `stock_quantity` int(100) NOT NULL,
  `image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_products`
--

INSERT INTO `car_products` (`product_id`, `category`, `brand`, `model`, `descriptions`, `price`, `stock_quantity`, `image`) VALUES
(18, 'Apparel', 'Ferrari', 'VJET2', 'Newest shirts', 500, 790, 'Scuderia-Ferrari-Team-Varsity-Jacket-Men.avif'),
(20, 'Car', 'Ferrari', '555', 'dg', 20000000, 110, 'pngwing.com__3_.png'),
(22, 'Car', 'BMW', 'dddddd', 'kjoohl', 2147483647, 502, 'pngwing.com.png'),
(23, 'Accessories', 'Phone Holder', 'Phone holder', 'nkd', 200, 53, 'pngwing.com__8_.png'),
(24, 'Accessories', 'Car Keys', 'keys', 'new release', 1000, 29, 'pngwing.com__9_.png'),
(25, 'Car', 'BMW', 'JT5', 'Newest', 200000, 2, 'pngwing.com__2_.png'),
(26, 'Fuel & Fluids', 'Castrol', 'GTX', 'Newest', 1000, 994, 'pngwing.com__10_.png'),
(27, 'Fuel & Fluids', 'Castrol', 'Magnatec', 'Newest', 1200, 200, 'pngwing.com__11_.png'),
(28, 'Fuel & Fluids', 'Mobil', 'Super', 'Newest', 500, 2000, 'pngwing.com__12_.png'),
(29, 'Engine Parts', 'SawG', 'High', 'mech', 5500, 100, 'pngwing.com__13_.png'),
(30, 'Engine Parts', 'Engine2019', 'AT5', 'fast', 50000, 200, 'pngwing.com__14_.png'),
(31, 'Engine Parts', 'Termine', 'AN', 'Newest', 200000, 50, 'pngwing.com__15_.png'),
(32, 'Gears', 'Gear pods', 'pods', 'gear nee pods', 2000, 19998, 'pngwing.com__16_.png'),
(33, 'Accessories', 'Watch', 'Mi', 'nn', 1000, 99970, 'pngwing.com__17_.png'),
(34, 'Gears', 'Gear Premium pad', '3A', 'Premium', 25000, 1000, 'pngwing.com__18_.png'),
(35, 'Apparel', 'Jacket C', 'Car J', 'Jacket for Car', 500, 489, 'pngwing.com__20_.png'),
(36, 'Apparel', 'Red BULL', 'Nova', 'high mech', 2500, 194, 'pngwing.com__21_.png'),
(37, 'Accessories', 'Tire', 'JT5', 'Newest', 5000, 1996, 'pngwing.com__22_.png'),
(39, 'Gears', 'StarWars', 'gear', 'limited edition', 200000, 1, 'pngwing.com__24_.png'),
(40, 'Apparel', 'Black Jack', 'jk', 'Jacket for Car', 1000, 99, 'pngwing.com__25_.png'),
(41, 'Accessories', 'BMW chain', 'key', 'key chain', 1000, 500, 'pngwing.com__26_.png'),
(42, 'Accessories', 'gear chain', 'chain', 'key chain', 5000, 38, 'pngwing.com__27_.png'),
(43, 'Accessories', 'Adaptor', '555', 'dg', 500, 2980, 'pngwing.com__23_.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_admins`
--
ALTER TABLE `car_admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `car_customers`
--
ALTER TABLE `car_customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `car_orders`
--
ALTER TABLE `car_orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_product_id` (`product_id`);

--
-- Indexes for table `car_products`
--
ALTER TABLE `car_products`
  ADD PRIMARY KEY (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_admins`
--
ALTER TABLE `car_admins`
  MODIFY `admin_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `car_customers`
--
ALTER TABLE `car_customers`
  MODIFY `customer_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `car_orders`
--
ALTER TABLE `car_orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=194;

--
-- AUTO_INCREMENT for table `car_products`
--
ALTER TABLE `car_products`
  MODIFY `product_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `car_orders`
--
ALTER TABLE `car_orders`
  ADD CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `car_products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
