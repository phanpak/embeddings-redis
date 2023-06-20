import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";
import { createClient, RedisClientType } from 'redis';

export const setup = () => {
  dotenv.config();

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing.");
  }
}

export const newOpenai = (apiKey: string): OpenAIApi => {
  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  return openai;
}

export const newRedis = (url: string): RedisClientType => {
  const redis: RedisClientType = createClient({ url: url });

  redis.on('error', function(err) {
    throw new Error(`Redis error: ${err}`);
  });

  redis.connect();

  return redis
}
