import { useEffect, useState } from "react";
import axios from "axios";

// Vite sẽ tự chọn env file theo môi trường (dev/prod)
const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stats, setStats] = useState({ done: 0, pending: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchTodos = async () => {
    let url = `${API_BASE}/api/todos?page=${page}&limit=5`;
    if (filter === "done") url += "&status=true";
    if (filter === "pending") url += "&status=false";
    if (from && to) url += `&from=${from}&to=${to}`;

    const res = await axios.get(url);
    setTodos(res.data.todos);
    setPages(res.data.pages);

    const statRes = await axios.get(`${API_BASE}/api/todos/stats`);
    setStats(statRes.data);
  };

  useEffect(() => {
    fetchTodos();
  }, [filter, page, from, to]);

  const addTodo = async () => {
    if (!title.trim()) return;
    await axios.post(`${API_BASE}/api/todos`, { title, dueAt: dueDate });
    setTitle("");
    setDueDate("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_BASE}/api/todos/${id}`);
    fetchTodos();
  };

  const toggleStatus = async (id, current) => {
    await axios.put(`${API_BASE}/api/todos/${id}`, { status: !current });
    fetchTodos();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TaskNest – Todo App</h1>

      {/* Thống kê */}
      <div className="mb-4">
        <p>Completed: {stats.done}</p>
        <p>Pending: {stats.pending}</p>
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 border ${filter === "all" ? "bg-gray-200" : ""}`}
          onClick={() => { setFilter("all"); setPage(1); }}
        >
          All
        </button>
        <button
          className={`px-3 py-1 border ${filter === "done" ? "bg-gray-200" : ""}`}
          onClick={() => { setFilter("done"); setPage(1); }}
        >
          Done
        </button>
        <button
          className={`px-3 py-1 border ${filter === "pending" ? "bg-gray-200" : ""}`}
          onClick={() => { setFilter("pending"); setPage(1); }}
        >
          Pending
        </button>
      </div>

      {/* Lọc theo ngày */}
      <div className="flex gap-2 mb-4">
        <input type="date" className="border p-2" value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" className="border p-2" value={to} onChange={e => setTo(e.target.value)} />
      </div>

      {/* Form thêm task */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a task"
        />
        <input
          type="date"
          className="border p-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white" onClick={addTodo}>Add</button>
      </div>

      {/* Danh sách todo */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex justify-between items-center border-b py-2">
            <div>
              <span className={todo.status ? "line-through text-gray-500" : ""}>
                {todo.title}
              </span>
              {todo.dueAt && (
                <span className="ml-2 text-sm text-gray-400">
                  (Due: {new Date(todo.dueAt).toLocaleDateString()})
                </span>
              )}
            </div>
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

      {/* Phân trang */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border"
        >
          Prev
        </button>
        <span>Page {page} / {pages}</span>
        <button
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border"
        >
          Next
        </button>
      </div>
    </div>
  );
}
