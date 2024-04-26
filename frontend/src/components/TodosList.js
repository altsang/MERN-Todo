import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Todo from "./Todo";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(null);

  async function fetchTodos() {
    console.log('Fetching todos...'); // Log the start of fetching todos
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`);
      console.log('Fetched todos:', res.data); // Log fetched todos
      if (isMountedRef.current && Array.isArray(res.data) && res.data.length) {
        console.log('isMountedRef is currently:', isMountedRef.current); // Log the current state of isMountedRef
        setTodos(res.data);
        setIsLoading(false);
      } else {
        console.error('Error: Fetched data is not an array or is empty', res.data);
      }
    } catch (err) {
      console.log('Error fetching todos:', err); // Log error fetching todos
    }
  }

  useEffect(() => {
    isMountedRef.current = true;
    console.log('Component mounted, isMountedRef:', isMountedRef.current); // Log the mounting of the component
    fetchTodos();
    return () => {
      isMountedRef.current = false;
      console.log('Component unmounted, isMountedRef:', isMountedRef.current); // Log the unmounting of the component
    };
  }, []);

  useEffect(() => {
    // Function to call when todos are updated
    const onTodosUpdate = () => {
      console.log('Todos updated event received. Refetching todos.'); // Log event received
      if (isMountedRef.current) {
        console.log('isMountedRef is currently:', isMountedRef.current); // Log the current state of isMountedRef
        fetchTodos(); // Fetch todos again to update the state
      } else {
        console.log('isMountedRef is currently false, not fetching todos.'); // Log when isMountedRef is false
      }
    };

    // Subscribe to the custom event 'todosUpdated'
    document.addEventListener('todosUpdated', onTodosUpdate);

    // Cleanup the event listener
    return () => {
      console.log('Cleaning up todosUpdated event listener.'); // Log cleanup
      document.removeEventListener('todosUpdated', onTodosUpdate);
    };
  }, []); // Removed todos as a dependency to prevent unnecessary re-subscriptions

  console.log('Rendering Todos List...'); // Log before rendering the Todos List
  console.log('Current todos state:', todos); // Log the current state of todos

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

  console.log('Todos List rendered', renderedTodos); // Log after rendering the Todos List

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
