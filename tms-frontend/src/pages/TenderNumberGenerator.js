import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import categories from '../assets/categories.json';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

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
  const [sequentialNumber, setSequentialNumber] = useState(null);
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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
    { value: 'SIS', label: 'Single Source (SIS)' },
    { value: 'NCT', label: 'National Competitive Tendering (NCT)' },
    { value: 'RT', label: 'Request for Tenders (RT)' },
    { value: 'RFQ', label: 'Request for Quotation (RFQ)' },
    { value: 'ICT', label: 'International Competitive Tendering (ICT)' }
  ];

  const saveTenderNumber = async (tenderNumber, sequentialNumber) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/tenders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            ...formData,
            tenderNumber,
            generatedDate: new Date().toISOString(),
            generatedBy: user.id,
            sequentialNumber
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save tender number');
      }
    } catch (error) {
      console.error('Save failed:', error);
      throw error; // Re-throw to handle in generateTenderNumber
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.activity?.trim()) {
      errors.activity = 'Activity title is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    if (!formData.procurementType) {
      errors.procurementType = 'Procurement type is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateTenderNumber = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    try {
      // Verify environment variable
      if (!process.env.REACT_APP_API_URL) {
        throw new Error('API base URL is not configured');
      }

      console.log('API URL:', process.env.REACT_APP_API_URL);

      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/tenders/sequential`;
      console.log('API URL:', apiUrl); // Debugging

      const seqResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!seqResponse.ok) {
        const errorText = await seqResponse.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const seqData = await seqResponse.json();
      const currentYear = new Date().getFullYear();

      // Validate required fields
      if (!formData.category || !formData.procurementType) {
        throw new Error('Category and Procurement Type are required');
      }

      // Format components according to specification
      const formattedParts = {
        base: `FDA/PSD/${currentYear}/${formData.category["Category Code"]}`,
        procurement: `${formData.procurementType}-${seqData.sequentialNumber.toString().padStart(4, '0')}`,
        lot: formData.lotNumber ? `(${formData.lotNumber.padStart(2, '0')})` : '',
        callOff: formData.callOffNumber ? `(C${formData.callOffNumber.padStart(2, '0')})` : '',
        amendment: formData.amendmentNumber ? `(A${formData.amendmentNumber.padStart(2, '0')})` : ''
      };

      // Combine parts with proper spacing
      const tenderNumber = [
        formattedParts.base,
        formattedParts.procurement,
        formattedParts.lot,
        formattedParts.callOff,
        formattedParts.amendment
      ].filter(Boolean).join(' ');

      // Save to database
      await saveTenderNumber(tenderNumber, seqData.sequentialNumber);
      setGeneratedNumber(tenderNumber);
      
      // Auto-copy to clipboard
      navigator.clipboard.writeText(tenderNumber);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);

    } catch (error) {
      console.error('Generation failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Tender Number</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Activity Title</label>
            <input
              type="text"
              value={formData.activity}
              onChange={(e) => setFormData({...formData, activity: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Category Searchable Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={(selected) => setFormData({...formData, category: selected})}
              isSearchable
              required
            />
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Category Type</label>
            <Select
              options={categoryTypeOptions}
              value={categoryTypeOptions.find(opt => opt.value === formData.categoryType)}
              onChange={(selected) => setFormData({...formData, categoryType: selected.value})}
              required
            />
          </div>

          {/* Procurement Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Procurement Type</label>
            <Select
              options={procurementTypeOptions}
              value={procurementTypeOptions.find(opt => opt.value === formData.procurementType)}
              onChange={(selected) => setFormData({...formData, procurementType: selected.value})}
              required
            />
          </div>

          {/* Optional Fields */}
          <div>
            <label className="block text-sm font-medium mb-2">Lot Number</label>
            <input
              type="number"
              min="0"
              value={formData.lotNumber}
              onChange={(e) => setFormData({...formData, lotNumber: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Call Off Number</label>
            <input
              type="number"
              min="0"
              value={formData.callOffNumber}
              onChange={(e) => setFormData({...formData, callOffNumber: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amendment Number</label>
            <input
              type="number"
              min="0"
              value={formData.amendmentNumber}
              onChange={(e) => setFormData({...formData, amendmentNumber: e.target.value})}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={generateTenderNumber}
            disabled={loading || !formData.category || !formData.procurementType}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Tender Number'}
          </button>
        </div>

        {/* Generated Number Display */}
        {generatedNumber && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md relative">
            <h3 className="text-lg font-semibold mb-2">Generated Tender Number:</h3>
            <div className="flex items-center justify-between bg-white p-3 rounded-md">
              <code className="text-xl font-mono select-all">
                {generatedNumber}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedNumber);
                  setShowCopied(true);
                  setTimeout(() => setShowCopied(false), 2000);
                }}
                className="ml-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <ClipboardDocumentIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            {/* Copied feedback */}
            {showCopied && (
              <div className="absolute right-0 -top-8 bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm">
                Copied to clipboard!
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        {Object.keys(validationErrors).length > 0 && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
            {Object.values(validationErrors).map((err, index) => (
              <div key={index}>• {err}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderNumberGenerator;