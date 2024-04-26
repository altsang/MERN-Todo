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
      if (isMountedRef.current && Array.isArray(res.data) && res.data.length) {
        return res.data; // Return the fetched data instead of setting the state here
      } else {
        console.error('Error: Fetched data is not an array or is empty', res.data);
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
        setTodos(fetchedTodos);
        setIsLoading(false);
      }
    });
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const onTodosUpdate = async () => {
      if (isMountedRef.current) {
        const fetchedTodos = await fetchTodos();
        if (isMountedRef.current && fetchedTodos.length > 0) {
          setTodos(fetchedTodos);
        }
      }
    };

    document.addEventListener('todosUpdated', onTodosUpdate);

    return () => {
      document.removeEventListener('todosUpdated', onTodosUpdate);
    };
  }, []);

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
