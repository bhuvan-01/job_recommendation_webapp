const isEmployer = require('../../middlewares/isEmployer');

describe('isEmployer Middleware', () => {
  const req = { user: { role: 'employer' } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  it('should call next if user is employer', () => {
    isEmployer(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if user is not employer', () => {
    req.user.role = 'user';
    isEmployer(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, you are not an employer',
      error: expect.any(String),
    });
  });
});
