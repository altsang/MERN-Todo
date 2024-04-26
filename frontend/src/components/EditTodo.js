import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditTodo({ match: { params }, history }) {
  const [isLoading, setIsLoading] = useState(true);
  const [todoDesc, setTodoDesc] = useState("");
  const [todoResponsible, setTodoResponsible] = useState("");
  const [todoPriority, setTodoPriority] = useState("");
  const [todoCompleted, setTodoCompleted] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/todos/${params.id}`)
      .then(res => {
        const {
          todoCompleted,
          todoDesc,
          todoPriority,
          todoResponsible
        } = res.data;
        setTodoCompleted(todoCompleted);
        setTodoDesc(todoDesc);
        setTodoPriority(todoPriority);
        setTodoResponsible(todoResponsible);
      })
      .then(() => setIsLoading(false))
      .catch(err => {
        console.log(err);
      });
  }, [params.id]);

  const onSubmit = e => {
    e.preventDefault();

    const newTodo = {
      todoDesc,
      todoResponsible,
      todoPriority,
      todoCompleted
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/todos/update/${params.id}`, newTodo)
      .then(res => {
        console.log(res.data);
        localStorage.setItem('todo_updated', 'true');
        history.push("/");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deleteTodo = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/todos/delete/${params.id}`)
      .then(res => {
        console.log(res.data);
        // Dispatch the custom event 'todosUpdated' to signal that todos have been updated
        const event = new Event('todosUpdated');
        document.dispatchEvent(event);
        history.push("/");
      })
      .catch(err => {
        console.log(err);
      });
  };

  return !isLoading ? (
    <div style={{ marginTop: 20 }}>
      <h3>Edit Todo</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            className="form-control"
            value={todoDesc}
            onChange={e => setTodoDesc(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Responsible: </label>
          <input
            type="text"
            className="form-control"
            value={todoResponsible}
            onChange={e => setTodoResponsible(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="priorityOptions"
              id="priorityLow"
              value="Low"
              checked={todoPriority === "Low"}
              onChange={e => setTodoPriority(e.target.value)}
            />
            <label htmlFor="priorityLow" className="form-check-label">
              Low
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="priorityOptions"
              id="priorityMedium"
              value="Medium"
              checked={todoPriority === "Medium"}
              onChange={e => setTodoPriority(e.target.value)}
            />
            <label htmlFor="priorityMedium" className="form-check-label">
              Medium
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              name="priorityOptions"
              id="priorityHigh"
              value="High"
              checked={todoPriority === "High"}
              onChange={e => setTodoPriority(e.target.value)}
            />
            <label htmlFor="priorityHigh" className="form-check-label">
              High
            </label>
          </div>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            className="form-check-input"
            name="completedCheckbox"
            id="completedCheckbox"
            value={todoCompleted}
            checked={todoCompleted}
            onChange={e => setTodoCompleted(!todoCompleted)}
          />
          <label htmlFor="completedCheckbox" className="form-check-label">
            Completed
          </label>
        </div>
        <br />
        <br />
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Edit Todo" />

          <input
            type="button"
            className="btn btn-danger float-right"
            value="Delete Todo"
            onClick={deleteTodo}
          />
        </div>
      </form>
    </div>
  ) : (
    <div>Getting Todo</div>
  );
}
