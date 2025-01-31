import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TenderManagement = () => {
  const [tenders, setTenders] = useState([]);
  const [tenderNumber, setTenderNumber] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const fetchTenders = async () => {
      const response = await axios.get('/api/tenders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTenders(response.data);
    };
    fetchTenders();
  }, []);

  const handleCreateTender = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/tenders',
        { tenderNumber, details },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTenders([...tenders, response.data]);
      setTenderNumber('');
      setDetails('');
    } catch (error) {
      alert('Error creating tender');
    }
  };

  const handleCreateISO = async (tenderId) => {
    try {
      const response = await axios.post(
        `/api/isos/${tenderId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(`ISO number created: ${response.data.isoNumber}`);
    } catch (error) {
      alert('Error creating ISO number');
    }
  };

  return (
    <div>
      <h2>Tender Management</h2>
      <form onSubmit={handleCreateTender}>
        <input
          type="text"
          value={tenderNumber}
          onChange={(e) => setTenderNumber(e.target.value)}
          placeholder="Tender Number"
          required
        />
        <input
          type="text"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Details"
        />
        <button type="submit">Create Tender</button>
      </form>
      <ul>
        {tenders.map((tender) => (
          <li key={tender._id}>
            {tender.tenderNumber}
            <button onClick={() => handleCreateISO(tender._id)}>Create ISO</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TenderManagement; 