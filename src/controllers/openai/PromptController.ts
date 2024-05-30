import { RequestHandler } from "express";
import axios from "axios"; // needed to make requests to specific url at OpenAI API
import natural from "natural"; // used to count tokens in message history
import CONFIG from "../../config";

// for conversation history feature (which gives context to conversation), we need to count the tokens
// in this case we use the "natural" package in order to keep as much history as possible. gpt 3.5 token limit - 4096
const TOKEN_LIMIT = 2000;
let tokenCount: number;

let conversationHistory = [
  {
    role: "system",
    content:
      'You are an API that generates a list of test questions and answers. You should return exactly 10 questions and answers formatted as JSON. Each question should have a question text, four options labeled "a", "b", "c", and "d", and an answer. Ensure all keys and string values are enclosed in double quotes. DO NOT USE NESTED QUOTES OR any characters that require escaping within the question text or options. The response should be in the format: {"questions": [{"question": "string", "options": ["a. option1", "b. option2", "c. option3", "d. option4"], "answer": "string", "answerArrPosition": "number"}]}. Ensure the JSON is properly formatted.',
  },
];

function addUserMessage(content: string) {
  conversationHistory.push({ role: "user", content: content });
}
function addAssistantMessage(content: string) {
  conversationHistory.push({ role: "assistant", content: content });
}

function countTokens(text: string) {
  const tokenizer = new natural.WordTokenizer(); // Create a new WordTokenizer instance
  const tokens = tokenizer.tokenize(text);
  return tokens.length;
}

function truncateConversationHistory() {
  tokenCount = conversationHistory?.reduce((count, message) => count + countTokens(message.content), 0);
  // set this number as a buffer to not hit thte limit
  while (tokenCount >= TOKEN_LIMIT - 500) {
    if (conversationHistory.length > 2) {
      conversationHistory?.splice(1, 2);
    } else {
      break;
    }

    tokenCount = conversationHistory.reduce((count, message) => count + countTokens(message.content), 0);
  }
}

const PromptController: RequestHandler = async (req, res) => {
  console.log("PromptController -> req.body", req.body);
  const userPrompt = req.body.userPrompt;
  addUserMessage(userPrompt);

  if (!userPrompt) {
    res.status(400).json({
      error: {
        message: "Please provide a valid userPrompt",
      },
    });
    return;
  }

  truncateConversationHistory(); // call this so that we don't send more than the max tokens

  try {
    console.log("here---");
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
        temperature: 0.5,
        max_tokens: 2000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CONFIG.OPENAI_API_KEY}`,
        },
      }
    );
    const extractedGptresponse = gptResponse.data.choices[0].message.content;
    addAssistantMessage(extractedGptresponse);

    res.status(200).json({
      result: extractedGptresponse,
      tokenCount,
    });
    console.log(conversationHistory);
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
};

export default PromptController;
