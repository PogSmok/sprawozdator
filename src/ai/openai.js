import OpenAI from "openai";
import config from "./config.json" with {type: "json"};

const openai = new OpenAI({
    apiKey: config.OPEN_API_KEY,
  });

// topic -> sentence for which explanation about measurements etc. is to be created
export async function createExplanation(topic) {
    try {
        const GPTOutput = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Niech pan wytłumaczy jakie kroki pan wykonał podczas przeprowadzania eksperymentu, żeby wykonać polecenie "${topic}"` }],
            max_tokens: 500,
        });
        return GPTOutput.choices[0].message.content; 
    } catch(err) {
        console.log(err.message);
    }
}

// topic ->  sentence to make conclusion for
// knowledge -> expected answer
export async function createConclusion(topic, knowledge) {
    try {
        const GPTOutput = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: `Niech wyprowadzi pan wniosek na podstawie pańskich badań na tematu "${topic}". Wie pan, że ${knowledge}` }],
            max_tokens: 500,
        })
        return GPTOutput.choices[0].message.content; 
    } catch(err) {
        console.log(err.message);
    }
}