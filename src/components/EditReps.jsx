import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api';
import AddRepToExercise from './AddRepToExercise';

const EditReps = () => {
    const { workoutId, equipmentId } = useParams();
    const navigate = useNavigate();
    const [workoutEquipment, setWorkoutEquipment] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchWorkoutEquipment = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/equipment-workout-reps/${workoutId}/${equipmentId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch workout reps');
            }
            const data = await response.json();
            setWorkoutEquipment(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchWorkoutEquipment();
    }, [workoutId, equipmentId]);

    const handleRepChange = (index, field, value) => {
        const updatedReps = [...workoutEquipment.reps];
        updatedReps[index][field] = value;
        setWorkoutEquipment({ ...workoutEquipment, reps: updatedReps });
    };

    const handleSave = async () => {
        try {
            if (!workoutEquipment?.reps || !Array.isArray(workoutEquipment.reps)) {
                throw new Error('Invalid workoutEquipment.reps');
            }

            for (const rep of workoutEquipment.reps) {
                const response = await fetch(`${API_BASE_URL}/workout-reps/${rep.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rep),
                });

                if (!response.ok) {
                    throw new Error(`Failed to save rep: ${JSON.stringify(rep)}`);
                }
            }

            navigate(-1); // Go back
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const handleDelete = async (repId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/workout-reps/${repId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete rep');
            }

            // Refresh after deletion
            fetchWorkoutEquipment();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    if (!workoutEquipment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container my-4">
            <h2 className="mb-4">{workoutEquipment.description}</h2>
    
            <div className="table-responsive">
                <table className="table table-striped table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Reps</th>
                            <th>Weight</th>
                            <th>Comments</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workoutEquipment.reps.map((rep, index) => (
                            <tr key={rep.id}>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={rep.reps}
                                        onChange={(e) => handleRepChange(index, 'reps', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={rep.weight}
                                        onChange={(e) => handleRepChange(index, 'weight', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={rep.comments}
                                        onChange={(e) => handleRepChange(index, 'comments', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rep.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            <div className="d-flex gap-2 mt-3">
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                <button className="btn btn-outline-secondary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : 'Add Rep'}
                </button>
            </div>
    
            {showAddForm && (
                <div className="mt-4">
                    <AddRepToExercise
                        workout_equipment_id={workoutEquipment.id}
                        onRepAdded={fetchWorkoutEquipment}
                    />
                </div>
            )}
        </div>
    );
    
};

export default EditReps;
