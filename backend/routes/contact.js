const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  deleteContact,
} = require("../controllers/contact");

const isLoggedin = require("../middlewares/isLoggedin");
const isAdmin = require("../middlewares/isAdmin");

router.post("/contacts", createContact);
router.get("/contacts", isLoggedin, isAdmin, getAllContacts);
router.delete("/contacts/:id", isLoggedin, isAdmin, deleteContact);

module.exports = router;
