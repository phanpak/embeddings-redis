#!/usr/bin/env ts-node

import { setup, newOpenai, newRedis } from 'src/setup';
import { Chat } from 'src/chat';

setup();

const openai = newOpenai(process.env.OPENAI_API_KEY!);
const redis = newRedis(process.env.REDIS_URL!);
const chat = new Chat(openai, redis);

process.stdin.resume();
process.stdin.setEncoding('utf8');

console.log("Please ask me a question:");

process.stdin.on('data', async function(text: string) {
  try {
    const answer = await chat.answer(text);

    console.log(`> ${answer}\n`);
  } catch (error) {
    console.error('Error processing data:', error);
  } finally {
    console.log("Please ask me a question:");
  }
});

