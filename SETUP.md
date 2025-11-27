# Setup Guide

## Prerequisites

Choose ONE of these options for MongoDB:

### Option A: Docker Desktop (Local Development)
1. Install Docker Desktop for Windows from https://www.docker.com/products/docker-desktop
2. Start Docker Desktop and wait for it to be ready
3. Run MongoDB:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### Option B: MongoDB Atlas (Cloud - No Docker)
1. Go to https://cloud.mongodb.com
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update `.env` file with your connection string

## Installation Steps

1. Install Node.js dependencies:
```bash
npm install
```

2. Update `.env` file with your MongoDB connection string

3. Start the application:
```bash
npm start
```

The server will run on http://localhost:3000

## Testing the API

### Register an Employer (Worker Seeker):
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"employer@test.com\",\"password\":\"pass123\",\"name\":\"John Employer\",\"role\":\"worker_seeker\"}"
```

### Register a Freelancer (Job Seeker):
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"freelancer@test.com\",\"password\":\"pass123\",\"name\":\"Jane Freelancer\",\"role\":\"job_seeker\"}"
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"employer@test.com\",\"password\":\"pass123\"}"
```

Save the token from the response and use it in subsequent requests.

## Docker Build (After fixing MongoDB)

```bash
docker build -t freelancer-marketplace:latest .
```

## Kubernetes Deployment

Make sure you have kubectl and a Kubernetes cluster (minikube, Docker Desktop K8s, or cloud provider).

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/app-configmap.yaml
kubectl apply -f k8s/app-secret.yaml
kubectl apply -f k8s/app-deployment.yaml
```

Check status:
```bash
kubectl get pods -n freelancer-marketplace
kubectl get services -n freelancer-marketplace
```

Access the app:
```bash
kubectl port-forward -n freelancer-marketplace service/freelancer-app 8080:80
```

Then visit http://localhost:8080
