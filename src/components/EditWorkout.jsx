import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';

const EditWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState({
    workout_date: '',
    description: '',
    comments: '',
    muscle_group_id: '',
  });

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workouts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch workout');
        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkout();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout),
      });
      if (!response.ok) throw new Error('Update failed');
      navigate('/workouts');
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Edit Workout</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="workout_date"
            value={workout.workout_date}
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            value={workout.description}
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comments</label>
          <textarea
            name="comments"
            value={workout.comments}
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/workouts')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditWorkout;
