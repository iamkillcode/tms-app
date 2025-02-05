import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import Footer from '../components/Footer';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    additionalFields: [],
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Handle file upload for avatar
  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image/*': []},
    maxSize: 1024 * 1024, // 1MB
    onDrop: acceptedFiles => {
      setAvatarPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  });

  // Sample departments - replace with your actual data
  const departments = [
    'Procurement',
    'Finance',
    'Operations',
    'Human Resources',
    'IT'
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load profile');
        
        const data = await response.json();
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          additionalFields: data.additionalFields || []
        });
        if (data.avatarUrl) setAvatarPreview(data.avatarUrl);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalFieldChange = (index, e) => {
    const newFields = [...profileData.additionalFields];
    newFields[index].value = e.target.value;
    setProfileData(prev => ({ ...prev, additionalFields: newFields }));
  };

  const addNewField = () => {
    setProfileData(prev => ({
      ...prev,
      additionalFields: [...prev.additionalFields, { label: '', value: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!profileData.name.trim()) {
      return setError('Name is required');
    }
    
    if (!/^\+?[\d\s-]{8,}$/.test(profileData.phone)) {
      return setError('Invalid phone number format');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          department: profileData.department,
          additionalFields: profileData.additionalFields
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      // Handle avatar upload if new image was added
      if (avatarPreview && typeof avatarPreview !== 'string') {
        await uploadAvatar(avatarPreview);
      }

      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch('/api/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Avatar upload failed');
    }
    
    return response.json();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-gray-400">Click to upload</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Recommended size: 500x500px. Formats: JPG, PNG.
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={profileData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  disabled={!isEditing}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Additional Information</h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={addNewField}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add New Field
                </button>
              )}
            </div>
            <div className="space-y-4">
              {profileData.additionalFields.map((field, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => {
                      const newFields = [...profileData.additionalFields];
                      newFields[index].label = e.target.value;
                      setProfileData(prev => ({ ...prev, additionalFields: newFields }));
                    }}
                    className="w-1/3 px-4 py-2 border rounded-md"
                    placeholder="Field Label"
                    disabled={!isEditing}
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleAdditionalFieldChange(index, e)}
                    className="w-2/3 px-4 py-2 border rounded-md"
                    placeholder="Field Value"
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 