import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../api';

const APIViewer = () => {
    return (
        <div>
        <h2>API URL</h2>
        <p>{API_BASE_URL}</p>
        </div>
    )
}

export default APIViewer;