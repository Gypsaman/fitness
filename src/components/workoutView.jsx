import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../api";
import AddExerciseToWorkout from "./AddExerciseToWorkout";

const WorkoutView = () => {
  const { WorkOutId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

  const fetchWorkout = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/workout-details/${WorkOutId}`
      );
      if (!response.ok) throw new Error("Failed to fetch workout");
      const data = await response.json();
      setWorkout(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const updateWorkoutTime = async (field) => {
    if (!workout) return;
    const now = new Date().toISOString();

    const payload = {
      workout_date: workout.workout_date,
      description: workout.description,
      muscle_group_id: workout.muscle_group_id,
      comments: workout.comments || "",
      start_time: field === "start_time" ? now : workout.start_time,
      end_time: field === "end_time" ? now : workout.end_time,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${WorkOutId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update time");
      fetchWorkout();
    } catch (error) {
      console.error("Time update error:", error);
    }
  };

  useEffect(() => {
    if (WorkOutId) {
      fetchWorkout();
    }
  }, [WorkOutId]);

  const handleExerciseAdded = () => {
    fetchWorkout();
    setShowAddExercise(false);
  };

  if (!workout) return <div className="neuro-content">Loading...</div>;
  const { start_time, end_time } = workout;

  return (
    <div className="neuro-content">
      <h1>{workout.description || "No Workout Selected"}</h1>
      <h2>{workout.workout_date}</h2>

      <button
        className="btn btn-secondary mb-3"
        onClick={() => setShowAddExercise((prev) => !prev)}
      >
        {showAddExercise ? "Cancel" : "➕ Add Exercise"}
      </button>

      {showAddExercise && (
        <AddExerciseToWorkout
          workout_id={parseInt(WorkOutId)}
          muscle_group_id={workout.muscle_group_id}
          onAdded={handleExerciseAdded}
          nextOrder={
            workout.WorkoutEquipment.length > 0
              ? Math.max(...workout.WorkoutEquipment.map((eq) => eq.order)) + 1
              : 1
          }
        />
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Order</th>
            <th>Exercise</th>
            <th>Reps</th>
            <th>Weight</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {workout.WorkoutEquipment.slice()
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <tr key={exercise.id}>
                <td>
                  <input
                    type="number"
                    value={exercise.order}
                    min={1}
                    style={{ width: 60 }}
                    onChange={async (e) => {
                      const newOrder = parseInt(e.target.value, 10);
                      if (isNaN(newOrder)) return;
                      try {
                        const response = await fetch(
                          `${API_BASE_URL}/workout-equipment/${exercise.id}`,
                          {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ order: newOrder }),
                          }
                        );
                        if (!response.ok)
                          throw new Error("Failed to update order");
                        fetchWorkout();
                      } catch (error) {
                        console.error("Order update error:", error);
                      }
                    }}
                  />
                </td>
                <td>
                  <Link
                    to={`/edit-reps/${exercise.workout_id}/${exercise.equipment_id}`}
                  >
                    {exercise.equipment.description}
                  </Link>
                </td>
                <td>{exercise.WorkoutReps[0]?.reps || "-"}</td>
                <td>
                  {exercise.WorkoutReps[0]?.weight
                    ? `${exercise.WorkoutReps[0].weight} lbs`
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `${API_BASE_URL}/workout-equipment/${exercise.id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (!response.ok)
                          throw new Error("Failed to delete exercise");
                        fetchWorkout();
                      } catch (error) {
                        console.error("Delete error:", error);
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

      <div className="mt-4">
        {start_time && (
          <div>
            <strong>Start:</strong> {new Date(start_time).toLocaleTimeString()}
          </div>
        )}
        {end_time && (
          <div>
            <strong>End:</strong> {new Date(end_time).toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="mt-3">
        {!start_time && (
          <button
            className="btn btn-success me-2"
            onClick={() => updateWorkoutTime("start_time")}
          >
            ▶️ Start
          </button>
        )}
        {start_time && !end_time && (
          <button
            className="btn btn-danger"
            onClick={() => updateWorkoutTime("end_time")}
          >
            ⏹ End
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkoutView;
