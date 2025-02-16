# Simple Microservice-Based Stock and Employee Management System for Security Testing 

## Overview
This project is a **microservice-based management system** designed to handle **stock and employee** operations. It is built with a **scalable and secure architecture** to ensure efficient management of resources.

## Technologies Used
- **Backend**: Python (Flask), Node.js
- **Frontend**: Vue.js (TypeScript)
- **Database**: SQLite
- **Containerization**: Docker
- **Security Testing**: OWASP ZAP
- **Monitoring & Tracing**: Jaeger, Prometheus

## Architecture
The system consists of multiple microservices:
1. **Stock Service**: Manages inventory and product stock.
2. **Employee Service**: Handles employee data and roles.
3. **API Gateway**: Manages and secures API requests.
4. **Notification Service**: Sends alerts and updates.
5. **Order Service**: Manages customer orders.
6. **Customer Service**: Handles client interactions.

## Installation
### Prerequisites
- **Docker** (Ensure Docker is installed)
- **Node.js & npm** (For frontend dependencies)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/azahoumachraf/Microservices-Security
   cd Microservices-Security
   ```
2. Run the services using Docker:
   ```bash
   docker-compose up -d
   ```
3. Access the frontend at:
   ```
   http://localhost:5173/
   ```

## Security Considerations
- **Input Validation**: Prevent injection attacks.
- **Logging & Monitoring**: Use **Jaeger** , **Prometheus** , **Grafana** for insights.

## Future Enhancements
- Integration with **Kubernetes** for better scalability.
- Secure authentication using **OAuth2**.
- Improved logging with **ELK Stack**.

## License
This project is licensed under the MIT License.

