import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Todo from "./Todo";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function fetchTodos() {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/todos`)
      .then(res => {
        setTodos(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchTodos();
    setIsLoading(false);

    // Function to call when todos are updated
    const onTodosUpdate = () => {
      fetchTodos();
    };

    // Subscribe to the custom event 'todosUpdated'
    document.addEventListener('todosUpdated', onTodosUpdate);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('todosUpdated', onTodosUpdate);
    };
  }, []);

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
          {todos.map(todo => {
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
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div>There are no Todos yet</div>
  );
}
