import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const TodoSchema = new mongoose.Schema({
  title: String,
  status: { type: Boolean, default: false },
  dueAt: Date,
}, { timestamps: true });

const Todo = mongoose.model("Todo", TodoSchema);

// Create
app.post("/api/todos", async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read (with filter + pagination)
app.get("/api/todos", async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 5 } = req.query;

    let filter = {};
    if (status === "true") filter.status = true;
    if (status === "false") filter.status = false;
    if (from && to) {
      filter.dueAt = { $gte: new Date(from), $lte: new Date(to) };
    }

    const skip = (page - 1) * limit;
    const todos = await Todo.find(filter)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Todo.countDocuments(filter);

    res.json({
      todos,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Stats (done vs pending)
app.get("/api/todos/stats", async (req, res) => {
  try {
    const done = await Todo.countDocuments({ status: true });
    const pending = await Todo.countDocuments({ status: false });
    res.json({ done, pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Backend running: http://localhost:${process.env.PORT}`)
);
