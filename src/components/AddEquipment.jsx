import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../api';

const AddEquipment = ({ onSuccess }) => {
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState('');
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [muscleGroupId, setMuscleGroupId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/muscle-groups`);
        if (!response.ok) throw new Error('Failed to fetch muscle groups');
        const data = await response.json();
        setMuscleGroups(data);
      } catch (err) {
        console.error('Error fetching muscle groups:', err);
      }
    };

    fetchMuscleGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          options,
          muscle_group_id: parseInt(muscleGroupId),
        }),
      });

      if (!response.ok) throw new Error('Failed to add equipment');

      setMessage('Equipment added successfully!');
      setDescription('');
      setOptions('');
      setMuscleGroupId('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('Error adding equipment');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Add Equipment</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Options</label>
          <input
            type="text"
            className="form-control"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Muscle Group</label>
          <select
            className="form-select"
            value={muscleGroupId}
            onChange={(e) => setMuscleGroupId(e.target.value)}
            required
          >
            <option value="">Select a muscle group</option>
            {muscleGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.description || `Group ${group.id}`}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Equipment</button>
      </form>
    </div>
  );
};

export default AddEquipment;
