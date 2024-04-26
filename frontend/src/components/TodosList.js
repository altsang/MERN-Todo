import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TodosList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(null);

  async function fetchTodos() {
    console.log('Fetching todos...');
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`);
      console.log('Fetched todos:', res.data);
      if (isMountedRef.current && Array.isArray(res.data) && res.data.length) {
        console.log('isMountedRef is currently:', isMountedRef.current);
        console.log('Before setTodos, current todos state:', todos);
        return res.data; // Return the fetched data instead of setting the state here
      } else {
        console.error('Error: Fetched data is not an array or is empty', res.data);
        return []; // Return an empty array in case of error
      }
    } catch (err) {
      console.log('Error fetching todos:', err);
      return []; // Return an empty array in case of error
    }
  }

  useEffect(() => {
    isMountedRef.current = true;
    console.log('Component mounted, isMountedRef:', isMountedRef.current);
    fetchTodos().then(fetchedTodos => {
      if (isMountedRef.current) {
        console.log('Setting todos state with fetched data:', fetchedTodos);
        setTodos(fetchedTodos);
        setIsLoading(false);
      }
    });
    return () => {
      isMountedRef.current = false;
      console.log('Component unmounted, isMountedRef:', isMountedRef.current);
    };
  }, []);

  useEffect(() => {
    const onTodosUpdate = async () => {
      console.log('Todos updated event received. Refetching todos.');
      if (isMountedRef.current) {
        console.log('isMountedRef is currently:', isMountedRef.current);
        const fetchedTodos = await fetchTodos();
        if (isMountedRef.current && fetchedTodos.length > 0) {
          console.log('Setting todos state with fetched data after update:', fetchedTodos);
          setTodos(fetchedTodos);
        } else {
          console.log('Received empty todos array after update, not updating state.');
        }
      } else {
        console.log('isMountedRef is currently false, not fetching todos.');
      }
    };

    document.addEventListener('todosUpdated', onTodosUpdate);

    return () => {
      console.log('Cleaning up todosUpdated event listener.');
      document.removeEventListener('todosUpdated', onTodosUpdate);
    };
  }, []); // Removed todos dependency to ensure updates are reflected only when the event is dispatched

  console.log('Rendering Todos List...');
  console.log('Current todos state:', todos);

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

  console.log('Todos List rendered', renderedTodos);

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
