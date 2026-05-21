import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Check, X } from 'lucide-react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Failed to load todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateStats();
  }, [todos]);

  // Update statistics
  const updateStats = () => {
    const completed = todos.filter(todo => todo.completed).length;
    setStats({
      total: todos.length,
      completed: completed,
      active: todos.length - completed
    });
  };

  // Add new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
      createdAt: new Date().toLocaleString()
    };

    setTodos([newTodo, ...todos]);
    setInput('');
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Filter todos based on current filter
  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
            ✓ My Tasks
          </h1>
          <p className="text-blue-200 text-lg">Stay organized and productive</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
            <p className="text-blue-200 text-sm mb-1">Total</p>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-4 border border-green-400/30 text-center">
            <p className="text-green-200 text-sm mb-1">Completed</p>
            <p className="text-4xl font-bold text-green-300">{stats.completed}</p>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-md rounded-2xl p-4 border border-orange-400/30 text-center">
            <p className="text-orange-200 text-sm mb-1">Active</p>
            <p className="text-4xl font-bold text-orange-300">{stats.active}</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto">
        {/* Input Form */}
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-blue-200/50 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-400/50 transition"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl transition flex items-center gap-2 shadow-lg hover:shadow-blue-500/50"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </form>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filter === 'active'
                ? 'bg-orange-500 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              filter === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-3 mb-6">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-start gap-4 hover:bg-white/15 transition group"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition mt-1 ${
                    todo.completed
                      ? 'bg-green-500 border-green-400'
                      : 'border-blue-300 hover:border-blue-400'
                  }`}
                >
                  {todo.completed && <Check size={16} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-lg break-words transition ${
                      todo.completed
                        ? 'text-blue-300 line-through'
                        : 'text-white'
                    }`}
                  >
                    {todo.text}
                  </p>
                  <p className="text-xs text-blue-300/50 mt-1">{todo.createdAt}</p>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-blue-200/60 text-lg">No tasks found</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-blue-400 hover:text-blue-300 underline mt-2 transition"
                >
                  View all tasks
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {todos.length > 0 && stats.completed > 0 && (
          <div className="flex gap-2">
            <button
              onClick={clearCompleted}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold px-6 py-3 rounded-2xl transition border border-red-400/30 hover:border-red-400/50"
            >
              Clear Completed
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-blue-200/50 text-sm">
          <p>💾 Your tasks are automatically saved to your browser</p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
