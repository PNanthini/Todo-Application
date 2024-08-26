import React, { createContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Define the initial state structure
const initialState = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    todos: JSON.parse(localStorage.getItem('todos')) || {},
};

// Create context
const GlobalStateContext = createContext(initialState);

// Reducer function to handle state updates
const globalStateReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_USER':
            const updatedUsers = [...state.users, action.payload];
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            return { ...state, users: updatedUsers };
            case 'DELETE_USER':
                const newUsers = state.users.filter(user => user.name !== action.payload);
                return {
                    ...state,
                    users: newUsers,
                    todos: Object.fromEntries(
                        Object.entries(state.todos).filter(([key]) => key !== action.payload)
                    ),
                };
        case 'ADD_TODO':
            const addedTodos = {
                ...state.todos,
                [action.payload.userName]: [
                    ...(state.todos[action.payload.userName] || []),
                    action.payload.todo
                ]
            };
            localStorage.setItem('todos', JSON.stringify(addedTodos));
            return { ...state, todos: addedTodos };

            case 'UPDATE_TODOS':
                return {
                    ...state,
                    todos: {
                        ...state.todos,
                        [action.payload.userName]: action.payload.todos
                    }
                }; 

        case 'DELETE_TODO':
            const todosAfterDeletion = {
                ...state.todos,
                [action.payload.userName]: state.todos[action.payload.userName].filter(
                    todo => todo.id !== action.payload.todoId
                )
            };
            localStorage.setItem('todos', JSON.stringify(todosAfterDeletion));
            return { ...state, todos: todosAfterDeletion };

        default:
            return state;
    }
};

// GlobalStateProvider component to wrap the application
export const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(globalStateReducer, initialState);

    return (
        <GlobalStateContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export default GlobalStateContext;
