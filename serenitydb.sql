-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2025 at 05:19 PM
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
-- Database: `serenitydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(20) UNSIGNED NOT NULL,
  `sinistre_id` int(20) UNSIGNED DEFAULT NULL,
  `nom_fichier` varchar(255) DEFAULT NULL,
  `type_document` varchar(50) DEFAULT NULL,
  `contenu_fichier` longblob DEFAULT NULL,
  `date_upload` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `sinistre_id`, `nom_fichier`, `type_document`, `contenu_fichier`, `date_upload`) VALUES
(6, 5, 'title', 'photo', '', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `expertises`
--

CREATE TABLE `expertises` (
  `id` int(20) UNSIGNED NOT NULL,
  `sinistre_id` int(20) UNSIGNED DEFAULT NULL,
  `expert_id` int(20) UNSIGNED DEFAULT NULL,
  `rapport` text DEFAULT NULL,
  `date_evaluation` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `expertises`
--

INSERT INTO `expertises` (`id`, `sinistre_id`, `expert_id`, `rapport`, `date_evaluation`) VALUES
(8, 5, 4, 'eww', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `experts`
--

CREATE TABLE `experts` (
  `id` int(20) UNSIGNED NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `spécialité` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `téléphone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `experts`
--

INSERT INTO `experts` (`id`, `nom`, `spécialité`, `email`, `téléphone`) VALUES
(4, 'jobard', 'cars', 'jobard@gmail.com', '22222');

-- --------------------------------------------------------

--
-- Table structure for table `paiements`
--

CREATE TABLE `paiements` (
  `id` int(20) UNSIGNED NOT NULL,
  `sinistre_id` int(20) UNSIGNED DEFAULT NULL,
  `montant` decimal(10,2) DEFAULT NULL,
  `date_paiement` date DEFAULT NULL,
  `méthode` varchar(50) DEFAULT NULL,
  `statut` varchar(30) DEFAULT 'en_attente'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `polices`
--

CREATE TABLE `polices` (
  `id` int(20) UNSIGNED NOT NULL,
  `numero_police` varchar(50) NOT NULL,
  `utilisateur_id` int(20) UNSIGNED DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `statut` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `polices`
--

INSERT INTO `polices` (`id`, `numero_police`, `utilisateur_id`, `type`, `date_debut`, `date_fin`, `statut`) VALUES
(4, '9', 9, 'jobard', '2025-03-04', '2025-05-03', 'd');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(20) UNSIGNED NOT NULL,
  `nom` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `nom`) VALUES
(6, 'client');

-- --------------------------------------------------------

--
-- Table structure for table `sinistres`
--

CREATE TABLE `sinistres` (
  `id` int(20) UNSIGNED NOT NULL,
  `utilisateur_id` int(20) UNSIGNED DEFAULT NULL,
  `police_id` int(20) UNSIGNED DEFAULT NULL,
  `date_declaration` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `statut` varchar(30) DEFAULT 'en_attente',
  `montant_requis` decimal(10,2) DEFAULT NULL,
  `montant_approuvé` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sinistres`
--

INSERT INTO `sinistres` (`id`, `utilisateur_id`, `police_id`, `date_declaration`, `type`, `description`, `statut`, `montant_requis`, `montant_approuvé`) VALUES
(5, 9, 4, '2025-03-03 22:00:00', 'jobard', 'dd', 'd', 122.00, 321.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(20) UNSIGNED NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `téléphone` varchar(20) DEFAULT NULL,
  `role_id` int(20) UNSIGNED DEFAULT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `mot_de_passe`, `téléphone`, `role_id`, `date_inscription`) VALUES
(9, 'jobard', 'jobard@gmail.com', '$2b$10$NPXQvvXpSxx2n.k.JZuUe.rPHu9sVehWzQeYH/3srZQbTWMipXxiG', '61863940', 6, '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `yaer` (`sinistre_id`);

--
-- Indexes for table `expertises`
--
ALTER TABLE `expertises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `yeor` (`sinistre_id`),
  ADD KEY `yeoer` (`expert_id`);

--
-- Indexes for table `experts`
--
ALTER TABLE `experts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `paiements`
--
ALTER TABLE `paiements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `yor` (`sinistre_id`);

--
-- Indexes for table `polices`
--
ALTER TABLE `polices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_police` (`numero_police`),
  ADD KEY `yoe` (`utilisateur_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sinistres`
--
ALTER TABLE `sinistres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sini` (`utilisateur_id`),
  ADD KEY `yo` (`police_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `expertises`
--
ALTER TABLE `expertises`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `experts`
--
ALTER TABLE `experts`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `paiements`
--
ALTER TABLE `paiements`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `polices`
--
ALTER TABLE `polices`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sinistres`
--
ALTER TABLE `sinistres`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `yaer` FOREIGN KEY (`sinistre_id`) REFERENCES `sinistres` (`id`);

--
-- Constraints for table `expertises`
--
ALTER TABLE `expertises`
  ADD CONSTRAINT `yeoer` FOREIGN KEY (`expert_id`) REFERENCES `experts` (`id`),
  ADD CONSTRAINT `yeor` FOREIGN KEY (`sinistre_id`) REFERENCES `sinistres` (`id`);

--
-- Constraints for table `paiements`
--
ALTER TABLE `paiements`
  ADD CONSTRAINT `yor` FOREIGN KEY (`sinistre_id`) REFERENCES `sinistres` (`id`);

--
-- Constraints for table `polices`
--
ALTER TABLE `polices`
  ADD CONSTRAINT `yoe` FOREIGN KEY (`utilisateur_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sinistres`
--
ALTER TABLE `sinistres`
  ADD CONSTRAINT `fk_sini` FOREIGN KEY (`utilisateur_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `yo` FOREIGN KEY (`police_id`) REFERENCES `polices` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
