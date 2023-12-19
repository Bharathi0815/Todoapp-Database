import React, { useState } from "react";

function TodoForm({ isUserLoggedIn, updateTodoList }) {
  const [todo, setTodo] = useState("");

  const addTodo = async (todo) => {
    try {
      const response = await fetch("http://localhost:8080/api/todo/add", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo }),
      });

      if (response.ok) {
        const data = await response.json();

        updateTodoList(data);
        console.log(data);
      } else {
        console.log(response);
        console.error("Task not saved");
      }
    } catch (error) {
      console.error("data error:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (todo.length !== 0) {
      addTodo(todo);
    }

    setTodo("");
  };
  console.log("TodoForm" + isUserLoggedIn);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          disabled={!isUserLoggedIn}
          placeholder="Enter Todo"
        ></input>

        <button disabled={!isUserLoggedIn} type="submit">
          Add
        </button>
      </form>
    </div>
  );
}

export default TodoForm;
