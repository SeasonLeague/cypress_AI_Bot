import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import winston from 'winston';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey) {
  throw new Error('OpenAI API key not found in environment variables.');
}

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello, my name is Cypress and how may I be of assistance to you.'
  });
});

app.post('/', async (req, res) => {
  try {
    if (!req.body.prompt) {
      return res.status(400).send({ error: 'Prompt is required in the request body.' });
    }

    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.9,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    return res.status(200).send({
      bot: response.data.choices[0].text
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ error: 'Something went wrong, please try again later.' });
  }
});

app.listen(5000, () => {
  logger.info('Cypress started on http://localhost:5000');
});
