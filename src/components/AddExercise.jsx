import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../api';

const AddExercise = ({ onExerciseAdded }) => {

  const [muscleGroups, setMuscleGroups] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    options: '',
    muscle_group_id: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/muscle-groups`);
        const data = await res.json();
        setMuscleGroups(data);
      } catch (err) {
        console.error('Failed to fetch muscle groups:', err);
      }
    };
    fetchMuscleGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Exercise added successfully!');
    setFormData({ description: '', options: '', muscle_group_id: '' });
    if (onExerciseAdded) onExerciseAdded();  // <-- invoke callback


    try {
      const response = await fetch(`${API_BASE_URL}/equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          options: formData.options,
          muscle_group_id: parseInt(formData.muscle_group_id, 10)
        })
      });

      if (!response.ok) throw new Error('Failed to add exercise');

      setStatusMessage('Exercise added successfully!');
      setFormData({ description: '', options: '', muscle_group_id: '' });
    } catch (error) {
      console.error('Submit failed:', error);
      setStatusMessage('Error: Could not add exercise.');
    }
  };

  return (
    <div className="neuro-content" style={{marginTop:40}}>
      <h2>Add Exercise</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label><br />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Options (optional):</label><br />
          <input
            type="text"
            name="options"
            value={formData.options}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Muscle Group:</label><br />
          <select
            name="muscle_group_id"
            value={formData.muscle_group_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select group</option>
            {muscleGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.description}
              </option>
            ))}
          </select>
        </div>

        <br />
        <button type="submit">Add Exercise</button>
      </form>

      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default AddExercise;
