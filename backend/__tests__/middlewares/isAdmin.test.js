const isAdmin = require("../../middlewares/isAdmin");

describe("isAdmin Middleware", () => {
  const req = { user: { role: "admin" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  it("should call next if user is admin", () => {
    isAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", () => {
    req.user.role = "user";
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not authorized, you are not an admin",
    });
  });
});
