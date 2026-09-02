const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },

    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic",
      default: null,
      index: true,
    },

    vehicle: {
      make: {
        type: String,
        required: true,
        trim: true,
      },

      model: {
        type: String,
        required: true,
        trim: true,
      },

      registrationNumber: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },

      year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
    },

    service: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        required: true,
        enum: [
          "Periodic Service",
          "Oil Change",
          "Brake Service",
          "AC Service",
          "Battery",
          "Tyre Service",
          "Car Wash",
          "Engine Repair",
        ],
        index: true,
      },
    },

    status: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Assigned",
        "Mechanic On The Way",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    address: {
      street: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        trim: true,
      },

      pincode: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Useful compound indexes
bookingSchema.index({ status: 1, scheduledAt: -1 });
bookingSchema.index({ customer: 1, scheduledAt: -1 });
bookingSchema.index({ mechanic: 1, scheduledAt: -1 });
bookingSchema.index({ "service.category": 1, scheduledAt: -1 });

// Automatically set completedAt
bookingSchema.pre("save", function (next) {
  if (this.status === "Completed" && !this.completedAt) {
    this.completedAt = new Date();
  }

  if (this.status !== "Completed") {
    this.completedAt = null;
  }

  next();
});

module.exports = mongoose.model("Booking", bookingSchema);