-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2025 at 09:34 AM
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
-- Database: `nss-charusat`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigned_users`
--

CREATE TABLE `assigned_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `login_id` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assigned_users`
--

INSERT INTO `assigned_users` (`id`, `name`, `login_id`, `password_hash`, `email`, `contact`, `role_id`, `department_id`) VALUES
(113, 'Dr. NSS Program Coordinator', 'nss.pc@charusat.ac.in', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'nss.pc@charusat.ac.in', NULL, 1, NULL),
(114, 'NSS Head Student Coordinator', 'nss.hsc@charusat.ac.in', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'nss.hsc@charusat.ac.in', NULL, 4, NULL),
(213, 'Dhruv Rupapara', '23ec113', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ec113@charusat.edu.in', '1234567890', 3, 11),
(214, 'Diya Thakkar', '23Ec137', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ec137@charusat.edu.in', '2147483647', 3, 11),
(215, 'Arya Kayastha', '23CE055', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ce055@charusat.edu.in', '2147483647', 3, 1),
(216, 'Aarti Jain', '23ce045', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ce045@charusat.edu.in', '1234567890', 3, 1),
(217, 'Dhruvi Mahale', '22CS036', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22cs036@charusat.edu.in', '2147483647', 3, 3),
(218, 'Darsh Patel', '22cs051', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22cs051@charusat.edu.in', '2147483647', 3, 3),
(219, 'Dhruv Prajapati', '22IT126', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22it126@charusat.edu.in', '2147483647', 3, 2),
(220, 'Disha Shah', '22IT137', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22it137@charusat.edu.in', '2147483647', 3, 2),
(221, 'Nemish Sapara', '23AIML061', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23AIML061@charusat.edu.in', '2147483647', 3, 5),
(222, 'Kaushal Savaliya', '23AIML063', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23AIML063@charusat.edu.in', '2147483647', 3, 5),
(223, 'BHUNGALIYA JASH CHANDUBHAI', '23ME004', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ME004@charusat.edu.in', '2147483647', 3, 4),
(224, 'RATHOD JAYRAJ CHETANKUMAR', '23ME032', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ME032@charusat.edu.in', '2147483647', 3, 4),
(225, 'Azba Vohra', '24CL046', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '24cl046@charusat.edu.in', '2147483647', 3, 6),
(226, 'Soha Vohra', '24CL047', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '24cl047@charusat.edu.in', '2147483647', 3, 6),
(227, 'Desai Parin', '23EE006', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ee006@charusat.edu.in', '2147483647', 3, 7),
(228, 'Goyani Yukti', '23EE007', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23ee007@charusat.edu.in', '2147483647', 3, 7),
(229, 'Heet Vithalani', 'D24DCE144', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'D24DCE144@charusat.edu.in', '1234567890', 3, 1),
(230, 'Cheshta Ginoya', '23DCE034', '$2b$10$2zxz8ENBVsafR0zrMbvNOueiqUBXr3Tl1Rd.nQRfRxgjz9jyXu55.', '23DCE034@charusat.edu.in', '2147483647', 3, 1),
(231, 'Manan Monani', '23DCS063', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23DCS063@charusat.edu.in', '2147483647', 3, 3),
(232, 'Dhruvin Mangukiya', '23DCS059', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23DCS059@charusat.edu.in', '2147483647', 3, 3),
(233, 'Preet Chauhan', '22DIT008', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22dit008@charusat.edu.in', '2147483647', 3, 2),
(234, 'Bansi Kanani', '23DIT022', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23dit022@charusat.edu.in', '2147483647', 3, 2),
(235, 'PRIYANSHI JARIWALA', '22BPH017', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22bph017@charusat.edu.in', '2147483647', 3, 12),
(236, 'DHRUV GHELANI', '22BPH011', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22bph011@charusat.edu.in', '2147483647', 3, 12),
(237, 'Dhanshree Ramani', '24BBAB069', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '24bbab069@charusat.edu.in', '2147483647', 3, 13),
(238, 'Rushiprakash Patel', '24BBAB054', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '24bbab054@charusat.edu.in', '2147483647', 3, 13),
(239, 'Keshar Patel', '22bsc067', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22bsc067@charusat.edu.in', '2147483647', 3, 14),
(240, 'Parv Chittora', '23bsc058', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23bsc058@charusat.edu.in', '2147483647', 3, 14),
(241, 'Saloni Patel', '21BPT049', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '21bpt049@charusat.edu.in', '2147483647', 3, 15),
(242, 'Jay Rohit', '21BPT061', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '21bpt061@charusat.edu.in', '2147483647', 3, 15),
(243, 'Bansari U Patel', '24MSIT078', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '24msit078@charusat.edu.in', '2147483647', 3, 16),
(244, 'Lodaliya Utsav V', '23BSIT036', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23bsit036@charusat.edu.in', '2147483647', 3, 14),
(245, 'Nancy Patel', '22BSMT014', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '22bsmt014@charusat.edu.in', '2147483647', 3, 17),
(246, 'Prem Koradiya', '23MSMLT006', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23msmlt006@charusat.edu.in', '2147483647', 3, 14),
(247, 'yukta parmar', '21BN012', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '21bn012@charusat.edu.in', '2147483647', 3, 18),
(248, 'Mayur Maheshwari', '23BN014', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', '23bn014@charusat.edu.in', '2147483647', 3, 18),
(267, 'Dr. Sagar Kumar Patel', 'sagarpatel.ec', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'sagarpatel.ec@charusat.ac.in', '2147483647', 2, 11),
(268, 'Prof. Martin K. Parmar', 'martinparmar.ce', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'martinparmar.ce@charusat.ac.in', '2147483647', 2, 1),
(269, 'Prof. Pinal Hansora', 'pinalhansora.cse', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'pinalhansora.cse@charusat.ac.in', '2147483647', 2, 3),
(270, 'Prof. Rajnik S. Katriya', 'rajnikkatriya.it', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'rajnikkatriya.it@charusat.ac.in', '2147483647', 2, 2),
(271, 'Gaurav Kumar', 'gauravkumar.aiml', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'gauravkumar.aiml@charusat.ac.in', '2147483647', 2, 5),
(272, 'Satayu Travadi', 'satayutravadi.me', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'satayutravadi.me@charusat.ac.in', '2147483647', 2, 4),
(273, 'Prof. Megha Desai', 'meghadesai.cv', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'meghadesai.cv@charusat.ac.in', '2147483647', 2, 6),
(274, 'Ankur Patel', 'ankurpatel.ee', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'ankurpatel.ee@charusat.ac.in', '2147483647', 2, 7),
(275, 'Prof. Kashyap Patel', 'kashyappatel.dce', '$2b$10$T/HTqrL5rF2aRglf9jDnOuOfoYP9dBqyNTGeLVaHC7qpbFttfdOFS', 'kashyappatel.dce@charusat.ac.in', '2147483647', 2, 1),
(276, 'Prof. Gaurang Patel', 'gaurangpatel.dcs', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'gaurangpatel.dcs@charusat.ac.in', '2147483647', 2, 3),
(277, 'Prof. Hitesh Makwana', 'hiteshmakwana.dit', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'hiteshmakwana.dit@charusat.ac.in', '2147483647', 2, 2),
(278, 'Prof. Hardik Koria', 'hardikkoria.ph', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'hardikkoria.ph@charusat.ac.in', '2147483647', 2, 4),
(279, 'Dr. Poonam Amrutia', 'poonamamrutia.mba', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'poonamamrutia.mba@charusat.ac.in', '2147483647', 2, 5),
(280, 'Dr. Rajesh V. Savalia', 'rajeshsavalia.maths', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'rajeshsavalia.maths@charusat.ac.in', '2147483647', 2, 14),
(281, 'Dr. Shreya Swami', 'shreyaswami.phy', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'shreyaswami.phy@charusat.ac.in', '2147483647', 2, 15),
(282, 'Dr. Hardik Pandit', 'hardikpandit.mca', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'hardikpandit.mca@charusat.ac.in', '2147483647', 2, 16),
(283, 'Dr. Parth Thakor', 'parththakor.cips', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'parththakor.cips@charusat.ac.in', '2147483647', 2, 17),
(284, 'Ms. Hetal Shah', 'hetalshah.nur', '$2b$10$mGg.ACP4pxxOKtH9EU5Bi.tE8xuPAYucL3iOGAwLqha0/LNtbircC', 'hetalshah.nur@charusat.ac.in', '2147483647', 2, 18);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `institute_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `institute_id`) VALUES
(1, 'CE', 1),
(2, 'IT', 1),
(3, 'CSE', 1),
(4, 'ME', 2),
(5, 'AIML', 2),
(6, 'CL', 2),
(7, 'EE', 2),
(8, 'CSE', 2),
(9, 'IT', 2),
(10, 'CE', 2),
(11, 'EC', 2),
(12, 'RPCP', 4),
(13, 'BBA', 5),
(14, 'BSc', 3),
(15, 'BPT', 6),
(16, 'M.Sc.(IT)', 7),
(17, 'BSMT', 8),
(18, 'B.Sc. Nursing', 9);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `event_mode` enum('online','offline','hybrid') NOT NULL,
  `department_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('upcoming','completed') DEFAULT 'upcoming',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `event_name`, `event_date`, `event_mode`, `department_id`, `description`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(10, 'Demo', '2025-07-14', 'offline', 1, 'Demo', 'completed', 275, '2025-07-13 05:01:02', '2025-07-14 06:25:07'),
(12, 'Youur event', '2025-07-13', 'hybrid', 1, 'Test', 'completed', 275, '2025-07-13 05:38:17', '2025-07-13 05:38:17'),
(13, 'Test HSC', '2025-07-13', 'offline', 1, 'Test', 'completed', 275, '2025-07-13 08:46:09', '2025-07-13 08:46:09'),
(14, 'Testing', '2025-07-15', 'offline', 1, 'Demo', 'upcoming', 275, '2025-07-14 10:29:52', '2025-07-14 10:29:52');

-- --------------------------------------------------------

--
-- Table structure for table `event_reports`
--

CREATE TABLE `event_reports` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `submitted_by` varchar(255) NOT NULL,
  `submitted_by_id` int(11) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `comments` text DEFAULT 'No Comments',
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_reports`
--

INSERT INTO `event_reports` (`id`, `event_id`, `file_path`, `submitted_by`, `submitted_by_id`, `status`, `comments`, `approved_by`, `approved_at`, `created_at`, `updated_at`) VALUES
(11, 12, 'uploads\\reports\\report-1752410096081-406044238.docx', 'Heet Vithalani', 229, 'approved', 'Done', 275, '2025-07-13 12:36:55', '2025-07-13 12:34:56', '2025-07-13 12:36:55'),
(12, 13, 'uploads\\reports\\report-1752411599473-698628772.docx', 'NSS Head Student Coordinator', 114, 'approved', 'Yeah Proper\n', 275, '2025-07-13 13:05:59', '2025-07-13 12:59:59', '2025-07-13 13:05:59'),
(14, 10, 'uploads\\reports\\report-1752496637242-725040336.docx', 'Heet Vithalani', 229, 'approved', 'Done\n', 275, '2025-07-14 12:38:59', '2025-07-14 12:37:17', '2025-07-14 12:38:59');

-- --------------------------------------------------------

--
-- Table structure for table `institutes`
--

CREATE TABLE `institutes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `institutes`
--

INSERT INTO `institutes` (`id`, `name`) VALUES
(1, 'DEPSTAR'),
(2, 'CSPIT'),
(3, 'CMPICA'),
(4, 'RPCP'),
(5, 'I2IM'),
(6, 'PDPIAS'),
(7, 'ARIP'),
(8, 'BVM'),
(9, 'MTIN');

-- --------------------------------------------------------

--
-- Table structure for table `pc_events`
--

CREATE TABLE `pc_events` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `event_mode` enum('online','offline','hybrid') NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('upcoming','completed') DEFAULT 'upcoming',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pc_events`
--

INSERT INTO `pc_events` (`id`, `event_name`, `event_date`, `event_mode`, `description`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(4, 'University', '2025-07-13', 'offline', 'This is test', 'completed', 113, '2025-07-13 07:39:04', '2025-07-13 07:39:04');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'Program Coordinator'),
(2, 'Program Officer'),
(3, 'Student Coordinator'),
(4, 'Head Student Coordinator');

-- --------------------------------------------------------

--
-- Table structure for table `volunteers`
--

CREATE TABLE `volunteers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `adhar_no` varchar(20) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `dob` date NOT NULL,
  `department` varchar(100) NOT NULL,
  `year` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `added_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteers`
--

INSERT INTO `volunteers` (`id`, `name`, `adhar_no`, `gender`, `dob`, `department`, `year`, `email`, `contact`, `added_by`) VALUES
(5, 'Nevil Dhinoja', '123412341234', 'M', '2005-11-05', 'CE', '3', 'kashyappatel.dce@charusat.ac.in', '1234567890', 275),
(8, 'Demoo', '1234567890098', 'M', '2025-07-14', 'CE', '3', 'kashyappatel.dce@charusat.ac.in', '1234567890', 275),
(9, 'Test', '1234567890', 'M', '2025-07-14', 'CE', '3', 'kashyappatel.dce@gmail.com', '1234567890', 275);

-- --------------------------------------------------------

--
-- Table structure for table `working_hours`
--

CREATE TABLE `working_hours` (
  `id` int(11) NOT NULL,
  `login_id` varchar(50) NOT NULL,
  `activity_name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `hours` decimal(4,2) GENERATED ALWAYS AS (timestampdiff(MINUTE,`start_time`,`end_time`) / 60.0) STORED,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `description` text DEFAULT 'No Comments',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `working_hours`
--

INSERT INTO `working_hours` (`id`, `login_id`, `activity_name`, `date`, `start_time`, `end_time`, `status`, `description`, `created_at`, `department_id`) VALUES
(1, 'D24DCE144', 'dd', '2025-07-13', '09:48:00', '11:48:00', 'approved', 'df', '2025-07-13 04:18:10', 1),
(2, 'D24DCE144', 'pika', '2025-07-13', '09:49:00', '10:49:00', 'approved', 'no', '2025-07-13 04:19:10', 1),
(3, 'D24DCE144', 'Test Again', '2025-07-14', '11:27:00', '12:27:00', 'approved', 'hey', '2025-07-13 04:57:56', 1),
(4, '23DCE034', 'Test Report', '2025-07-14', '10:34:00', '11:34:00', 'approved', 'Text Goes here Bro', '2025-07-13 05:04:29', 1),
(5, 'D24DCE144', 'Dem', '2025-07-20', '15:39:00', '17:39:00', 'approved', 'Test', '2025-07-13 09:09:23', 1),
(6, 'D24DCE144', 'Demo Hours ', '2025-07-15', '16:02:00', '17:02:00', 'approved', 'Tree plantation', '2025-07-14 10:32:54', 1),
(7, 'D24DCE144', 'Hey', '2025-07-14', '21:21:00', '22:21:00', 'pending', 'Test', '2025-07-14 15:51:40', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_users`
--
ALTER TABLE `assigned_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `idx_contact` (`contact`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `institute_id` (`institute_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_events_department` (`department_id`),
  ADD KEY `idx_events_date` (`event_date`),
  ADD KEY `idx_events_status` (`status`),
  ADD KEY `idx_events_created_by` (`created_by`);

--
-- Indexes for table `event_reports`
--
ALTER TABLE `event_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_reports_event` (`event_id`),
  ADD KEY `idx_event_reports_status` (`status`),
  ADD KEY `idx_event_reports_submitted_by` (`submitted_by_id`),
  ADD KEY `idx_event_reports_approved_by` (`approved_by`);

--
-- Indexes for table `institutes`
--
ALTER TABLE `institutes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pc_events`
--
ALTER TABLE `pc_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `event_date` (`event_date`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `adhar_no` (`adhar_no`),
  ADD KEY `added_by` (`added_by`);

--
-- Indexes for table `working_hours`
--
ALTER TABLE `working_hours`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_login_id` (`login_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assigned_users`
--
ALTER TABLE `assigned_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=287;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `event_reports`
--
ALTER TABLE `event_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `pc_events`
--
ALTER TABLE `pc_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `volunteers`
--
ALTER TABLE `volunteers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `working_hours`
--
ALTER TABLE `working_hours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigned_users`
--
ALTER TABLE `assigned_users`
  ADD CONSTRAINT `assigned_users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `assigned_users_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`institute_id`) REFERENCES `institutes` (`id`);

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `assigned_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_reports`
--
ALTER TABLE `event_reports`
  ADD CONSTRAINT `event_reports_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_reports_ibfk_2` FOREIGN KEY (`submitted_by_id`) REFERENCES `assigned_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_reports_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `assigned_users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pc_events`
--
ALTER TABLE `pc_events`
  ADD CONSTRAINT `pc_events_created_by_fk` FOREIGN KEY (`created_by`) REFERENCES `assigned_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD CONSTRAINT `volunteers_ibfk_1` FOREIGN KEY (`added_by`) REFERENCES `assigned_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
