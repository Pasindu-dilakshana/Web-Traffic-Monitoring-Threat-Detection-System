# Containerized Web Traffic Monitoring and Threat Alert System
### Final Year Academic Project | 2026

---

## 1. Project Overview
This project involves the design and implementation of a real-time **Security Information and Event Management (SIEM)** tool tailored for web application protection. The system is engineered to monitor incoming HTTP traffic, identify sophisticated malicious patterns, and execute automated mitigation strategies through an integrated active defense mechanism.

By leveraging a modern full-stack architecture and **Docker containerization**, the system achieves high availability, scalability, and consistent performance across diverse deployment environments.

---

## 2. Core Features
* **Live Traffic Interception:** Real-time capturing and logging of request metadata, including source IP addresses, HTTP methods, and target URLs.
* **Heuristic Threat Detection:** A specialized "Threat Brain" module capable of identifying:
    * **SQL Injection (SQLi):** Detection of unauthorized database query manipulations.
    * **Cross-Site Scripting (XSS):** Identification of malicious script injection attempts.
    * **Brute Force Attacks:** Monitoring authentication endpoints for high-frequency failed login attempts.
    * **Path Traversal:** Detecting attempts to navigate beyond authorized server directories.
* **Active Defense System:** A proactive security layer that automatically blacklists malicious IP addresses upon detecting "Critical" threats or surpassing a defined "3-strikes" threshold.
* **Security Dashboard:** A high-fidelity, dark-mode administrative interface developed with React and Tailwind CSS, featuring real-time data filtering and visual incident alerts.

---

## 3. Technical Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js |

---

## 4. System Architecture
The application is architected as three primary microservices, orchestrated via Docker Compose:

1.  **Database Container:** A PostgreSQL instance responsible for the persistence of user credentials, traffic telemetry, and security blocklists.
2.  **API Container:** A Node.js backend environment managing core business logic, authentication, and the threat analysis engine.
3.  **Client Container:** A React-based frontend service delivering the monitoring dashboard and user interface.

---

## 5. Installation and Setup

### Prerequisites
* **Docker Desktop** (Installed and active)
* **Git** (For repository cloning)

### Execution Steps
1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd "network project 1/New folder"
    ```
2.  **Initialize Containers:**
    Run the following command in the project root to build and deploy the services:
    ```bash
    docker-compose up --build
    ```
3.  **Access the Environment:**
    * **Security Dashboard:** http://localhost:5173
    * **Backend API Service:** http://localhost:5000

---

## 6. Security Testing & Validation
To validate the system's detection and automated banning capabilities, you may simulate the following attack vectors:

* **SQL Injection:** http://localhost:5000/api/users?id=1' OR '1'='1
* **XSS Attack:** http://localhost:5000/api/search?query=<script>alert("hacked")</script>
* **Path Traversal:** http://localhost:5000/api/files?file=../../etc/passwd

---


admin1
superscretpassword