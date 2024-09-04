const jwt = require("jsonwebtoken");
const isLoggedin = require("../../middlewares/isLoggedin");

jest.mock("jsonwebtoken");

describe("isLoggedin Middleware", () => {
  const req = { header: jest.fn() };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  it("should call next if valid token is provided", () => {
    req.header.mockReturnValue("Bearer validToken");
    jwt.verify.mockReturnValue({ id: "1234", role: "user" });
    isLoggedin(req, res, next);
    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      process.env.JWT_SECRET
    );
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if no auth header present", () => {
    req.header.mockReturnValue(null);
    isLoggedin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "No auth header present!",
    });
  });

  it("should return 401 if no token is provided", () => {
    req.header.mockReturnValue("Bearer ");
    isLoggedin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. No token provided.",
    });
  });

  it("should return 400 if token is invalid", () => {
    req.header.mockReturnValue("Bearer invalidToken");
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });
    isLoggedin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token." });
  });
});
