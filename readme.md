# Zod as a chatGPT guardrail

This project demonstrates the use of zod and openai's chatgpt to generate formatted, typed, consistent output:

- Zod is used to create a schema from which the typescript type of the response is infered. 
- Zod's schema is also used to generate a json schema used as context for the llm's prompt.
- Zod's schema is finally used to validate the response and guarantee the output to the function calling.

To use, remember to provide your openai api key as `OPENAI_API_KEY` env variable (in a .env file, for instance)

Edit schema and prompt in `main.ts`

install dependencies and run `yarn start`

# Example output

Schema : 
```
const schema = z.array(
  z.object({
    name: z.string(),
    text: z.string(),
  })
);
```

Prompt : 
```
"3 pirates talking about their treasure"
```

Output:
```
[
  {
    name: 'Captain Jack',
    text: "Arrr, me treasure chest be filled to the brim with gold doubloons and precious jewels! Aye, a true pirate's bounty it be."
  },
  {
    name: 'Blackbeard',
    text: "Ha! Ye scallywags don't know how to truly amass treasure. The real riches be in the form of rare artifacts and artifacts, worth more than any ordinary loot."
  },
  {
    name: 'Anne Bonny',
    text: "Ye two be fools! The real treasure be in the thrill of the chase and the joy of the fight. And let's not forget the power and respect that come with being a feared pirate."
  }
]
```

