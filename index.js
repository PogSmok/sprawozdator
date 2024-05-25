import OpenAI from 'openai';
import config from './config.json' with {type: "json"};
import { createTracing } from 'trace_events';

const openai = new OpenAI({
    apiKey: config.OPEN_API_KEY,
  });

// topic -> sentence for which explanation about measurements etc. is to be created
async function createExplanation(topic) {
    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Niech pan wytłumaczy jakie kroki pan wykonał podczas przeprowadzania eksperymentu, żeby wykonać polecenie "${topic}"` }],
            stream: true,
        });
        for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || '');
        }
    } catch(err) {
        res.status(500).json(err.message);
    }
}

// topic ->  sentence to make conclusion for
// knowledge -> expected answer
async function createConclusion(topic, knowledge) {
    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Niech wyprowadzi pan wniosek na podstawie pańskich badań na tematu "${topic}". Wie pan, że ${knowledge}` }],
            stream: true,
        });
        for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || '');
        }
    } catch(err) {
        res.status(500).json(err.message);
    }
}