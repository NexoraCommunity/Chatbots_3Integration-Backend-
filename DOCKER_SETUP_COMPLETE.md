# ✅ Docker Setup Complete! 

Your NestJS ChatBot application is now running in Docker with all required services.

## 🎯 What's Running

| Service | Container Name | Port | Status |
|---------|---------------|------|--------|
| **Main App** | `chatbot-app` | 8080 | ✅ Running |
| **Worker** | `chatbot-worker` | - | ✅ Running  |
| **PostgreSQL** | `chatbot-postgres` | 5432 | ✅ Healthy |
| **Redis** | `chatbot-redis` | 6379 | ✅ Healthy |
| **Qdrant** | `chatbot-qdrant` | 6333, 6334 | ✅ Healthy |

## 📦 Services Overview

### 🚀 Main Application (`chatbot-app`)
- **Purpose**: NestJS REST API server
- **Access**: http://localhost:8080
- **Features**: Handles HTTP requests, WebSocket connections, authentication, etc.

### ⚙️ Worker (`chatbot-worker`)
- **Purpose**: Background processing for vector store operations
- **Uses**: BullMQ + Redis for job queues
- **Processes**: Document embedding, vector storage to Qdrant

### 🗄️ PostgreSQL (`chatbot-postgres`)
- **Purpose**: Primary database
- **Version**: PostgreSQL 16
- **Data**: Persisted in `postgres_data` volume

### 🔴 Redis (`chatbot-redis`)
- **Purpose**: Message queue for BullMQ
- **Version**: Redis 7
- **Data**: Persisted in `redis_data` volume

### 🔍 Qdrant (`chatbot-qdrant`)
- **Purpose**: Vector database for embeddings
- **Web UI**: http://localhost:6333/dashboard
- **Data**: Persisted in `qdrant_data` volume

## 🛠️ Common Commands

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f worker
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f qdrant
```

### Restart Services
```powershell
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
docker-compose restart worker
```

### Stop Services
```powershell
# Stop all (keeps data)
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v
```

### Scale Worker
```powershell
# Run multiple worker instances
docker-compose up -d --scale worker=3
```

### Database Operations
```powershell
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d chatbot

# Backup database
docker-compose exec postgres pg_dump -U postgres chatbot | Out-File -Encoding utf8 backup.sql
```

### Check Service Status
```powershell
# View all containers
docker-compose ps

# View resource usage
docker stats
```

## 🔍 Accessing Services

- **API**: http://localhost:8080
- **Qdrant Dashboard**: http://localhost:6333/dashboard
- **PostgreSQL**: `localhost:5432` (user: `postgres`, db: `chatbot`)
- **Redis**: `localhost:6379`

## 📁 Docker Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build configuration |
| `docker-compose.yaml` | Services orchestration |
| `.dockerignore` | Files excluded from build context |
| `entrypoint.sh` | App startup script |
| `entrypoint.worker.sh` | Worker startup script |
| `.env` | Environment variables |

## ⚠️ Important Notes

### Native Dependencies
- The app uses **`node:20-slim`** (Debian-based) instead of Alpine
- Required for `onnxruntime-node` and `@xenova/transformers`
- Larger image size but better compatibility

### Data Persistence
All data is stored in Docker volumes:
- `postgres_data` - Database files
- `redis_data` - Redis persistence  
- `qdrant_data` - Vector embeddings

To completely reset:
```powershell
docker-compose down -v
docker-compose up -d
```

### Security
- App runs as non-root user (`nestjs:nodejs`)
- Uses `dumb-init` for proper signal handling
- Healthchecks ensure services are ready before dependencies start

## 🐛 Troubleshooting

### App not starting
```powershell
# Check logs
docker-compose logs app

# Restart app
docker-compose restart app
```

### Worker errors
```powershell
# Check worker logs  
docker-compose logs worker

# Verify Redis connection
docker-compose exec worker sh -c "ping -c 1 redis"
```

### Database connection issues
```powershell
# Check database is ready
docker-compose exec postgres pg_isready -U postgres

# View connection string
docker-compose exec app env | grep DATABASE_URL
```

### Port conflicts
If ports are already in use, modify `.env`:
```
APP_PORT=8081
DB_PORT=5433
REDIS_PORT=6380
QDRANT_PORT=6334
```

## 📚 Next Steps

1. **Test the API**: Visit http://localhost:8080
2. **Explore Qdrant**: Open http://localhost:6333/dashboard
3. **Monitor logs**: Run `docker-compose logs -f`
4. **Check health**: Run `docker-compose ps`

## 🎉 Success!

Your NestJS application with worker for vector store processing is now fully containerized and running!

For detailed documentation, see [DOCKER_README.md](file:///d:/project-nexora/ChatBot/Backend/DOCKER_README.md)
