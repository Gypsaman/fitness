import React from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom'
import './neuro-table.css'
import './neuro.css'
import AppBar from './components/AppBar';
import HomePage from './components/Home'
import WorkoutCreator from "./components/workoutCreator";
import WorkoutView from "./components/workoutView";
import EditReps from "./components/EditReps";
import EquipmentViewer from "./components/EquipmentViewer";
import APIViewer from "./components/APIViewer";
import Workouts from "./components/Workouts";
import EditWorkout from "./components/EditWorkout";
import AddEquipment from "./components/AddEquipment";

function App(){


    return (
        <Router>
                <AppBar/>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/create" element={<WorkoutCreator />} />
                    <Route path="/workout-view/:WorkOutId" element={<WorkoutView />} />
                    {/* <Route path="/edit-reps/:workoutId/:equipmentId" element={<EditReps />} /> */}
                    <Route path="/view-equipment" element={<EquipmentViewer />} />
                    <Route path="/api_url" element={<APIViewer />} />
                    <Route path="/workouts" element={<Workouts />} />
                    <Route path="/edit-workout/:id" element={<EditWorkout />} />
                    <Route path="/add-equipment" element={<AddEquipment />} />
                </Routes>
        </Router>
    )
}
export default App;
