# Docker Setup for NestJS ChatBot

This project uses Docker to run the NestJS application with all its dependencies including a worker for vector store processing.

## 🏗️ Architecture

The Docker setup includes the following services:

1. **app** - Main NestJS application (port 8080)
2. **worker** - Background worker for vector store processing
3. **postgres** - PostgreSQL database (port 5432)
4. **redis** - Message queue for BullMQ (port 6379)
5. **qdrant** - Vector database for embeddings (port 6333)

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### 1. Configure Environment Variables

Copy the example environment file and update with your values:

**Linux/Mac:**
```bash
cp .env.example .env
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

Edit `.env` with your configuration.

### 2. Build and Start Services

```bash
# Build and start all services
docker-compose up -d

# Or build first, then start
docker-compose build
docker-compose up -d
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f worker
docker-compose logs -f qdrant
```

## 🔧 Common Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Rebuild Services

```bash
# Rebuild a specific service
docker-compose build app
docker-compose build worker

# Rebuild and restart
docker-compose up -d --build
```

### Database Operations

```bash
# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# Access database shell
docker-compose exec mariadb mysql -u root -p

# View database logs
docker-compose logs -f mariadb
```

### Worker Management

```bash
# View worker logs
docker-compose logs -f worker

# Restart worker
docker-compose restart worker

# Scale workers (run multiple instances)
docker-compose up -d --scale worker=3
```

### Access Container Shell

```bash
# Access app container
docker-compose exec app sh

# Access worker container
docker-compose exec worker sh
```

## 🔍 Monitoring

### Check Service Health

```bash
# View status of all services
docker-compose ps

# Check specific service health
docker-compose exec app wget -O- http://localhost:8080/health
```

### Qdrant Dashboard

Access the Qdrant web UI at: http://localhost:6333/dashboard

### Redis CLI

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Monitor Redis in real-time
docker-compose exec redis redis-cli monitor
```

## 📦 Volumes

The setup uses named volumes for data persistence:

- `postgres_data` - PostgreSQL database files
- `redis_data` - Redis persistence
- `qdrant_data` - Vector embeddings

Additionally, these directories are mounted:
- `./uploads` - File uploads
- `./data` - Application data

## 🌐 Ports

| Service | Internal Port | External Port | Description |
|---------|--------------|---------------|-------------|
| app | 8080 | 8080 | NestJS API |
| postgres | 5432 | 5432 | PostgreSQL Database |
| redis | 6379 | 6379 | Redis Queue |
| qdrant | 6333 | 6333 | Qdrant API |
| qdrant | 6334 | 6334 | Qdrant gRPC |

## 🔐 Security Notes

For production deployments:

1. **Change default passwords** in your `.env` file
2. **Use secrets management** instead of plain .env files
3. **Limit exposed ports** - remove port mappings for internal services
4. **Use reverse proxy** (nginx/traefik) in front of the app
5. **Enable SSL/TLS** for all external connections
6. **Update images regularly** for security patches

## 🐛 Troubleshooting

### Worker not processing jobs

```bash
# Check worker logs
docker-compose logs -f worker

# Verify Redis connection
docker-compose exec worker sh -c "ping redis"

# Restart worker
docker-compose restart worker
```

### Database connection issues

```bash
# Check database is ready
docker-compose exec postgres pg_isready -U postgres

# Verify connection string in app
docker-compose exec app env | grep DATABASE_URL
```

### Qdrant connection issues

```bash
# Check Qdrant health
curl http://localhost:6333/healthz

# View Qdrant logs
docker-compose logs -f qdrant
```

### Out of memory issues

```bash
# Check container resource usage
docker stats

# Increase Docker memory limits in Docker Desktop settings
# Or add resource limits to docker-compose.yaml
```

## 🔄 Updates and Maintenance

### Update application code

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build app worker
```

### Backup data

**Linux/Mac:**
```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres chatbot > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres chatbot < backup.sql

# Backup volumes
docker run --rm -v chatbot_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

**Windows PowerShell:**
```powershell
# Backup database
docker-compose exec postgres pg_dump -U postgres chatbot | Out-File -Encoding utf8 backup.sql

# Restore database
Get-Content backup.sql | docker-compose exec -T postgres psql -U postgres chatbot

# Backup volumes
docker run --rm -v chatbot_postgres_data:/data -v ${PWD}:/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [BullMQ Documentation](https://docs.bullmq.io/)
