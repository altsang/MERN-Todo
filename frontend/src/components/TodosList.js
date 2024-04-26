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
        return res.data; // Return the fetched data instead of setting the state here
      } else {
        console.error('Error: Fetched data is not an array', res.data);
        return []; // Return an empty array in case of error
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      return []; // Return an empty array in case of error
    }
  }

  useEffect(() => {
    isMountedRef.current = true;
    fetchTodos().then(fetchedTodos => {
      if (isMountedRef.current) {
        console.log('Current todos state before update:', todos); // Log current state before update
        setTodos([...fetchedTodos]); // Spread into a new array to ensure a new reference
        console.log('setTodos called with fetched todos:', fetchedTodos); // Log that setTodos was called
        setIsLoading(false);
      }
    });
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const onTodosUpdate = async () => {
      console.log('todosUpdated event received'); // Added for debugging
      console.log('isMountedRef.current at event receive:', isMountedRef.current); // Additional debugging
      if (isMountedRef.current) {
        const fetchedTodos = await fetchTodos();
        console.log('Fetched todos after update:', fetchedTodos); // Added for debugging
        if (isMountedRef.current) {
          console.log('Current todos state before update:', todos); // Log current state before update
          setTodos([...fetchedTodos]); // Spread into a new array to ensure a new reference
          console.log('setTodos called with fetched todos:', fetchedTodos); // Log that setTodos was called
        }
      }
    };

    document.addEventListener('todosUpdated', onTodosUpdate);
    console.log('Event listener for todosUpdated added'); // Additional debugging

    return () => {
      document.removeEventListener('todosUpdated', onTodosUpdate);
      console.log('Event listener for todosUpdated removed'); // Additional debugging
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
