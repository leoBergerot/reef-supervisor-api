### Production

## Build (check dockerfile to option from local file or from github)
docker build -f dockerfile.prod -t reef-supervisor-api-prod:latest .

## Run (sample)
docker run --rm -it \
    -p 8080:7000 \
    --env ALLOW_ORIGIN="*" \
    --env PORT=7000 \
    --env DATABASE_HOST=localhost \
    --env DATABASE_PORT=3306 \
    --env DATABASE_USERNAME=reef_supervisor \
    --env DATABASE_PASSWORD=reef_supervisor \
    --env DATABASE_NAME=reef_supervisor \
    --env DATABASE_TYPE=mysql \
    --env MAILJET_API_KEY=xxx \
    --env MAILJET_SECRET=xxx \
    --env EMAIL_SENDER=dev@reef-supervisor.fr \
    --env FRONTEND_URL=localhost:8181 \
    --env BACKEND_URL=localhost:8080 \
    --env RECAPTCHA_SECRET_KEY=xxx \
    --env RECAPTCHA_ENABLED=true \
    reef-supervisor-api-prod:latest
    
You can access to the api via -> http://localhost:8080    
        
    
    
