import { z } from "zod";
import { generate } from "./utils";

// example zod schema, very easy to use
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

// the prompt to which the answer will be generated on the proper schema
const prompt = "A pirate talking about her treasure";

generate(schema, prompt).then((result) => {
  // result is properly typed, and guaranteed to match the schema
  console.log(result);
});
