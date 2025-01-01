require("dotenv").config();

const nodemailer = require("nodemailer");

jest.mock("nodemailer");

describe("Email Configuration", () => {
  beforeAll(() => {
    process.env.EMAIL_USER = "test@example.com";
    process.env.EMAIL_PASS = "password123";
  });

  it("should create a Nodemailer transporter with correct configuration", () => {
    const mockTransport = {
      sendMail: jest.fn(),
    };

    nodemailer.createTransport.mockReturnValue(mockTransport);

    const actualTransporter = require("../../config/emailConfig");
    expect(actualTransporter).toEqual(mockTransport);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  });
});
