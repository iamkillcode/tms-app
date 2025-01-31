import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await axios.post('/api/auth/signup', { fullName, username, email, password });
            alert('User created successfully');
        } catch (error) {
            alert('Error creating user');
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField label="Full Name" variant="outlined" fullWidth value={fullName} onChange={e => setFullName(e.target.value)} required />
                <TextField label="Username" variant="outlined" fullWidth value={username} onChange={e => setUsername(e.target.value)} required />
                <TextField label="Email" variant="outlined" fullWidth type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <TextField label="Password" variant="outlined" fullWidth type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <TextField label="Confirm Password" variant="outlined" fullWidth type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <Button type="submit" variant="contained" color="primary" fullWidth>Sign Up</Button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default SignUp; 