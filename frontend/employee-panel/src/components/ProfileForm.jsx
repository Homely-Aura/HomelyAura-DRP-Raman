// TODO: component
import React from 'react';
import './ProfileForm.css';

/**
 * Displays the employee profile form.
 * Props:
 *  • form: { name, designation, age, gender, dateOfJoining, photo }
 *  • onChange(event): handle all text/select inputs
 *  • onPhotoChange(event): handle file → base64
 *  • onSubmit(event): save profile
 *  • loading: boolean (disable submit)
 *  • error: string (display any error)
 */
const ProfileForm = ({ form, onChange, onPhotoChange, onSubmit, loading, error }) => {
  return (
    <div className="profile-form">
      <h1>Employee Profile</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Designation
          <input
            name="designation"
            value={form.designation}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Age
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Gender
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            required
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Date of Joining
          <input
            name="dateOfJoining"
            type="date"
            value={form.dateOfJoining}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Photo
          <input
            name="photo"
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
          />
        </label>
        {form.photo && (
          <img
            src={form.photo}
            alt="Profile Preview"
            className="profile-preview"
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
