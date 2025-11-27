# Freelancer Marketplace

A full-stack freelancer marketplace with role-based access control, MongoDB database, Docker containerization, and Kubernetes deployment.

## Features

- **Role-Based Access Control**
  - Job Seeker (Freelancer): Can browse jobs, submit proposals
  - Worker Seeker (Employer): Can post jobs, review proposals

- **CRUD Operations**
  - Users: Register, login, update profile
  - Jobs: Create, read, update, delete
  - Proposals: Submit, review, accept/reject

- **Authentication**: JWT-based authentication
- **Database**: MongoDB with Mongoose ODM

## Project Structure

```
├── models/           # Mongoose models
├── routes/           # API routes
├── middleware/       # Authentication & authorization
├── k8s/             # Kubernetes manifests
├── Dockerfile       # Docker configuration
└── server.js        # Application entry point
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/freelancer-marketplace
JWT_SECRET=your-secret-key
```

3. Start MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

4. Run the application:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (worker_seeker only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Proposals
- `GET /api/proposals` - Get proposals
- `POST /api/proposals` - Submit proposal (job_seeker only)
- `PUT /api/proposals/:id` - Update proposal status (worker_seeker only)
- `DELETE /api/proposals/:id` - Delete proposal

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

## Docker Build

Build the Docker image:
```bash
docker build -t freelancer-marketplace:latest .
```

Run with Docker Compose (optional - create docker-compose.yml):
```bash
docker-compose up
```

## Kubernetes Deployment

1. Create namespace and deploy MongoDB:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
```

2. Create ConfigMap and Secret:
```bash
kubectl apply -f k8s/app-configmap.yaml
kubectl apply -f k8s/app-secret.yaml
```

3. Deploy the application:
```bash
kubectl apply -f k8s/app-deployment.yaml
```

4. Check deployment status:
```bash
kubectl get pods -n freelancer-marketplace
kubectl get services -n freelancer-marketplace
```

5. Access the application:
```bash
kubectl port-forward -n freelancer-marketplace service/freelancer-app 8080:80
```

## Example API Usage

### Register a Worker Seeker (Employer)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@example.com",
    "password": "password123",
    "name": "John Employer",
    "role": "worker_seeker"
  }'
```

### Register a Job Seeker (Freelancer)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "freelancer@example.com",
    "password": "password123",
    "name": "Jane Freelancer",
    "role": "job_seeker"
  }'
```

### Create a Job (as Worker Seeker)
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Build a Website",
    "description": "Need a modern website",
    "budget": 5000,
    "skills": ["React", "Node.js"]
  }'
```

### Submit a Proposal (as Job Seeker)
```bash
curl -X POST http://localhost:3000/api/proposals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "job": "JOB_ID",
    "coverLetter": "I am interested in this project",
    "proposedBudget": 4500
  }'
```

## Security Notes

- Change JWT_SECRET in production
- Use proper MongoDB authentication
- Enable HTTPS in production
- Implement rate limiting
- Add input validation

## License

MIT
