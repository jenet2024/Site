
# 🚀 Projet Signalements Parking

Ce projet est une application web permettant de **signaler des problèmes sur des parkings** et de les visualiser sur une carte interactive.  
Le frontend est développé en **React**, et le backend en **PHP/MySQL** hébergé via **XAMPP**.

---

## 📋 Prérequis

### Frontend (React)
- Node.js (>= 18 recommandé)
- npm ou yarn
- React Router (pour la navigation)
- React Leaflet (pour la carte)
- Un navigateur moderne (Chrome, Firefox, Edge)

### Backend (PHP / MySQL)
- XAMPP installé (Apache + MySQL)
- PHP >= 8.0
- Base de données MySQL avec une table `users` et une table `reports`
- Fichiers PHP placés dans le dossier `htdocs` de XAMPP (ex: `C:\xampp\htdocs\backend`)

---

## ⚙️ Installation

### 1. Backend (XAMPP)
1. Installer XAMPP et démarrer **Apache** et **MySQL**.
2. Créer une base de données `parking_db` dans phpMyAdmin.
3. Importer les tables nécessaires :
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100),
     street VARCHAR(100),
     city VARCHAR(100),
     postalCode VARCHAR(20),
     email VARCHAR(100) UNIQUE,
     password VARCHAR(255)
   );

   CREATE TABLE reports (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     title VARCHAR(255),
     description TEXT,
     latitude DOUBLE,
     longitude DOUBLE,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );

### Repartition Projet
- qui fais le Diagramme de Cas D'utilisation, 
- qui fais le mcd
- les qui font le Diagramme D'activité,
- les qui font la Maquette
- les qui font le Wiregrame
- qui fais la structure du site
- les qui font le backend
- les qui font le frontEnd 
- PHP >= 8.0


---

# Site
 
