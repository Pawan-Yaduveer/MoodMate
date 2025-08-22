import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save, Edit3, AlertCircle, Upload, X } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePic: user?.profilePic || ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || '');
  const fileInputRef = useRef(null);

  // Update preview when user data changes
  useEffect(() => {
    setPreviewUrl(user?.profilePic || '');
    setFormData({
      name: user?.name || '',
      profilePic: user?.profilePic || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    // Only validate URL if no file is selected and URL is provided
    if (!selectedFile && formData.profilePic && !isValidUrl(formData.profilePic)) {
      newErrors.profilePic = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePic: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePic: 'File size must be less than 5MB' }));
        return;
      }
      
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, profilePic: '' }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(formData.profilePic || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const removeCurrentProfilePic = () => {
    setFormData(prev => ({ ...prev, profilePic: '' }));
    setPreviewUrl('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      let profileData = { ...formData };
      
      // If a file was selected, convert it to base64 for storage
      if (selectedFile) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
        reader.readAsDataURL(selectedFile);
        
        try {
          const base64Data = await base64Promise;
          profileData.profilePic = base64Data;
        } catch (error) {
          console.error('Error converting file to base64:', error);
          setMessage('Error processing image file');
          setIsLoading(false);
          return;
        }
      }
      
      const result = await updateProfile(profileData);
      setIsLoading(false);

      if (result.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setIsLoading(false);
      setMessage('An unexpected error occurred');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      profilePic: user?.profilePic || ''
    });
    setErrors({});
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(user?.profilePic || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Form */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <AlertCircle className="w-5 h-5" />
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-24 h-24 rounded-full border-4 border-gray-200 bg-primary-600 flex items-center justify-center text-white text-3xl font-bold ${previewUrl ? 'hidden' : 'flex'}`}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 p-2 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors" onClick={openFileSelector}>
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                
                {isEditing ? (
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={openFileSelector}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Image</span>
                      </button>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={removeSelectedFile}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                      {formData.profilePic && !selectedFile && (
                        <button
                          type="button"
                          onClick={removeCurrentProfilePic}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove Current</span>
                        </button>
                      )}
                    </div>
                    
                    {/* File Info */}
                    {selectedFile && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                    
                    {/* URL Input (Alternative) */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Or enter image URL:
                      </label>
                      <input
                        type="url"
                        name="profilePic"
                        value={formData.profilePic}
                        onChange={handleChange}
                        className={`input-field ${errors.profilePic ? 'border-red-300 focus:ring-red-500' : ''}`}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">{formData.profilePic || 'No profile picture set'}</p>
                )}
                
                {errors.profilePic && (
                  <p className="mt-1 text-sm text-red-600">{errors.profilePic}</p>
                )}
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
              ) : (
                <p className="text-gray-900 text-lg">{formData.name}</p>
              )}
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Email address cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <p className="text-gray-900">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <p className="text-green-600 font-medium">
                  Active
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <p className="text-gray-500 text-sm font-mono">
                  {user?._id ? user._id.slice(-8) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Additional Settings */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <button className="btn-outline">Change</button>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Data Export</p>
                <p className="text-sm text-gray-600">Download your mood data</p>
              </div>
              <button className="btn-outline">Export</button>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-600">Permanently remove your account</p>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
