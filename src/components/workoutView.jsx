import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API_BASE_URL from '../api';
import AddExerciseToWorkout from './AddExerciseToWorkout'; // <-- import

const WorkoutView = () => {
    const { WorkOutId } = useParams();
    const [workout, setWorkout] = useState(null);
    const [showAddExercise, setShowAddExercise] = useState(false);

    const fetchWorkout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/workout-details/${WorkOutId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data Workout');
            }
            const data = await response.json();
            setWorkout(data);  
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (WorkOutId) {
            fetchWorkout();
        }
    }, [WorkOutId]);

    const handleExerciseAdded = () => {
        fetchWorkout(); // refresh the list after adding
        setShowAddExercise(false);
    };

    if (!workout) {
        return <div className='neuro-content'>Loading...</div>;
    }

    return (
        <div className='neuro-content'>
            <h1>{workout.description || 'No Workout Selected'}</h1>
            <h2>{workout.workout_date}</h2>


            <button 
                className="btn btn-secondary mb-3" 
                onClick={() => setShowAddExercise(prev => !prev)}
            >
                {showAddExercise ? 'Cancel' : '➕ Add Exercise'}
            </button>

            {showAddExercise && (
                <AddExerciseToWorkout 
                    workout_id={parseInt(WorkOutId)} 
                    muscle_group_id={workout.muscle_group_id}  // pass muscle group ID
                    onAdded={handleExerciseAdded} 

                />

            )}

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {workout.WorkoutEquipment.map((exercise) => (
                        <tr key={exercise.id}>
                            <td>
                                <Link to={`/edit-reps/${exercise.workout_id}/${exercise.equipment_id}`}>
                                    {exercise.equipment.description}
                                </Link>
                            </td>
                            <td>{exercise.WorkoutReps.length > 0 ? exercise.WorkoutReps[0].reps : '-'}</td>
                            <td>{exercise.WorkoutReps.length > 0 ? `${exercise.WorkoutReps[0].weight} lbs` : '-'}</td>
                            <td>
                                <button 
                                    className="btn btn-sm "
                                    onClick={async () => {
                                        try {
                                            const response = await fetch(`${API_BASE_URL}/workout-equipment/${exercise.id}`, {
                                                method: 'DELETE'
                                            });
                                            if (!response.ok) {
                                                throw new Error('Failed to delete exercise');
                                            }
                                            fetchWorkout(); // refresh instead of full reload
                                        } catch (error) {
                                            console.error('Delete error:', error);
                                        }
                                    }}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WorkoutView;
