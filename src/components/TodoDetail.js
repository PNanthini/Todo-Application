import React, { useState, useContext, useEffect } from 'react';
import GlobalStateContext from '../context/GlobalState';
import { useParams, useNavigate } from 'react-router-dom';

const TodoDetail = () => {
    const { userName, todoId } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useContext(GlobalStateContext);
    const [todoText, setTodoText] = useState('');
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [newTodoText, setNewTodoText] = useState('');

    useEffect(() => {
        const userTodos = state.todos[userName] || [];
        const todo = userTodos.find((todo) => todo.id === todoId);

        if (todo) {
            setSelectedTodo(todo);
            setTodos(userTodos);
        } else {
            navigate('/'); // Redirect if todoId doesn't exist
        }
    }, [userName, todoId, state.todos, navigate]);

    const handleToggleComplete = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        dispatch({
            type: 'UPDATE_TODOS',
            payload: { userName, todos: updatedTodos },
        });
        setTodos(updatedTodos);
    };

    const handleAddTodo = () => {
        if (newTodoText.trim() === '') return;

        const newTodo = {
            id: Date.now().toString(),
            text: newTodoText,
            completed: false
        };

        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        setNewTodoText('');
        dispatch({
            type: 'UPDATE_TODOS',
            payload: { userName, todos: updatedTodos },
        });
    };

    const handleDeleteTodo = (todoId) => {
        const updatedTodos = todos.filter(todo => todo.id !== todoId);
        setTodos(updatedTodos);
        dispatch({
            type: 'UPDATE_TODOS',
            payload: { userName, todos: updatedTodos },
        });
    };

    if (!userName || !todoId || !selectedTodo) return null;

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <button 
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-500 hover:underline"
            >
                &larr; Back
            </button>
            <h1 className="text-2xl font-bold mb-4">{userName}'s Todo Detail</h1>
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
                {todos.map((todo) => (
                    <div key={todo.id} className="mb-2 flex items-center">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleComplete(todo.id)}
                            className="mr-2"
                        />
                        <span
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            className="text-lg mr-2"
                        >
                            {todo.text}
                        </span>
                        <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-red-500 text-xl"
                        >
                            &#x2212;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoDetail;
