import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(null);

  const fetchTodos = useCallback(() => {
    console.log('Fetching todos...');
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`)
      .then(res => {
        if (isMountedRef.current && Array.isArray(res.data)) {
          console.log('Fetched todos:', res.data);
          if (JSON.stringify(todos) !== JSON.stringify(res.data)) {
            setTodos(prevTodos => {
              console.log('Previous todos state:', prevTodos);
              if (JSON.stringify(prevTodos) !== JSON.stringify(res.data)) {
                console.log('New todos state:', res.data);
                return [...res.data];
              }
              console.log('Todos state unchanged.');
              return prevTodos;
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
  }, [todos]); // Include todos in the dependency array

  useEffect(() => {
    isMountedRef.current = true;
    fetchTodos();

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
  }, [fetchTodos]); // Now fetchTodos is a stable function reference

  console.log('Todos state at render:', todos);

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
