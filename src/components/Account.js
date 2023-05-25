import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import '../styles/account.css';

const Account = () => {
    return (
        <main className='main'>
            <Router>
                <div className='logo'>
                    <p>Assets</p>
                    <span>Tracker</span>
                </div>
                <Routes>
                    <Route 
                    path='/' 
                    element={<Login />}/>
                    <Route 
                        path='/signup' 
                        element={<SignUp />}
                    />
                </Routes>
            </Router>
        </main>
    )
}

export default Account