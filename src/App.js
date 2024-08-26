// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupTodo from './components/GroupTodo';
import TodoDetail from './components/TodoDetail';
import UserManagement from './components/UserManagement'; // Import the Home component
import './tailwind.css';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserManagement />} />
                <Route path="/group-todo" element={<GroupTodo />} />
                <Route path="/todo-detail/:userName/:todoId" element={<TodoDetail />} />
            </Routes>
        </Router>
    );
};

export default App;
