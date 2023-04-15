import { z } from "zod";
import { generate } from "./utils";

// example zod schema, very easy to use
const schema = z.array(
  z.object({
    command: z.enum(["switchOn", "switchOff"]),
    room: z.enum(["livingRoom", "kitchen", "room1", "room2"]),
  })
);

// the prompt to which the answer will be generated on the proper schema
const prompt = "I am going to the kitchen";

generate(schema, prompt, { chatCompletionOptions: { temperature: 0 } }).then(
  (result) => {
    // result is properly typed, and guaranteed to match the schema
    console.log(result);
  }
);
