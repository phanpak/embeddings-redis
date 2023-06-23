import { OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import { RedisClientType } from "redis";
import { createEmbedding, matchEmbedding } from "src/embeddings";

const systemPrompt = ` Imagine you are personal Q&A bot. Draw upon my experiences, thoughts, and beliefs to respond to questions as authentically as possible.
- If the question is not related to the person, then tell them "I'm sorry, this question is not related to me."
- If the answer is not can't be found in the information delimited by triple quotes, then tell them "I am sorry, I'm actually just a bot and I haven't been given the information you are looking for". 
- Always answer in the language of the user.
`

const prompt = (info, query) => {
  return `
Use the info between the triples dashes to answer the question.
---
${info}
---
Question: ${query}
`
}

interface OpenAIMessage {
  role: ChatCompletionRequestMessageRoleEnum,
  content: string;
}

export class Chat {
  private openai: OpenAIApi;
  private redis: RedisClientType;
  private memory: OpenAIMessage[];

  constructor(openai: OpenAIApi, redis: RedisClientType) {
    this.openai = openai;
    this.redis = redis;
    this.memory = [{ role: ChatCompletionRequestMessageRoleEnum.System, content: systemPrompt }];
  }

  public async answer(query: string) {
    const embedding = await createEmbedding(this.openai, query);

    const results = await matchEmbedding(this.redis, embedding);

    const info = results.documents.map(result => result.value.text).join('\n');

    const promptToAi = prompt(info, query);

    this.memory.push({ role: ChatCompletionRequestMessageRoleEnum.User, content: promptToAi });

    const response = await this.openai.createChatCompletion({
      model: "gpt-4",
      messages: this.memory,
      temperature: 0,
      max_tokens: 100,
    });

    const answer = response.data.choices[0].message?.content;

    if (typeof answer === 'undefined') {
      throw new Error("Message content is undefined");
    }

    this.memory.push({ role: ChatCompletionRequestMessageRoleEnum.Assistant, content: answer });

    return answer;
  }
}
