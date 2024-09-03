const { ZodError } = require('zod');
const validateData = require('../../middlewares/validateData');
const schema = {
  parse: jest.fn(),
};

describe('validateData Middleware', () => {
  const req = { body: {} };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  it('should call next if data is valid', () => {
    schema.parse.mockImplementation(() => true);
    const middleware = validateData(schema);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if data is invalid', () => {
    schema.parse.mockImplementation(() => {
      throw new ZodError([{ path: ['field'], message: 'Invalid field' }]);
    });
    const middleware = validateData(schema);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid data',
      details: [{ message: 'field is Invalid field' }],
    });
  });

  it('should return 500 for unexpected errors', () => {
    schema.parse.mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    const middleware = validateData(schema);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
