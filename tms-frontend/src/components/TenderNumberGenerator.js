import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Paper, Typography, IconButton, MenuItem } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import axios from 'axios';
import Select from 'react-select';

const departments = ['IT', 'FIN', 'PSD', 'LSD', 'HR'];
const procurementTypes = ['NCT', 'ICT', 'SIS', 'RFQ', 'RT']; // National, International, Quote, Direct

const TenderNumberGenerator = () => {
  const [formData, setFormData] = useState({
    activityDescription: '',
    department: '',
    categoryCode: '',
    procurementType: '',
    amendmentNumber: '',
    callOffNumber: '',
    amendmentNumberOnContract: ''
  });
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [categoryCodes, setCategoryCodes] = useState([]);

  useEffect(() => {
    const fetchCategoryCodes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/codes');
        setCategoryCodes(response.data);
      } catch (error) {
        console.error('Failed to fetch category codes', error);
      }
    };

    fetchCategoryCodes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData({
      ...formData,
      [actionMeta.name]: selectedOption ? selectedOption.value : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tenders/generate-number', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setGeneratedNumber(response.data.tenderNumber);
      toast.success('Tender number generated successfully!');
    } catch (error) {
      toast.error('Failed to generate tender number');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNumber);
    toast.info('Tender number copied to clipboard!');
  };

  const categoryOptions = categoryCodes.map(code => ({
    value: code['Category Code'],
    label: `${code['Category Code']} - ${code['Category Description']}`
  }));

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Generate Tender Number
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Activity Description"
          name="activityDescription"
          value={formData.activityDescription}
          onChange={handleChange}
          required
          margin="normal"
          multiline
          rows={2}
        />
        
        <TextField
          select
          fullWidth
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          margin="normal"
        >
          {departments.map(dept => (
            <MenuItem key={dept} value={dept}>{dept}</MenuItem>
          ))}
        </TextField>

        <Select
          name="categoryCode"
          options={categoryOptions}
          value={categoryOptions.find(option => option.value === formData.categoryCode)}
          onChange={handleSelectChange}
          placeholder="Select Category Code"
          isClearable
        />

        <TextField
          select
          fullWidth
          label="Procurement Type"
          name="procurementType"
          value={formData.procurementType}
          onChange={handleChange}
          required
          margin="normal"
        >
          {procurementTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Amendment Number"
          name="amendmentNumber"
          value={formData.amendmentNumber}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Call-Off Number"
          name="callOffNumber"
          value={formData.callOffNumber}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Amendment Number on Contract"
          name="amendmentNumberOnContract"
          value={formData.amendmentNumberOnContract}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Generate Tender Number
        </Button>

        {generatedNumber && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6">Generated Tender Number:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {generatedNumber}
              </Typography>
              <IconButton onClick={handleCopy} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TenderNumberGenerator;
