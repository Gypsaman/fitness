import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api';

const AddExerciseToWorkout = ({ workout_id, muscle_group_id: initialGroupId, onAdded }) => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipment_id, setEquipmentId] = useState('');
  const [options, setOptions] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch all muscle groups on mount
  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/muscle-groups`);
        const data = await res.json();
        setMuscleGroups(data);
      } catch (err) {
        console.error('Failed to fetch muscle groups', err);
      }
    };
    fetchMuscleGroups();
  }, []);

  // Fetch equipment when selected muscle group changes
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/equipment`);
        const data = await response.json();
        const filtered = data.filter(eq => eq.muscle_group_id === selectedGroupId);
        setEquipmentList(filtered);
        setEquipmentId(''); // reset selection when group changes
      } catch (error) {
        console.error('Failed to fetch equipment', error);
      }
    };
    if (selectedGroupId) {
      fetchEquipment();
    }
  }, [selectedGroupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/workout-equipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_id,
          equipment_id: parseInt(equipment_id),
          options,
        }),
      });

      if (!res.ok) throw new Error('Failed to add exercise');
      const result = await res.json();
      setSuccessMsg('Exercise added!');
      setOptions('');
      setEquipmentId('');
      if (onAdded) onAdded(result);
    } catch (err) {
      console.error(err);
      setSuccessMsg('Failed to add exercise');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <div className="mb-2">
        <label className="form-label">Muscle Group</label>
        <select
          className="form-select"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(parseInt(e.target.value))}
        >
          <option value="">Select muscle group</option>
          {muscleGroups.map(group => (
            <option key={group.id} value={group.id}>
              {group.description}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label">Equipment</label>
        <select
          className="form-select"
          value={equipment_id}
          onChange={(e) => setEquipmentId(e.target.value)}
          required
        >
          <option value="">Select equipment</option>
          {equipmentList.map(eq => (
            <option key={eq.id} value={eq.id}>
              {eq.description} {eq.options && `(${eq.options})`}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label">Options (optional)</label>
        <input
          className="form-control"
          type="text"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Exercise'}
        </button>
      </div>
      {successMsg && <div className="mt-2 alert alert-info">{successMsg}</div>}
    </form>
  );
};

export default AddExerciseToWorkout;
