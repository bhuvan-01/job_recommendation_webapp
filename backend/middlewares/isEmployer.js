module.exports = (req, res, next) => {
  if (req.user.role === "employer") {
    next();
  } else {
    return res.status(403).json({
      message: "Not authorized, you are not an employer",
      error: "No sufficient privileges",
    });
  }
};
