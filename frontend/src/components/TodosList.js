import React, { useState, useEffect } from "react";
import axios from "axios";

import Todo from "./Todo";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function fetchTodos() {
    console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
    const backendUrl = process.env.REACT_APP_BACKEND_URL + "/api/todos";
    console.log('Fetching todos from:', backendUrl);
    axios
      .get(backendUrl)
      .then(res => {
        console.log('Received response:', res);
        if (Array.isArray(res.data)) {
          setTodos(res.data);
        } else {
          console.error('Expected an array for todos, but received:', res.data);
          setTodos([]); // Set to empty array if response is not an array
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching todos:', err);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchTodos();
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => {
            return <Todo key={todo._id} todo={todo} />;
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div>There are no Todos yet</div>
  );
}
