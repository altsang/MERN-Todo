import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Todo from "./Todo";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTodos() {
    console.log('Fetching todos...'); // Log the start of fetching todos
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`);
      console.log('Fetched todos:', res.data); // Log fetched todos
      if (Array.isArray(res.data) && res.data.length) {
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
    fetchTodos();
  }, []);

  useEffect(() => {
    // Function to call when todos are updated
    const onTodosUpdate = () => {
      console.log('Todos updated event received. Refetching todos.'); // Log event received
      fetchTodos(); // Fetch todos again to update the state
    };

    // Subscribe to the custom event 'todosUpdated'
    document.addEventListener('todosUpdated', onTodosUpdate);

    // Cleanup the event listener
    return () => {
      console.log('Cleaning up todosUpdated event listener.'); // Log cleanup
      document.removeEventListener('todosUpdated', onTodosUpdate);
    };
  }, [todos]); // Add todos as a dependency to re-render when todos state updates

  console.log('Rendering Todos List...'); // Log before rendering the Todos List

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
