require("dotenv").config(); // load .env variables

const OpenAI = require("openai");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createEmbedding(input) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
    encoding_format: "float",
  });
  return response.data[0].embedding;
}

module.exports = { openai, supabase, createEmbedding };
