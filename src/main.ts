import { z } from "zod";
import { generate } from "./utils";

// example zod schema, very easy to use
const schema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidenceScore: z.number({
    description: "How confident is the LLM on the sentiments it analyses",
  }),
  sourceExample: z.string({
    description: "excerpt of the text where the sentiment was found",
  }),
});

// the prompt to which the answer will be generated on the proper schema
const prompt =
  "Analyze this text:|nGet ready to witness the power of computer engineering! We're about to blow this project out of the water with some serious skills. Let's show everyone what we're made of and bring home the win. I'm feeling pumped up and ready to conquer any challenge that comes our way. Let's do this!";

generate(schema, prompt, { chatCompletionOptions: { temperature: 0 } }).then(
  (result) => {
    // result is properly typed, and guaranteed to match the schema
    console.log(result);
  }
);
