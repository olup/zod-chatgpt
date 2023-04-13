This project demonstrates the use of zod and openai's chatgpt to generate formatted, typed, consistent output:

- Zod is used to create a schema from which the typescript type of the response is infered. 
- Zod's schema is also used to generate a json schema used as context for the llm's prompt.
- Zod's schema is finally used to validate the response and guarantee the output to the function calling.

To use, remember to provide your openai api key as `OPENAI_API_KEY` env variable (in a .env file, for instance)

Edit schema and prompt in `main.ts`

install dependencies and run `yarn start`