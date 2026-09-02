require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Customer = require("../models/Customer");
const Mechanic = require("../models/Mechanic");
const Booking = require("../models/Booking");

const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Arjun",
  "Rahul",
  "Rohan",
  "Karan",
  "Akash",
  "Saurabh",
  "Vikram",
  "Ananya",
  "Priya",
  "Sneha",
  "Neha",
  "Isha",
  "Kavya",
  "Pooja",
  "Riya",
];

const lastNames = [
  "Sharma",
  "Verma",
  "Patel",
  "Mehta",
  "Singh",
  "Thakur",
  "Gupta",
  "Khan",
  "Joshi",
  "Malhotra",
];

const cities = [
  "Mumbai",
  "Thane",
  "Navi Mumbai",
  "Pune",
  "Bangalore",
  "Delhi",
  "Noida",
  "Gurgaon",
];

const vehicles = [
  { make: "Maruti", model: "Swift" },
  { make: "Hyundai", model: "Creta" },
  { make: "Tata", model: "Nexon" },
  { make: "Honda", model: "City" },
  { make: "Toyota", model: "Fortuner" },
  { make: "Mahindra", model: "XUV700" },
  { make: "Kia", model: "Seltos" },
  { make: "Volkswagen", model: "Virtus" },
];

const services = [
  {
    name: "Full Car Service",
    category: "Periodic Service",
    min: 1800,
    max: 3500,
  },
  {
    name: "Engine Oil Change",
    category: "Oil Change",
    min: 800,
    max: 1800,
  },
  {
    name: "Brake Pad Replacement",
    category: "Brake Service",
    min: 1500,
    max: 4500,
  },
  {
    name: "AC Gas Refill",
    category: "AC Service",
    min: 1200,
    max: 3000,
  },
  {
    name: "Battery Replacement",
    category: "Battery",
    min: 3500,
    max: 9000,
  },
  {
    name: "Tyre Replacement",
    category: "Tyre Service",
    min: 2500,
    max: 12000,
  },
  {
    name: "Premium Car Wash",
    category: "Car Wash",
    min: 500,
    max: 1500,
  },
  {
    name: "Engine Diagnostic",
    category: "Engine Repair",
    min: 1000,
    max: 5000,
  },
];

const mechanicSpecializations = [
  "Engine Specialist",
  "Brake Specialist",
  "AC Specialist",
  "General Service",
  "Electrical Specialist",
  "Tyre Specialist",
];

const bookingStatuses = [
  "Pending",
  "Assigned",
  "Mechanic On The Way",
  "In Progress",
  "Completed",
  "Cancelled",
];

const randomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomDate = (daysBack = 90, daysForward = 7) => {
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - daysBack);

  const end = new Date(now);
  end.setDate(now.getDate() + daysForward);

  return new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
  );
};

const generatePhone = (index) => {
  return `9${String(100000000 + index).slice(0, 9)}`;
};

const generateRegistrationNumber = (index) => {
  const number = String(index).padStart(4, "0");

  return `MH 01 AB ${number}`;
};

const createCustomers = () => {
  return Array.from({ length: 60 }, (_, index) => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    return {
      name: `${firstName} ${lastName}`,
      email: `customer${index + 1}@example.com`,
      phone: generatePhone(index + 1),
      totalBookings: 0,
      totalSpent: 0,
      isActive: true,
    };
  });
};

const createMechanics = () => {
  return Array.from({ length: 25 }, (_, index) => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    return {
      name: `${firstName} ${lastName}`,
      email: `mechanic${index + 1}@example.com`,
      phone: `8${String(100000000 + index).slice(0, 9)}`,
      status: randomItem(["Available", "Busy", "Offline"]),
      jobsCompleted: 0,
      currentBooking: null,
      lastBooking: null,
      specialization: randomItem(mechanicSpecializations),
      location: {
        address: `${randomNumber(1, 200)} Main Road`,
        city: randomItem(cities),
        latitude: 18.5 + Math.random() * 0.2,
        longitude: 73.8 + Math.random() * 0.2,
      },
      isActive: true,
    };
  });
};

const createBookings = (customers, mechanics) => {
  return Array.from({ length: 600 }, (_, index) => {
    const customer = randomItem(customers);

    const mechanic =
      Math.random() > 0.15 ? randomItem(mechanics) : null;

    const service = randomItem(services);

    const status = randomItem(bookingStatuses);

    const scheduledAt = randomDate(90, 7);

    return {
      bookingId: `BK-${String(index + 1).padStart(5, "0")}`,

      customer: customer._id,

      mechanic: mechanic ? mechanic._id : null,

      vehicle: {
        ...randomItem(vehicles),
        registrationNumber: generateRegistrationNumber(index + 1),
        year: randomNumber(2016, 2026),
      },

      service: {
        name: service.name,
        category: service.category,
      },

      status,

      amount: randomNumber(service.min, service.max),

      scheduledAt,

      completedAt:
        status === "Completed"
          ? new Date(
              scheduledAt.getTime() +
                randomNumber(1, 5) * 60 * 60 * 1000
            )
          : null,

      cancelledAt:
        status === "Cancelled"
          ? new Date(scheduledAt)
          : null,

      cancellationReason:
        status === "Cancelled"
          ? randomItem([
              "Customer cancelled",
              "Vehicle unavailable",
              "Mechanic unavailable",
              "Customer rescheduled",
            ])
          : null,

      notes: randomItem([
        "Customer requested doorstep service.",
        "Please inspect vehicle carefully.",
        "Regular maintenance service.",
        "Customer requested quick service.",
        null,
      ]),

      address: {
        street: `${randomNumber(1, 500)} Service Road`,
        city: randomItem(cities),
        pincode: String(randomNumber(400001, 499999)),
      },
    };
  });
};

const updateCustomerStats = async (bookings) => {
  const stats = {};

  for (const booking of bookings) {
    const customerId = booking.customer.toString();

    if (!stats[customerId]) {
      stats[customerId] = {
        totalBookings: 0,
        totalSpent: 0,
      };
    }

    stats[customerId].totalBookings += 1;

    if (booking.status === "Completed") {
      stats[customerId].totalSpent += booking.amount;
    }
  }

  const operations = Object.entries(stats).map(
    ([customerId, data]) => ({
      updateOne: {
        filter: { _id: customerId },
        update: {
          $set: {
            totalBookings: data.totalBookings,
            totalSpent: data.totalSpent,
          },
        },
      },
    })
  );

  if (operations.length) {
    await Customer.bulkWrite(operations);
  }
};

const updateMechanicStats = async (bookings) => {
  const stats = {};

  for (const booking of bookings) {
    if (!booking.mechanic) continue;

    const mechanicId = booking.mechanic.toString();

    if (!stats[mechanicId]) {
      stats[mechanicId] = {
        jobsCompleted: 0,
        lastBooking: null,
        currentBooking: null,
      };
    }

    if (booking.status === "Completed") {
      stats[mechanicId].jobsCompleted += 1;
    }

    if (
      !stats[mechanicId].lastBooking ||
      booking.scheduledAt >
        stats[mechanicId].lastBooking.scheduledAt
    ) {
      stats[mechanicId].lastBooking = booking;
    }

    if (
      ["Assigned", "Mechanic On The Way", "In Progress"].includes(
        booking.status
      )
    ) {
      stats[mechanicId].currentBooking = booking;
    }
  }

  const operations = Object.entries(stats).map(
    ([mechanicId, data]) => ({
      updateOne: {
        filter: { _id: mechanicId },
        update: {
          $set: {
            jobsCompleted: data.jobsCompleted,
            lastBooking: data.lastBooking?._id || null,
            currentBooking: data.currentBooking?._id || null,
          },
        },
      },
    })
  );

  if (operations.length) {
    await Mechanic.bulkWrite(operations);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing data...");

    await Booking.deleteMany({});
    await Customer.deleteMany({});
    await Mechanic.deleteMany({});

    console.log("👥 Creating customers...");

    const customers = await Customer.insertMany(
      createCustomers()
    );

    console.log(`✅ ${customers.length} customers created`);

    console.log("🔧 Creating mechanics...");

    const mechanics = await Mechanic.insertMany(
      createMechanics()
    );

    console.log(`✅ ${mechanics.length} mechanics created`);

    console.log("🚗 Creating bookings...");

    const bookingsData = createBookings(
      customers,
      mechanics
    );

    const bookings = await Booking.insertMany(bookingsData);

    console.log(`✅ ${bookings.length} bookings created`);

    await updateCustomerStats(bookings);
    await updateMechanicStats(bookings);

    console.log("📊 Statistics updated");

    console.log("\n🎉 Database seeded successfully!");
    console.log(`Customers: ${customers.length}`);
    console.log(`Mechanics: ${mechanics.length}`);
    console.log(`Bookings: ${bookings.length}`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDatabase();