import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { ZodType, z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import "dotenv/config";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const defaultTask = `Output a json object or array fitting this schema, based on the PROMPT section below.
Code only, no commentary, no introduction sentence, no codefence block.

If you are not sure or cannot generate something for any possible reason, return:
{"error" : <the reason of the error>}`;

type GenerateOptions = {
  chatCompletionOptions?: Partial<CreateChatCompletionRequest>;
  task?: string;
};

/**
 * Returns a javascript object or array generated with random content fitting the schema, based on the prompt
 * @param schema  zod schema
 * @param prompt  prompt to which the answer will be generated on the proper schema
 * @returns
 */
export const generate = async <T extends ZodType>(
  schema: T,
  prompt: string,
  options?: GenerateOptions
  // z.infer<T> is a utility type that generates typescript type from the zod schema
): Promise<z.infer<T>> => {
  // zodToJsonSchema is a function that converts a zod schema to a json schema, then stringified
  const jsonSchema = JSON.stringify(zodToJsonSchema(schema, "schema"));

  // openai api call
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    ...options?.chatCompletionOptions,
    messages: [
      {
        role: "user",
        content: `
      JSON SCHEMA: 
      ${jsonSchema}
      
      TASK:
      ${options?.task || defaultTask}
      
      PROMPT:
      ${prompt}
            `,
      },
    ],
  });

  // if the response is empty, throw an error
  if (!completion.data.choices[0].message)
    throw new Error("No message returned");

  let obj;
  const response = completion.data.choices[0].message.content;

  // parse the response
  try {
    obj = JSON.parse(response);
  } catch (e) {
    console.error("The response could not be parsed as json", { response });
    throw new Error("The response could not be parsed as json");
  }

  // chatGpt, when generating an array, tends to wrap it in an object with a "schema" key
  // might be addressable in the prompt, but this is a quick fix
  if (obj.schema) {
    obj = obj.schema;
  }

  // if the response is an error as advised in the prompt, throw an error
  if (obj.error) {
    throw new Error(obj.error);
  }

  // if the response does not match the schema, throw an error
  try {
    schema.parse(obj);
  } catch (error: any) {
    console.error({
      object: JSON.stringify(obj, null, 2),
      error: JSON.stringify(error, null, 2),
    });
    throw new Error("The generated json does not match the schema");
  }

  return obj;
};
