import React, { useState } from 'react';
import axios from 'axios';

const ISOForm = ({ tenderId }) => {
    const [division, setDivision] = useState('');
    const [department, setDepartment] = useState('');
    const [typeOfLetter, setTypeOfLetter] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!tenderId) {
            alert('No tender selected for ISO generation.');
            return;
        }
        const response = await axios.post(`/api/isos/generate-iso`, {
            division, department, typeOfLetter, tenderId
        });
        alert(`Generated ISO Number: ${response.data.isoNumber}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Division:</label>
                <select value={division} onChange={e => setDivision(e.target.value)}>
                    <option value="CSD">CSD - Corporate Services Division</option>
                    {/* Add more options dynamically */}
                </select>
            </div>
            <div>
                <label>Department:</label>
                <select value={department} onChange={e => setDepartment(e.target.value)}>
                    <option value="PSD">PSD - Procurement and Supply Chain Department</option>
                    {/* Add more options dynamically */}
                </select>
            </div>
            <div>
                <label>Type of Letter:</label>
                <select value={typeOfLetter} onChange={e => setTypeOfLetter(e.target.value)}>
                    <option value="RFQ">RFQ - Request for Quotation</option>
                    {/* Add more options dynamically */}
                </select>
            </div>
            <button type="submit">Generate ISO Number</button>
        </form>
    );
};

export default ISOForm; 