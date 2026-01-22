# Nginx Reverse Proxy Setup

## Overview

Nginx is configured as a reverse proxy in front of your NestJS application, providing:

- ✅ **Better performance** with caching and compression
- ✅ **WebSocket support** for real-time features
- ✅ **Security headers** 
- ✅ **Load balancing** capability
- ✅ **SSL/TLS termination** (can be configured)
- ✅ **Rate limiting** (can be configured)

## Architecture

```
Client Request (Port 80)
         ↓
    Nginx Container
         ↓
  NestJS App (Port 8080)
         ↓
  Database/Redis/Qdrant
```

## Configuration Files

### nginx/nginx.conf

Located at `d:\project-nexora\ChatBot\Backend\nginx\nginx.conf`

**Key features**:
- Proxy to NestJS app at `app:8080`
- WebSocket support for `/socket.io`
- Gzip compression enabled
- 100MB max upload size
- Security headers
- 60s timeouts

## Access Points

- **Through Nginx**: http://localhost (port 80)
- **Direct to App**: Not exposed externally (only internal Docker network)

## Common Customizations

### 1. Change HTTP Port

In `.env`:
```env
NGINX_PORT=8000  # Use port 8000 instead of 80
```

### 2. Enable SSL/HTTPS

Create `nginx/nginx-ssl.conf`:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # ... rest of config
}
```

Update `docker-compose.yaml`:
```yaml
nginx:
  ports:
    - '443:443'
  volumes:
    - ./nginx/nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro
    - ./ssl:/etc/nginx/ssl:ro
```

### 3. Add Rate Limiting

In `nginx/nginx.conf`, add before `server` block:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        # ... rest of config
    }
}
```

### 4. Serve Static Files

```nginx
location /static {
    alias /var/www/static;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## Testing

### Test Nginx Configuration

```powershell
# Check config syntax
docker-compose exec nginx nginx -t

# Reload configuration
docker-compose exec nginx nginx -s reload
```

### Test Endpoints

```powershell
# Through Nginx
curl http://localhost/health

# Check headers
curl -I http://localhost/api
```

## Monitoring

### View Nginx Logs

```powershell
# Access logs
docker-compose logs nginx

# Follow logs
docker-compose logs -f nginx

# Error logs only
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

### Check Status

```powershell
# Check if nginx is running
docker-compose ps nginx

# Check nginx health
docker-compose exec nginx wget -O- http://localhost/health
```

## Troubleshooting

### 502 Bad Gateway

**Cause**: Nginx can't reach the NestJS app

**Solutions**:
```powershell
# Check app is running
docker-compose ps app

# Check app logs
docker-compose logs app

# Restart both
docker-compose restart nginx app
```

### 413 Request Entity Too Large

**Cause**: Upload size exceeds limit

**Solution**: Increase `client_max_body_size` in `nginx.conf`:
```nginx
client_max_body_size 500M;  # For 500MB uploads
```

### WebSocket Not Working

**Cause**: Missing upgrade headers

**Solution**: Already configured in `/socket.io` location block with:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

## Production Recommendations

1. **Enable HTTPS**
   - Use Let's Encrypt certificates
   - Force HTTP to HTTPS redirect

2. **Add Security Headers**
   - HSTS (HTTP Strict Transport Security)
   - CSP (Content Security Policy)

3. **Enable Caching**
   ```nginx
   proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;
   
   location /api/public {
       proxy_cache api_cache;
       proxy_cache_valid 200 10m;
   }
   ```

4. **Configure Logging**
   ```nginx
   access_log /var/log/nginx/access.log combined;
   error_log /var/log/nginx/error.log warn;
   ```

5. **Set up monitoring**
   - Nginx status page
   - Prometheus metrics
   - Log aggregation

## Example: Full Production Config

See `NGINX_PRODUCTION_EXAMPLE.md` for a complete production-ready configuration with SSL, caching, and security hardening.
