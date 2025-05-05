import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';
import API_BASE_URL from '../api';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workouts`);
        if (!response.ok) throw new Error('Failed to fetch workouts');
        const data = await response.json();

        const sortedData = data
          .sort((a, b) => new Date(b.workout_date) - new Date(a.workout_date))
          .slice(0, 10);

        setWorkouts(sortedData);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="neuro-content">
      <h2>Recent Workouts</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map(workout => (
            <tr key={workout.id}>
              <td>
                <Link to={`/workout-view/${workout.id}`}>{workout.workout_date}</Link>
              </td>
              <td>{workout.description}</td>
              <td>{workout.comments}</td>
              <td>
                <PencilFill
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                  onClick={() => navigate(`/edit-workout/${workout.id}`)}
                />
                <TrashFill
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => handleDelete(workout.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Workouts;
