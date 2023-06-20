import { setup, newOpenai, newRedis } from 'src/setup';
import { cvSections } from 'src/cv';
import { RedisClientType } from 'redis';
import { OpenAIApi } from "openai";
import { createEmbedding, storeEmbedding, createIndex } from 'src/embeddings';

setup();

const openai = newOpenai(process.env.OPENAI_API_KEY!);
const redis = newRedis(process.env.REDIS_URL!);

const main = async () => {
  await ingest(openai, redis, cvSections);
  console.log("Ingestion complete");
}

const ingest = async (openai: OpenAIApi, redis: RedisClientType, chunks: string[]) => {
  await createIndex(redis);

  const promises = chunks.map(async (chunk, index) => {
    try {
      console.log(`Creating embedding for chunk at index ${index}`);
      const vector = await createEmbedding(openai, chunk);
      console.log(`Storing embedding for chunk at index ${index}`);
      await storeEmbedding(redis, index, { text: chunk, vector });
    } catch (error) {
      console.error(`Failed to create embedding for chunk at index ${index}:`, error);
      throw error;
    }
  });

  await Promise.all(promises);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
