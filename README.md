
# SyncVote Rest API

Node.js (TypeScript)

## Installation

Install the project dependencies:

```bash
npm install
```

## Prerequisites

Before running the project, you need to download and run the Redis server. Follow these steps:

1. **Download Redis**: Visit the [Redis website](https://redis.io/download) and download the appropriate version for your operating system.

2. **Run the Redis Server**: After installing Redis, start the server. You can do this by running the following command in your terminal:

   ```bash
   redis-server
   ```

Make sure the Redis server is running before you start the project.

## Developing

Copy **.env.example** and name it **.env**, then set the environment variables.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.<br>
Open [http://localhost:8080/api-docs](http://localhost:8080/api-docs) with your browser to see the full *DOCUMENTATION* and test all provided API functions.

> **Note:** When opening the api-docs to test all the functions, kindly insert the Authorization token at the top of the page by clicking on the Authorize button and inserting the token (no need to insert "Bearer "; the system will do it automatically). Feel free to ignore the second input field.

### Create a new admin

```bash
npm run create-admin
```
