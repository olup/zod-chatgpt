# Zod as a chatGPT guardrail

This project demonstrates the use of zod and openai's chatgpt to generate formatted, typed, consistent output:

- Zod is used to create a schema from which the typescript type of the response is infered. 
- Zod's schema is also used to generate a json schema used as context for the llm's prompt.
- Zod's schema is finally used to validate the response and guarantee the output to the function calling.

To use, remember to provide your openai api key as `OPENAI_API_KEY` env variable (in a .env file, for instance)

Edit schema and prompt in `main.ts`

install dependencies and run `yarn start`

# Example output
## Simple things

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
## More complex

Schema (chatGPT generated it for me)
```
const schema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().optional(),
  age: z.number().min(18).max(120).optional(),
  phone: z
    .string()
    .regex(/^\+\d{1,3}\s\d{3}\s\d{3}\s\d{4}$/)
    .optional(),
  address: z
    .object({
      street: z.string().max(100).optional(),
      city: z.string().max(50).optional(),
      state: z.string().max(50).optional(),
      zip: z.string().length(5).optional(),
    })
    .optional(),
  interests: z.array(z.string()).max(5).optional(),
  employment: z
    .object({
      companyName: z.string().max(100).optional(),
      jobTitle: z.string().max(100).optional(),
      salary: z.number().min(0).optional(),
      startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    })
    .optional(),
  education: z
    .array(
      z.object({
        institutionName: z.string().max(100).optional(),
        degree: z.string().max(50).optional(),
        fieldOfStudy: z.string().max(50).optional(),
        graduationDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      })
    )
    .max(5)
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string().max(50).optional(),
        rating: z.number().min(1).max(10).optional(),
      })
    )
    .max(10)
    .optional(),
});
```

Prompt:
```
A pirate talking about her treasure
```

Result:
```
{
  name: 'Sally',
  age: 28,
  email: 'sally@pirates.com',
  phone: '+1 555 123 4567',
  address: {
    street: '123 Main St',
    city: 'Tortuga',
    state: 'Caribbean',
    zip: '12345'
  },
  interests: [ 'sailing', 'rum', 'map reading' ],
  employment: {
    companyName: "Blackbeard's Fleet",
    jobTitle: 'First Mate',
    salary: 50000,
    startDate: '2015-06-01',
    endDate: '2020-12-31'
  },
  education: [
    {
      institutionName: 'Pirate University',
      degree: 'Bachelor of Piracy',
      fieldOfStudy: 'Navigational Studies',
      graduationDate: '2015-05-31'
    }
  ],
  skills: [
    { name: 'Navigation', rating: 9 },
    { name: 'Sword Fighting', rating: 8 },
    { name: 'Rum Drinking', rating: 10 }
  ]
}
```