const multer = require("multer");
const upload = require("../../middlewares/upload");
const mockFs = require("mock-fs");

describe("upload Middleware", () => {
  beforeEach(() => {
    mockFs({
      "uploads/resumes/applications": {},
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it("should store the file with the correct name and directory", (done) => {
    const req = {
      body: {},
      file: {
        fieldname: "resume",
        originalname: "resume.pdf",
        mimetype: "application/pdf",
      },
    };
    const res = {};
    const next = jest.fn();

    const storage = multer.memoryStorage();
    const uploadMiddleware = upload.single("resume");

    uploadMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    done();
  });

  it("should return an error for an invalid file type", (done) => {
    const req = {
      body: {},
      file: {
        fieldname: "resume",
        originalname: "resume.exe",
        mimetype: "application/x-msdownload",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const storage = multer.memoryStorage();
    const uploadMiddleware = upload.single("resume");

    uploadMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error: Only PDF, DOC, and DOCX files are allowed!",
    });
    done();
  });

  it("should return an error if the field name is incorrect", (done) => {
    const req = {
      body: {},
      file: {
        fieldname: "invalidField",
        originalname: "resume.pdf",
        mimetype: "application/pdf",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const storage = multer.memoryStorage();
    const uploadMiddleware = upload.single("resume");

    uploadMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid field name",
    });
    done();
  });
});
