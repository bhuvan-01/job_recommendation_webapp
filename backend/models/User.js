const mongoose = require("mongoose");
const { Schema } = mongoose;

const profileSchema = new Schema({
  skills: {
    type: [String],
    default: [],
  },
  projects: [
    {
      title: {
        type: String,
        default: "",
      },
      description: {
        type: [String],
        default: [],
      },
      url: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
    },
  ],
  experience: [
    {
      company: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        default: Date.now(),
      },
      role: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: "",
      },
    },
  ],
  education: [
    {
      degree: {
        type: String,
        required: true,
      },
      school: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: "",
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
  ],
  resume: {
    type: String,
    default: "",
  },
  certifications: [
    {
      title: {
        type: String,
        default: "",
      },
      issuer: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
      date: {
        type: Date,
      },
    },
  ],
  achievements: [
    {
      title: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
    },
  ],
  languages: {
    type: [String],
    default: [],
  },
});

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "employer", "admin"],
      default: "user",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    links: {
      linkedin: String,
      github: String,
      twitter: String,
    },
    profile: {
      type: profileSchema,
      default: {},
    },
    photo: {
      type: String,
    },
    phone: {
      type: String,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
