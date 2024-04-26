import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(null);

  function fetchTodos() {
    console.log('Fetching todos...');
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`)
      .then(res => {
        if (isMountedRef.current && Array.isArray(res.data)) {
          console.log('Fetched todos:', res.data);
          // Only update if the fetched todos are different from the current state
          if (JSON.stringify(todos) !== JSON.stringify(res.data)) {
            setTodos(prevTodos => {
              console.log('Previous todos state:', prevTodos); // Added for debugging
              // Check if the fetched todos are different from the previous state
              if (JSON.stringify(prevTodos) !== JSON.stringify(res.data)) {
                console.log('New todos state:', res.data); // Added for debugging
                return [...res.data]; // Spread into a new array to ensure a new reference
              }
              console.log('Todos state unchanged.'); // Added for debugging
              return prevTodos; // Return previous state if todos are the same
            });
          }
          setIsLoading(false);
        } else {
          console.error('Error: Fetched data is not an array', res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching todos:', err);
      });
  }

  useEffect(() => {
    isMountedRef.current = true;
    fetchTodos();

    // Set up event listener for 'todosUpdated' event
    const handleTodosUpdated = () => {
      console.log('todosUpdated event received');
      if (isMountedRef.current) {
        fetchTodos();
      }
    };

    document.addEventListener('todosUpdated', handleTodosUpdated);

    return () => {
      isMountedRef.current = false;
      document.removeEventListener('todosUpdated', handleTodosUpdated);
    };
  }, []); // Removed todos as a dependency

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
