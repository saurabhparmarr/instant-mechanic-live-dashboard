const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mechanic name is required"],
      trim: true,
      minlength: [2, "Mechanic name must be at least 2 characters"],
      maxlength: [100, "Mechanic name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Mechanic email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },

    phone: {
      type: String,
      required: [true, "Mechanic phone is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ["Available", "Busy", "Offline"],
        message: "Invalid mechanic status",
      },
      default: "Available",
      index: true,
    },

    jobsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    lastBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      address: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        trim: true,
      },

      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("Mechanic", mechanicSchema);