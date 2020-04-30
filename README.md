## Available Scripts

In the project directory, you can run:

### `yarn start:dev`

Runs the backend application in the development mode.<br />
You can request at [http://localhost:your_port](http://localhost:your_port).

### `yarn start:prod`

Builds the backend app for production to the `build` folder.<br />

### Production
touch .env.prod and configure it
docker build -f dockerfile.prod -t reef-supervisor-api-prod:latest .