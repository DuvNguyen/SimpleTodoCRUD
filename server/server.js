import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const TodoSchema = new mongoose.Schema({
  title: String,
  status: { type: Boolean, default: false },
  dueAt: Date,
}, { timestamps: true });

const Todo = mongoose.model("Todo", TodoSchema);

// CRUD
app.post("/api/todos", async (req, res) => {
  const todo = await Todo.create(req.body);
  res.status(201).json(todo);
});
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});
app.put("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});
app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

app.listen(process.env.PORT, () =>
  console.log(`✅ Backend running: http://localhost:${process.env.PORT}`)
);
