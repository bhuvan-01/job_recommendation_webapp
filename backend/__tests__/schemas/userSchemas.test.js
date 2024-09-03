const { userSignupSchema, userLoginSchema } = require('../../schemas/userSchemas');
const { z } = require("zod");

describe('User Schemas Validation', () => {

  describe('userSignupSchema', () => {
    it('should validate a correct signup schema', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      expect(() => userSignupSchema.parse(validData)).not.toThrow();
    });

    it('should fail if email is invalid', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'notanemail',
        password: 'password123',
      };

      expect(() => userSignupSchema.parse(invalidData)).toThrowError(z.ZodError);
    });

    it('should fail if password is less than 6 characters', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '123',
      };

      expect(() => userSignupSchema.parse(invalidData)).toThrowError(z.ZodError);
    });

    it('should fail if firstName is missing', () => {
      const invalidData = {
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      expect(() => userSignupSchema.parse(invalidData)).toThrowError(z.ZodError);
    });

    it('should fail if lastName is missing', () => {
      const invalidData = {
        firstName: 'John',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      expect(() => userSignupSchema.parse(invalidData)).toThrowError(z.ZodError);
    });
  });

  describe('userLoginSchema', () => {
    it('should validate a correct login schema', () => {
      const validData = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      expect(() => userLoginSchema.parse(validData)).not.toThrow();
    });

    it('should fail if email is invalid', () => {
      const invalidData = {
        email: 'notanemail',
        password: 'password123',
      };

      expect(() => userLoginSchema.parse(invalidData)).toThrowError(z.ZodError);
    });

    it('should fail if password is less than 6 characters', () => {
      const invalidData = {
        email: 'john.doe@example.com',
        password: '123',
      };

      expect(() => userLoginSchema.parse(invalidData)).toThrowError(z.ZodError);
    });

    it('should fail if email is missing', () => {
      const invalidData = {
        password: 'password123',
      };

      expect(() => userLoginSchema.parse(invalidData)).toThrowError(z.ZodError);
    });

    it('should fail if password is missing', () => {
      const invalidData = {
        email: 'john.doe@example.com',
      };

      expect(() => userLoginSchema.parse(invalidData)).toThrowError(z.ZodError);
    });
  });

});
