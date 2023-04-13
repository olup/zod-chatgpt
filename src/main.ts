import { z } from "zod";
import { generate } from "./utils";

// zod schema, very easy to use
const schema = z.array(
  z.object({
    name: z.string(),
    text: z.string(),
  })
);

// the prompt to which the answer will be generated on the proper schema
const prompt = "3 pirates talking about their treasure";

generate(schema, prompt).then((result) => {
  // result is properly typed, and guaranteed to match the schema
  console.log(result);
});
