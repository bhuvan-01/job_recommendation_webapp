const { z } = require('zod');

const userSignupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = { userLoginSchema, userSignupSchema };
