import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  // Lấy danh sách todo
  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:5000/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Thêm todo
  const addTodo = async () => {
    if (!title.trim()) return;
    await axios.post("http://localhost:5000/api/todos", { title });
    setTitle("");
    fetchTodos();
  };

  // Xóa todo
  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    fetchTodos();
  };

  // Cập nhật trạng thái (toggle)
  const toggleStatus = async (id, current) => {
    await axios.put(`http://localhost:5000/api/todos/${id}`, {
      status: !current,
    });
    fetchTodos();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TaskNest – Todo App</h1>

      {/* Form thêm task */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      {/* Danh sách todo */}
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span className={todo.status ? "line-through text-gray-500" : ""}>
              {todo.title}
            </span>
            <div className="flex gap-3">
              <button
                className="text-green-600"
                onClick={() => toggleStatus(todo._id, todo.status)}
              >
                {todo.status ? "Undo" : "Done"}
              </button>
              <button
                className="text-red-500"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
