import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(null);

  async function fetchTodos() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`);
      if (isMountedRef.current && Array.isArray(res.data)) {
        setTodos([...res.data]); // Spread into a new array to ensure a new reference
        setIsLoading(false);
      } else {
        console.error('Error: Fetched data is not an array', res.data);
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  }

  useEffect(() => {
    isMountedRef.current = true;
    fetchTodos();

    // Set up event listener for 'todosUpdated' event
    const handleTodosUpdated = () => {
      if (isMountedRef.current) {
        fetchTodos();
      }
    };

    document.addEventListener('todosUpdated', handleTodosUpdated);

    return () => {
      isMountedRef.current = false;
      document.removeEventListener('todosUpdated', handleTodosUpdated);
    };
  }, []);

  console.log('Todos state at render:', todos); // Log todos state at render for debugging

  const renderedTodos = todos.map(todo => {
    return (
      <tr key={todo._id}>
        <td className={todo.todoCompleted ? "completed" : ""}>{todo.todoDesc}</td>
        <td className={todo.todoCompleted ? "completed" : ""}>{todo.todoResponsible}</td>
        <td className={todo.todoCompleted ? "completed" : ""}>{todo.todoPriority}</td>
        <td className={todo.todoCompleted ? "completed" : ""}>{todo.todoCompleted ? "Yes" : "No"}</td>
        <td>
          <Link to={`/edit/${todo._id}`}>Edit</Link>
        </td>
      </tr>
    );
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : todos.length ? (
    <div>
      <h3>Todos List</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Responsiblity</th>
            <th>Priority</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {renderedTodos}
        </tbody>
      </table>
    </div>
  ) : (
    <div>There are no Todos yet</div>
  );
}
