import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicDropdown = ({ apiUrl, label }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setOptions(response.data);
            } catch (error) {
                console.error('Failed to fetch options', error);
            }
        };

        fetchOptions();
    }, [apiUrl]);

    return (
        <div>
            <label>{label}:</label>
            <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                {options.map(option => (
                    <option key={option.id} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DynamicDropdown; 