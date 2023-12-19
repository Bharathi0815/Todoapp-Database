import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import TodoForm from "./TodoForm";

import { Link } from "react-router-dom";
import "../Styles/TodoStyle.css";
import UpdateForm from "./UpdateForm";

const TodoPage = () => {
  const authContext = useContext(AuthContext);
  const { isUserLoggedIn } = authContext;
  const [todolist, setTodolist] = useState([]);

  const [fetchTrigger, setFetchTrigger] = useState(isUserLoggedIn);
  const [selectedTodo, setSelectedTodo] = useState("");

  //List the Todos from the Database

  useEffect(() => {
    const fetchTodos = async () => {
      if (isUserLoggedIn) {
        try {
          const response = await fetch("http://localhost:8080/api/todo/getall");
          if (response.ok) {
            const data = await response.json();
            setTodolist(data);
          } else {
            console.error("Failed to fetch todos");
          }
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      }
    };

    if (isUserLoggedIn && fetchTrigger) {
      fetchTodos(); // Fetch todos when fetchTrigger changes
      setFetchTrigger(false); // Reset fetchTrigger
    }
  }, [isUserLoggedIn, fetchTrigger]);

  //when todo  is addded list is populated on the page
  const updateTodoList = (newTodo) => {
    setTodolist([...todolist, newTodo]);
  };

  const deleteTodo = async (item) => {
    console.log("delete method");
    console.log(item.id);
    console.log(item);
    try {
      const response = await fetch("http://localhost:8080/api/todo/delete", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        const data = await response.text();
        setFetchTrigger(true);
        console.log(data);
      } else {
      }
    } catch (error) {
      console.log("Data Error", error);
    }
  };

  const editTodo = (taskToEdit) => {
    console.log("Edit clicked");
    console.log(taskToEdit);

    setSelectedTodo(taskToEdit);
  };

  const updateTodo = async (item) => {
    console.log("update clicked");
    console.log(item);
    try {
      const response = await fetch("http://localhost:8080/api/todo/update", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const data = response.text();
        setFetchTrigger(true);
        console.log(data);
      } else {
      }
    } catch (error) {
      console.log("Data Error", error);
    }

    setSelectedTodo(null);
  };

  return (
    <div>
      <h1 className="h1">TodoPage</h1>

      <div>
        {!isUserLoggedIn && (
          <Link className="loginlink" to="/login">
            Login
          </Link>
        )}
      </div>
      <div>
        {!isUserLoggedIn && (
          <Link className="signuplink" to="/signup">
            /Signup
          </Link>
        )}
      </div>
      <div className="container">
        <h4>Todolist</h4>
        <TodoForm
          isUserLoggedIn={isUserLoggedIn}
          updateTodoList={updateTodoList}
        />
        <div>
          {selectedTodo && (
            <UpdateForm
              isUserLoggedIn={isUserLoggedIn}
              selectedTodo={selectedTodo}
              updateTodo={updateTodo}
            />
          )}
        </div>

        {Array.isArray(todolist) &&
          todolist.map((item) => (
            <p key={item.id} disabled={true}>
              {item.todo}
              <button onClick={() => editTodo(item)}>edit</button>
              <button onClick={() => deleteTodo(item)}>delete</button>
            </p>
          ))}
      </div>
    </div>
  );
};

export default TodoPage;
