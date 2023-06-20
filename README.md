# Embeddings-Redis

This is a Node.js application that uses OpenAI's API and a Redis database to create and store embeddings of text data. It provides a command-line interface for interaction and supports a mode for ingesting new text data.

## Requirements

- Node.js 14.x or later
- Redis database accessible through a URL
- OpenAI API key
- Redis instance running, with the Redisearch module installed.

This application uses TypeScript, and thus requires `ts-node` and `typescript` packages for execution. It also relies on `dotenv` for environment variable management, the official `openai` npm package to interact with the OpenAI API, and `redis` npm package to interact with a Redis database.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/embeddings-redis.git
cd embeddings-redis
npm install
```

Duplicate the `.env.sample` file in the project root, rename it to `.env` and replace the placeholders with your actual OpenAI API key and Redis URL.

```bash
cp .env.sample .env
```

Then edit the `.env` file with your preferred text editor.

Ensure that you have a running Redis instance with the Redisearch module installed. If you're using Docker, you can use the redislabs/redisearch image which comes with the Redisearch module preinstalled.

## Usage

There are two scripts defined in the `package.json` file:

1. `ingest`: Ingests new text data and stores the corresponding embeddings in the Redis database.
2. `start`: Starts the application in an interactive mode.

### Data Ingestion

The `ingest` script ingests new text data, creates embeddings using the OpenAI API, and stores these embeddings in the Redis database.

Run the following command to start the data ingestion:

```bash
npm run ingest
```

It processes text data stored in `src/cv.ts` file. You may modify this file to ingest your own text data.

### Interactive Mode

Run the following command to start the application in interactive mode:

```bash
npm start
```

Once started, the application will prompt you to ask a question. It will then process the input text and respond with the corresponding answer.

## Contributing

Contributions are welcome. Please submit a pull request or create an issue to propose changes or additions.

## License

This project is licensed under the MIT license.
