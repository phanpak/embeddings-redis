import { OpenAIApi } from "openai";
import { RedisClientType, SchemaFieldTypes, VectorAlgorithms } from 'redis';

export const createEmbedding = async (openai: OpenAIApi, text: string) => {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });

  return response.data.data[0].embedding;
}

export const matchEmbedding = async (redis: RedisClientType, embedding: number[]) => {
  const float32Buffer = (arr: number[]) => Buffer.from(new Float32Array(arr).buffer);

  const results = await redis.ft.search('idx:cv', '*=>[KNN 2 @v $BLOB AS dist]', {
    PARAMS: {
      BLOB: float32Buffer(embedding),
    },
    SORTBY: 'dist',
    DIALECT: 2,
    RETURN: ['dist', 'text'],
  });

  return results;
}

export async function createIndex(redis: RedisClientType) {
  try {
    await redis.ft.create('idx:cv', {
      v: {
        type: SchemaFieldTypes.VECTOR,
        ALGORITHM: VectorAlgorithms.HNSW,
        TYPE: 'FLOAT32',
        DIM: 1536,
        DISTANCE_METRIC: 'COSINE'
      }
    }, {
      ON: 'HASH',
      PREFIX: 'cv'
    });
  } catch (e: any) {
    if (e.message === 'Index already exists') {
      console.log('Index exists already, skipped creation.');
    } else {
      throw e;
    }
  }
}

interface ChunkWithVector {
  text: string;
  vector: number[];
}

export const storeEmbedding = async (redis: RedisClientType, key: number, chunk: ChunkWithVector) => {
  function float32Buffer(arr: number[]) {
    return Buffer.from(new Float32Array(arr).buffer);
  }

  await redis.hSet(`cv:${key}`, { v: float32Buffer(chunk.vector), text: chunk.text });
}


