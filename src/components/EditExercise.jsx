import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../api';

const EditExercise = ({ equipmentId, onFinish }) => {
  const [equipment, setEquipment] = useState(null);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [muscleLinks, setMuscleLinks] = useState([]);
  const [musclesMap, setMusclesMap] = useState({}); // id → description
  const [formData, setFormData] = useState({ description: '', options: '', muscle_group_id: '' });
  const [status, setStatus] = useState('');

  // Load equipment and associated muscles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqRes, musRes, allMusclesRes,allmuscleGroups] = await Promise.all([
          fetch(`${API_BASE_URL}/equipment/${equipmentId}`),
          fetch(`${API_BASE_URL}/equipment-muscles`),
          fetch(`${API_BASE_URL}/muscles`),
          fetch(`${API_BASE_URL}/muscle-groups`)
        ]);

        if (!eqRes.ok || !musRes.ok || !allMusclesRes.ok || !allmuscleGroups) throw new Error('Failed to load data');

        const eqData = await eqRes.json();
        const links = await musRes.json();
        const allMuscles = await allMusclesRes.json();
        const allmuscleGroupsData = await allmuscleGroups.json();

        setEquipment(eqData);
        setMuscleGroups(allmuscleGroupsData);

        setFormData({
          description: eqData.description || '',
          options: eqData.options || '',
          muscle_group_id: eqData.muscle_group_id  || 0
        });


        setMuscleLinks(links.filter(link => link.equipment_id === equipmentId));
        const musclesDict = {};
        allMuscles.forEach(m => musclesDict[m.id] = m.description);
        setMusclesMap(musclesDict);
      } catch (error) {
        console.error('Error loading data:', error);
        setStatus('Error loading data');
      }
    };

    fetchData();

  }, [equipmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await fetch(`${API_BASE_URL}/equipment/${equipmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          options: formData.options,
          muscle_group_id: parseInt(formData.muscle_group_id, 10)
        })
      });

      if (!res.ok) throw new Error('Failed to update exercise');
      setStatus('Exercise updated successfully.');
      if (onFinish) onFinish(); // Optional callback to parent
    } catch (error) {
      console.error('Update failed:', error);
      setStatus('Error updating exercise.');
    }
  };

  if (!equipment) return <p>Loading...</p>;

  return (
    <div className="neuro-content" style={{border: '1px solid black',marginTop:20}}>

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
          <label>Options:</label><br />
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
            {muscleGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.description}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="neuro-button-main" style={{ marginTop: '1rem' }}>Save Changes</button>
      </form>

      <hr />

      <h3>Muscles Used in This Exercise</h3>
      {muscleLinks.length > 0 ? (
        <ul>
          {muscleLinks.map(link => (
            <li key={link.id}>
              {musclesMap[link.muscle_id] || `Muscle ID ${link.muscle_id}`}
            </li>
          ))}
        </ul>
      ) : (
        <p>No muscles associated with this exercise.</p>
      )}
      <button className="neuro-button-main" onClick={() => onFinish()}>Add Muscle</button>

      {status && <p style={{ color: status.includes('Error') ? 'red' : 'green' }}>{status}</p>}
    </div>
  );
};

export default EditExercise;
