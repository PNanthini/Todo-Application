import React, { useState, useContext, useEffect } from 'react';
import GlobalStateContext from '../context/GlobalState';
import { useLocation, useNavigate } from 'react-router-dom';

const GroupTodo = () => {
    const location = useLocation();
    const { state, dispatch } = useContext(GlobalStateContext);
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [newTodoText, setNewTodoText] = useState('');
    const userName = location.state?.userName;

    useEffect(() => {
        if (!userName) {
            navigate('/'); // Redirect to the home page if userName is not present
            return;
        }

        // Load todos for the user
        setTodos(state.todos[userName] || []);
    }, [userName, navigate, state.todos]);

    const handleAddTodo = () => {
        if (newTodoText.trim() === '') return;

        const newTodo = {
            id: Date.now().toString(),
            text: newTodoText,
            completed: false
        };

        const updatedTodos = [...todos, newTodo];
        dispatch({ type: 'ADD_TODO', payload: { userName, todo: newTodo } });
        setTodos(updatedTodos);
        setNewTodoText('');
    };

    const handleDeleteTodo = (todoId) => {
        const updatedTodos = todos.filter(todo => todo.id !== todoId);
        setTodos(updatedTodos);
        dispatch({
            type: 'UPDATE_TODOS',
            payload: { userName, todos: updatedTodos },
        });
    };

    const handleTodoClick = (todo) => {
        navigate(`/todo-detail/${userName}/${todo.id}`);
    };

    const handleTodoDoubleClick = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
        dispatch({
            type: 'UPDATE_TODOS',
            payload: { userName, todos: updatedTodos },
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <button 
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-500 hover:underline"
            >
                &larr; Back
            </button>
            <h1 className="text-2xl font-bold mb-4">{userName}'s Group Todos</h1>
            <div className="mb-6">
                <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new todo"
                    className="border p-2 mr-2"
                />
                <button onClick={handleAddTodo} className="bg-blue-500 text-white p-2">Add</button>
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2">Todo List</h2>
                <ul className="list-disc pl-5">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className="mb-2 flex items-center cursor-pointer"
                            onClick={() => handleTodoClick(todo)}
                            onDoubleClick={() => handleTodoDoubleClick(todo.id)}
                        >
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                readOnly
                                className="mr-2"
                            />
                            <span
                                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                                className="text-lg mr-2"
                            >
                                {todo.text}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent click event from triggering on the li
                                    handleDeleteTodo(todo.id);
                                }}
                                className="text-red-500 text-xl"
                            >
                                &#x2212;
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GroupTodo;
