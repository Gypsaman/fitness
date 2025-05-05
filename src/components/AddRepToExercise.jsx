import React, { useState } from 'react';
import API_BASE_URL from '../api';

const AddRepToExercise = ({ workout_equipment_id, onRepAdded }) => {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log(workout_equipment_id);
      const response = await fetch(`${API_BASE_URL}/workout-reps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_equipment_id,
          reps: parseInt(reps),
          weight: parseFloat(weight),
          comments,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add rep');
      }

      const result = await response.json();
      if (onRepAdded) onRepAdded(result);

      setReps('');
      setWeight('');
      setComments('');
    } catch (err) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };
  console.log('workout_equipment_id:', workout_equipment_id);
  return (
    <div className="card p-3 mt-3">
      <h5>Add Rep</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Reps</label>
          <input
            type="number"
            className="form-control"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Weight</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Comments</label>
          <input
            type="text"
            className="form-control"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Rep'}
        </button>
      </form>
    </div>
  );
};

export default AddRepToExercise;
