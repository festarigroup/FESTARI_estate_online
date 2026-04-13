# FESTARI Estate Online Setup & Deployment Guide

## Prerequisites

### System Requirements
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: 5GB free space
- **Network**: Stable internet connection

### Software Dependencies
- **Docker**: Version 20.10 or later
- **Docker Compose**: Version 2.0 or later
- **Git**: Version 2.30 or later
- **Python**: 3.9+ (for local development)
- **Node.js**: 18+ (for frontend development)

## Quick Start with Docker

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/FESTARI_estate_online.git
cd FESTARI_estate_online
```

### 2. Environment Configuration
Create environment files:

**Backend (.env)**
```env
# Database
DATABASE_URL=postgresql://festari_user:password@localhost:5432/festari_db

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-here
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True

# Paystack
PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
SUPABASE_BUCKET=festari-media

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Database Setup
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Load initial data (optional)
docker-compose exec backend python manage.py loaddata initial_data.json
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/docs/

## Local Development Setup

### Backend Setup
```bash
cd server/festari_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Additional Services
```bash
# Start Redis (if not using Docker)
redis-server

# Start Celery worker
celery -A festari_backend worker -l info

# Start Celery beat (for scheduled tasks)
celery -A festari_backend beat -l info
```

## Production Deployment

### 1. Server Requirements
- **VPS/Cloud Instance**: 2GB RAM minimum, 4GB recommended
- **Domain**: Point A record to server IP
- **SSL Certificate**: Let's Encrypt or commercial SSL

### 2. Environment Configuration
Update environment variables for production:
```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@db-host:5432/db-name
REDIS_URL=redis://redis-host:6379/0
```

### 3. Docker Production Setup
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build: ./server
    environment:
      - DEBUG=False
    volumes:
      - staticfiles:/app/staticfiles
      - mediafiles:/app/mediafiles

  frontend:
    build: ./client
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - staticfiles:/app/staticfiles
      - mediafiles:/app/mediafiles
      - ./ssl:/etc/ssl/certs
```

### 4. SSL Setup with Let's Encrypt
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 5. Database Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h db-host -U user -d db-name > backup_$DATE.sql

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## Monitoring & Maintenance

### Health Checks
- **API Health**: `GET /api/health/`
- **Database**: Monitor connection pools
- **Redis**: Check memory usage
- **Celery**: Monitor task queues

### Log Management
```bash
# View application logs
docker-compose logs backend

# View nginx logs
docker-compose logs nginx

# Log rotation
logrotate /etc/logrotate.d/festari
```

### Performance Optimization
- **Database**: Add indexes on frequently queried fields
- **Caching**: Implement Redis caching for API responses
- **Static Files**: Use CDN for media files
- **Database**: Connection pooling with PgBouncer

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check database service
docker-compose ps db

# Test connection
docker-compose exec backend python manage.py dbshell
```

**Redis Connection Error**
```bash
# Check Redis service
docker-compose ps redis

# Test connection
docker-compose exec backend python manage.py shell -c "from django.core.cache import cache; print(cache.get('test'))"
```

**Email Not Sending**
- Check SMTP credentials
- Verify firewall settings
- Check email service status

**File Upload Issues**
- Check Supabase configuration
- Verify bucket permissions
- Check file size limits

**Payment Webhooks**
- Verify Paystack webhook URL
- Check webhook signature validation
- Monitor webhook logs

### Debug Mode
Enable debug logging:
```env
DEBUG=True
LOG_LEVEL=DEBUG
```

## Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Update dependencies regularly
- [ ] Enable rate limiting
- [ ] Set up monitoring alerts
- [ ] Regular security audits
- [ ] Backup encryption

## Support & Resources

### Documentation
- **API Reference**: `/docs/api-reference.md`
- **Platform Overview**: `/docs/platform-overview.md`
- **User Guide**: Available in frontend

### Community
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community support and Q&A
- **Wiki**: Extended documentation and tutorials

### Professional Support
- **Email**: support@festariestate.com
- **Priority Support**: Available for enterprise customers
- **Consulting**: Custom development and integration services