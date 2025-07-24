// src/pages/ProfileSetup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import employeeService from '../services/employeeService';
import { handleApiError } from '../utils/helpers';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const [form, setForm] = useState({
    designation: '',
    age: '',
    gender: '',
    dateOfJoining: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getProfile();
        const profile = data.profile;
        if (profile) {
          setForm({
            designation: profile.designation || '',
            age: profile.age || '',
            gender: profile.gender || '',
            dateOfJoining: profile.dateOfJoining?.split('T')[0] || ''
          });
          setPreview(profile.photo || '');
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoto = e => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setError('');
      const formData = new FormData();
      formData.append('designation', form.designation);
      formData.append('age', form.age);
      formData.append('gender', form.gender);
      formData.append('dateOfJoining', form.dateOfJoining);
      if (file) formData.append('photo', file);

      await employeeService.saveProfile(formData);
      // Once saved, go to dashboard (which will render the Profile view)
      navigate('/');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) return <p>Loading profile…</p>;

  return (
    <div className="profile-setup">
      <h1>Setup Your Profile</h1>
      {user?.name && <p className="greeting">Welcome, {user.name}!</p>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Designation
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Age
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select…</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Date of Joining
          <input
            name="dateOfJoining"
            type="date"
            value={form.dateOfJoining}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Photo
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={handlePhoto}
          />
        </label>

        {preview && (
          <div className="photo-preview">
            <img src={preview} alt="Profile Preview" />
          </div>
        )}

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
