import React, { useState, useContext, useEffect } from 'react';
import GlobalStateContext from '../context/GlobalState';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(GlobalStateContext);
    const [userName, setUserName] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(state.users.map(user => user.name)); // Ensure you are using the correct state structure
    }, [state.users]);

    const addUser = () => {
        if (userName.trim()) {
            const newUser = { id: Date.now(), name: userName };
            dispatch({ type: 'ADD_USER', payload: newUser });
            setUserName('');
        }
    };

    const handleDeleteUser = (userName) => {
        dispatch({ type: 'DELETE_USER', payload: userName });
    };

    const handleViewTodos = (userName) => {
        navigate('/group-todo', { state: { userName } });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter User Name"
                    className="border p-2 mr-2"
                />
                <button onClick={addUser} className="bg-blue-500 text-white p-2">Add User</button>
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2">User List</h2>
                <ul className="list-disc pl-6">
                    {users.map((userName) => (
                        <li key={userName} className="mb-2 flex justify-between items-center">
                            <span
                                className="text-lg cursor-pointer"
                                onClick={() => handleViewTodos(userName)}
                            >
                                {userName}
                            </span>
                            <button
                                onClick={() => handleDeleteUser(userName)}
                                className="text-red-500 text-3xl ml-4"
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

export default UserManagement;
