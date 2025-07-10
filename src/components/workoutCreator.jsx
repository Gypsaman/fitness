import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

const WorkoutCreator = () => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isBlank, setIsBlank] = useState(true);
  const [workoutDate, setWorkoutDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/muscle-groups`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch muscle groups");
        }
        return response.json();
      })
      .then((data) => setMuscleGroups(data));
  }, []);

  const createWorkout = () => {
    const selectedGroupObj = muscleGroups.find(
      (g) => g.id === parseInt(selectedGroup)
    );
    const workoutData = {
      workout_date: workoutDate,
      muscle_group_id: parseInt(selectedGroup),
      description: selectedGroupObj ? selectedGroupObj.description : "",
      comments: "",
    };

    const url = isBlank
      ? `${API_BASE_URL}/workouts`
      : `${API_BASE_URL}/workout-creation/${selectedGroup}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workoutData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create workout");
        return res.json();
      })
      .then((data) => {
        alert("Workout created successfully");
        window.location.href = `/workout-view/${data.id}`;
      })
      .catch((err) => {
        console.error("Error creating workout:", err);
        alert("Error creating workout");
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Create Workout</h2>

      <div className="form-group mb-3">
        <label htmlFor="workoutDate">Workout Date</label>
        <input
          type="date"
          className="form-control"
          id="workoutDate"
          value={workoutDate}
          onChange={(e) => setWorkoutDate(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="muscleGroupSelect">Select Muscle Group</label>
        <select
          id="muscleGroupSelect"
          className="form-control"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">-- Select --</option>
          {muscleGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.description}
            </option>
          ))}
        </select>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="blankCheck"
          checked={isBlank}
          onChange={(e) => setIsBlank(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="blankCheck">
          Blank
        </label>
      </div>

      <button className="btn btn-primary" onClick={createWorkout}>
        Create Workout
      </button>
    </div>
  );
};

export default WorkoutCreator;
