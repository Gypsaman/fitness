import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";

const AddExerciseToWorkout = ({
  workout_id,
  muscle_group_id: initialGroupId,
  onAdded,
  nextOrder,
}) => {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [muscles, setMuscles] = useState([]);
  const [selectedMuscleId, setSelectedMuscleId] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipment_id, setEquipmentId] = useState("");
  const [options, setOptions] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch all muscle groups on mount
  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/muscle-groups`);
        const data = await res.json();
        setMuscleGroups(data);
      } catch (err) {
        console.error("Failed to fetch muscle groups", err);
      }
    };
    fetchMuscleGroups();
  }, []);

  // Fetch muscles when selected muscle group changes
  useEffect(() => {
    const fetchMuscles = async () => {
      if (!selectedGroupId) {
        setMuscles([]);
        setSelectedMuscleId("");
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/muscles-by-group/${selectedGroupId}`
        );
        const data = await res.json();
        setMuscles(data);
        setSelectedMuscleId(""); // reset muscle selection when group changes
      } catch (err) {
        console.error("Failed to fetch muscles", err);
        setMuscles([]);
      }
    };
    fetchMuscles();
  }, [selectedGroupId]);

  // Fetch equipment when selected muscle group or muscle changes
  useEffect(() => {
    const fetchEquipment = async () => {
      if (!selectedGroupId) {
        setEquipmentList([]);
        setEquipmentId("");
        return;
      }

      try {
        let url = `${API_BASE_URL}/equipment`;

        // If a muscle is selected, filter by main muscle
        if (selectedMuscleId) {
          url += `?muscle_group_id=${selectedGroupId}&main_muscle_id=${selectedMuscleId}`;
        } else {
          // Otherwise, just filter by muscle group
          const response = await fetch(`${API_BASE_URL}/equipment`);
          const data = await response.json();
          const filtered = data.filter(
            (eq) => eq.muscle_group_id === selectedGroupId
          );
          setEquipmentList(filtered);
          setEquipmentId(""); // reset selection when filters change
          return;
        }

        const response = await fetch(url);
        const data = await response.json();
        setEquipmentList(data);
        setEquipmentId(""); // reset selection when filters change
      } catch (error) {
        console.error("Failed to fetch equipment", error);
        setEquipmentList([]);
      }
    };

    fetchEquipment();
  }, [selectedGroupId, selectedMuscleId]);

  const getEquipmentStatsComment = async (equipment_id) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/equipment-stats/${equipment_id}`
      );
      if (!res.ok) return "";
      const stats = await res.json();
      console.log("Equipment stats:", stats);
      let comment = "";
      if (stats.max_weight !== null && stats.max_weight !== undefined) {
        comment += `Max: ${stats.max_weight}\n `;
      }
      if (Array.isArray(stats.last_reps) && stats.last_reps.length > 0) {
        comment += `${stats.last}\n `;
        comment += stats.last_reps
          .map(
            (rep) =>
              `Reps: ${rep.reps}${
                rep.weight !== null ? ` weight: ${rep.weight}\n` : ""
              }`
          )
          .join(" ");
      }
      console.log("Equipment stats comment:", comment);
      return comment.trim();
    } catch (err) {
      console.error("Failed to fetch equipment stats", err);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!equipment_id) {
      setSuccessMsg("Please select equipment.");
      setLoading(false);
      return;
    }

    try {
      const stats = await getEquipmentStatsComment(equipment_id);

      const res = await fetch(`${API_BASE_URL}/workout-equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workout_id,
          equipment_id: parseInt(equipment_id),
          options,
          order: nextOrder,
        }),
      });

      if (!res.ok) throw new Error("Failed to add exercise");
      const result = await res.json();

      setSuccessMsg("Exercise added successfully!");
      alert(stats);
      setOptions("");
      setEquipmentId("");
      setSelectedMuscleId(""); // Reset muscle selection after successful addition
      if (onAdded) onAdded(result);
    } catch (err) {
      console.error(err);
      setSuccessMsg("Failed to add exercise");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <div className="mb-2">
        <label className="form-label">Muscle Group</label>
        <select
          className="form-select"
          value={selectedGroupId}
          onChange={(e) => {
            setSelectedGroupId(parseInt(e.target.value));
            setSelectedMuscleId(""); // Reset muscle selection when group changes
          }}
        >
          <option value="">Select muscle group</option>
          {muscleGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.description}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label">Muscle (optional)</label>
        <select
          className="form-select"
          value={selectedMuscleId}
          onChange={(e) =>
            setSelectedMuscleId(e.target.value ? parseInt(e.target.value) : "")
          }
        >
          <option value="">All muscles in group</option>
          {muscles.map((muscle) => (
            <option key={muscle.id} value={muscle.id}>
              {muscle.description}
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
          {equipmentList.map((eq) => (
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
          {loading ? "Adding..." : "Add Exercise"}
        </button>
      </div>
      {successMsg && <div className="mt-2 alert alert-info">{successMsg}</div>}
    </form>
  );
};

export default AddExerciseToWorkout;
