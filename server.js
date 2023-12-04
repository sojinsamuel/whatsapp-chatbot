const express = require("express");
const { openai, createEmbedding, supabase } = require("./utils");

// guide the behaviour of the model
const chatMessages = [
  {
    role: "system",
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`,
  },
];

async function findNearestMatch(query_embedding) {
  const { data: movies } = await supabase.rpc("match_movies", {
    query_embedding,
    match_threshold: 0.78,
    match_count: 1,
  });

  // if no matches, returns []
  return movies.length > 0 && movies;
}

async function reply(msg) {
  const embedding = await createEmbedding(msg);
  const movies = await findNearestMatch(embedding);

  if (!movies) return "No match found. Please try again.";

  chatMessages.push({
    role: "user",
    content: `Context: ${movies[0].content} Question: ${msg}`,
  });

  const response = await openai.chat.completions.create({
    messages: chatMessages,
    model: "gpt-3.5-turbo",
    max_tokens: 300,
    temperature: 0.5,
    frequency_penalty: 0.5,
  });
  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

const MessagingResponse = require("twilio").twiml.MessagingResponse;

app.post("/incoming", async (req, res) => {
  const message = req.body;

  const twiml = new MessagingResponse();
  const aiReply = await reply(message.Body);

  twiml.message(aiReply);

  res.status(200).type("text/xml");
  res.end(twiml.toString());
});

app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
