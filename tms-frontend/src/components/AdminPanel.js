import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [type, setType] = useState('');
    const [value, setValue] = useState('');

    const handleAddOption = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/tenders/add-option', { type, value });
            alert(response.data.message);
        } catch (error) {
            alert('Error adding option');
        }
    };

    return (
        <form onSubmit={handleAddOption}>
            <div>
                <label>Type:</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="department">Department</option>
                    <option value="categoryCode">Category Code</option>
                    <option value="procurementType">Procurement Type</option>
                </select>
            </div>
            <div>
                <label>Value:</label>
                <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <button type="submit">Add Option</button>
        </form>
    );
};

export default AdminPanel;