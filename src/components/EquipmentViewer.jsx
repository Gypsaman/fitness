import React, { useState, useEffect } from 'react';
import AddExercise from './AddExercise';
import EditExercise from './EditExercise';

import API_BASE_URL from '../api';

// Set your API base path once here


const EquipmentViewer = () => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [addingExercise, setAddingExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);


  useEffect(() => {
    // Fetch all muscle groups
    const fetchMuscleGroups = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/muscle-groups`);
        if (!response.ok) throw new Error('Failed to fetch muscle groups');
        const data = await response.json();
        setMuscleGroups(data);
      } catch (error) {
        console.error('Error fetching muscle groups:', error);
      }
    };

    fetchMuscleGroups();
  }, []);

  const fetchEquipmentForGroup = async (groupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipment`);
      if (!response.ok) throw new Error('Failed to fetch equipment');
      const data = await response.json();
      setEquipmentList(data);
      const filtered = data.filter(item => item.muscle_group_id === groupId);
      setFilteredEquipment(filtered);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };
  useEffect(() => {
    if (selectedGroupId !== null) {
      fetchEquipmentForGroup(selectedGroupId);
    }
  }, [selectedGroupId]);
  

  const handleGroupChange = (e) => {
    const groupId = parseInt(e.target.value, 10);
    setSelectedGroupId(groupId);

  };
  const AddEExercise = () => {
    // Add new exercise logic here
    setAddingExercise(true);

  };

  return (
    <div className="neuro-content">
      <h1>Exercises</h1>

      <select id="muscle-group-select" onChange={handleGroupChange} defaultValue="" style={{marginTop:50}}>
        <option value="" disabled>Select a group</option>
        {muscleGroups.map(group => (
          <option key={group.id} value={group.id}>
            {group.description}
          </option>
        ))}
      </select>

      {filteredEquipment.length > 0 ? (
        <div style={{marginTop:20}}>
          <ul>
            {filteredEquipment.map(eq => (
                <li key={eq.id}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedEquipmentId(eq.id);
                      setEditingExercise(true);
                    }}
                  >
                    {eq.description} {eq.options && `(${eq.options})`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
    ) : 
    (
      <p>No equipment found for this muscle group.</p>
    )}
    <button classname="neuro-button-main" onClick={() => AddEExercise()}>Add Exercise</button>

    {addingExercise && (
      <AddExercise
        onExerciseAdded={() => {
          fetchEquipmentForGroup(selectedGroupId);
          setAddingExercise(false);
        }}
      />

    )
    }

    {editingExercise  && (
      <EditExercise
        equipmentId={selectedEquipmentId}
        onFinish={() => {
          fetchEquipmentForGroup(selectedGroupId);
          setSelectedEquipmentId(null);
          setEditingExercise(false);
        }}
      />
    )}
    
    </div>

  );
};

export default EquipmentViewer;
