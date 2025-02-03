import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const TenderForm = () => {
    const [department, setDepartment] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [procurementType, setProcurementType] = useState('');
    const [lotNumber, setLotNumber] = useState('');
    const [amendmentNumber, setAmendmentNumber] = useState('');
    const [callOffNumber, setCallOffNumber] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post('/api/tenders/generate-number', {
            department, categoryCode, procurementType, lotNumber, amendmentNumber, callOffNumber
        });
        alert(`Generated Tender Number: ${response.data.tenderNumber}`);
    };

    // Function to read category codes from an Excel file
    const readCategoryCodesFromExcel = () => {
        const url = './src/assets/categories.xlsx'; // Update with the actual path
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const workbook = XLSX.read(buffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                // Process data to extract category codes
                // This is a placeholder and should be replaced with actual logic
                console.log(data);
            });
    };

    useEffect(() => {
        readCategoryCodesFromExcel();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Department:</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="PSD">PSD - Procurement and Supply Chain Department</option>
                    {/* Add more options dynamically */}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category Code:</label>
                <select value={categoryCode} onChange={e => setCategoryCode(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="A.0">A.0 - Example Category</option>
                    {/* Add more options dynamically from Excel */}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Procurement Type:</label>
                <select value={procurementType} onChange={e => setProcurementType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="NCT">NCT - National Competitive Tender</option>
                    {/* Add more options dynamically */}
                </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Generate Tender Number</button>
        </form>
    );
};

export default TenderForm; 