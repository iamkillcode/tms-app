import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import categories from '../assets/categories.json';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TenderNumberGenerator = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    activity: '',
    category: null,
    categoryType: '',
    procurementType: '',
    lotNumber: '',
    callOffNumber: '',
    amendmentNumber: '',
    status: 'in-progress'
  });
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [lastNumber, setLastNumber] = useState(0);
  const navigate = useNavigate();

  // Category options for react-select
  const categoryOptions = categories.map(cat => ({
    value: cat["Category Code"],
    label: (
      <div>
        <div className="font-semibold">{cat["Category Code"]}</div>
        <div className="text-sm text-gray-500 whitespace-pre-wrap">
          {cat["Category Description"].split('\\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    )
  }));

  // Static dropdown options
  const categoryTypeOptions = [
    { value: 'Goods', label: 'Goods' },
    { value: 'Technical Service', label: 'Technical Service' },
    { value: 'Works', label: 'Works' },
    { value: 'Consultancy', label: 'Consultancy' }
  ];

  const procurementTypeOptions = [
    { value: 'SIS', label: 'Single Source Procedure (SIS)' },
    { value: 'NCT', label: 'National Competitive Tendering (NCT)' },
    { value: 'RT', label: 'Restricted Tendering (RT)' },
    { value: 'RFQ', label: 'Request for Quotation (RFQ)' },
    { value: 'ICT', label: 'International Competitive Tendering (ICT)' }
  ];

  const getNextSequence = useCallback(async () => {
    try {
      const response = await axios.get('/api/tenders/next-sequence', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      return response.data.sequentialNumber;
    } catch (err) {
      throw new Error('Failed to get sequence number');
    }
  }, []);

  const generateTenderNumber = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const formattedNumber = await generateFormattedTenderNumber(formData);
      setGeneratedNumber(formattedNumber);
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateFormattedTenderNumber = async (data) => {
    try {
      console.log('Starting tender number generation...'); // Debug log
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Use axios instead of fetch
      const response = await axios.get('/api/tenders/next-sequence', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Server response:', response.data); // Debug log

      const { sequentialNumber } = response.data;
      if (!sequentialNumber && sequentialNumber !== 0) {
        throw new Error('Invalid sequence number received');
      }

      // Format the sequential number
      const formattedSeqNumber = String(sequentialNumber).padStart(4, '0');
      
      // Validate required fields
      if (!data.category?.value) {
        throw new Error('Category is required');
      }
      if (!data.procurementType) {
        throw new Error('Procurement type is required');
      }

      // Build tender number
      let tenderNumber = `FDA/PSD/${new Date().getFullYear()}/${data.category.value}/${data.procurementType}-${formattedSeqNumber}`;
      
      // Add optional components
      if (data.lotNumber) {
        tenderNumber += ` (${String(data.lotNumber).padStart(2, '0')})`;
      }
      if (data.callOffNumber) {
        tenderNumber += ` (C${String(data.callOffNumber).padStart(2, '0')})`;
      }
      if (data.amendmentNumber) {
        tenderNumber += ` (A${data.amendmentNumber})`;
      }

      console.log('Generated tender number:', tenderNumber); // Debug log
      return tenderNumber;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(`Failed to format tender number: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('Please log in again');
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!formData.activity?.trim()) {
        throw new Error('Activity is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      if (!formData.categoryType?.trim()) {
        throw new Error('Category Type is required');
      }
      if (!formData.procurementType?.trim()) {
        throw new Error('Procurement Type is required');
      }

      // First generate the tender number
      const formattedTenderNumber = await generateFormattedTenderNumber(formData);

      // Create the tender data
      const tenderData = {
        activity: formData.activity,
        category: formData.category?.value || '',
        categoryType: formData.categoryType,
        procurementType: formData.procurementType,
        lotNumber: formData.lotNumber || '',
        callOffNumber: formData.callOffNumber || '',
        amendmentNumber: formData.amendmentNumber || '',
        status: 'active',
        tenderNumber: formattedTenderNumber,
      };

      const response = await fetch('http://localhost:5000/api/tenders/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tenderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tender');
      }

      const savedTender = await response.json();
      toast.success(`Tender number generated: ${savedTender.tenderNumber}`);
      
      // Reset form after successful submission
      setFormData({
        activity: '',
        category: null,
        categoryType: '',
        procurementType: '',
        lotNumber: '',
        callOffNumber: '',
        amendmentNumber: ''
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add error boundary
  if (!categories || categories.length === 0) {
    return (
      <div className="p-6 text-red-600">
        Error: Categories data could not be loaded. Please check the categories.json file.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Generate Tender Number</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Title
              </label>
              <input
                type="text"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(selected) => setFormData({...formData, category: selected})}
                  className="basic-select"
                  classNamePrefix="select"
                  isSearchable
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Type
                </label>
                <Select
                  options={categoryTypeOptions}
                  value={categoryTypeOptions.find(opt => opt.value === formData.categoryType)}
                  onChange={(selected) => setFormData({...formData, categoryType: selected.value})}
                  className="basic-select"
                  classNamePrefix="select"
                  required
                />
              </div>
            </div>

            {/* Procurement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Procurement Type
              </label>
              <Select
                options={procurementTypeOptions}
                value={procurementTypeOptions.find(opt => opt.value === formData.procurementType)}
                onChange={(selected) => setFormData({...formData, procurementType: selected.value})}
                className="basic-select"
                classNamePrefix="select"
                required
              />
            </div>

            {/* Optional Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lot Number (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Off Number (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  name="callOffNumber"
                  value={formData.callOffNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amendment Number (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  name="amendmentNumber"
                  value={formData.amendmentNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Generating...' : 'Generate Tender Number'}
            </button>
          </form>

          {/* Generated Number Display */}
          {generatedNumber && (
            <div className="mt-6 p-6 bg-white rounded-lg border-2 border-indigo-100">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Generated Tender Number:</h3>
              <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-md">
                <code className="text-xl font-mono select-all text-indigo-800 tracking-wider">
                  {generatedNumber}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedNumber);
                    setShowCopied(true);
                    toast.success('Copied to clipboard!');
                    setTimeout(() => setShowCopied(false), 2000);
                  }}
                  className="ml-4 p-2 hover:bg-indigo-100 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  <ClipboardDocumentIcon className="h-6 w-6 text-indigo-600" />
                </button>
              </div>
              {showCopied && (
                <p className="mt-2 text-sm text-green-600 text-center">
                  Tender number copied to clipboard
                </p>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderNumberGenerator;