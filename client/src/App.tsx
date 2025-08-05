import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello') // will be proxied to localhost:5000
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => setMessage('Error: ' + err.message));
    }, []);

    return (
        <div>
            <h1>Frontend Connected</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
