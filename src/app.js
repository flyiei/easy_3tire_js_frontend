import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nodeItems, setNodeItems] = useState([]);
  const [springItems, setSpringItems] = useState([]);
  const [loading, setLoading] = useState({ node: true, spring: true });
  const [error, setError] = useState({ node: null, spring: null });
  const [newItem, setNewItem] = useState({ name: '', description: '', api: 'node' });

  const nodeApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  const springApiUrl = process.env.REACT_APP_SPRINGBOOT_API_URL || 'http://localhost:8081';

  // Fetch items from Node.js API
  useEffect(() => {
    const fetchNodeItems = async () => {
      try {
        const response = await fetch(`${nodeApiUrl}/api/items`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setNodeItems(data);
        setLoading(prev => ({ ...prev, node: false }));
      } catch (err) {
        setError(prev => ({ ...prev, node: `Failed to fetch Node.js items: ${err.message}` }));
        setLoading(prev => ({ ...prev, node: false }));
      }
    };

    fetchNodeItems();
  }, [nodeApiUrl]);

  // Fetch items from Spring Boot API
  useEffect(() => {
    const fetchSpringItems = async () => {
      try {
        const response = await fetch(`${springApiUrl}/api/spring/items`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSpringItems(data);
        setLoading(prev => ({ ...prev, spring: false }));
      } catch (err) {
        setError(prev => ({ ...prev, spring: `Failed to fetch Spring Boot items: ${err.message}` }));
        setLoading(prev => ({ ...prev, spring: false }));
      }
    };

    fetchSpringItems();
  }, [springApiUrl]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newItem.name) {
      alert('Name is required!');
      return;
    }

    try {
      let response;
      const itemData = { name: newItem.name, description: newItem.description };
      
      if (newItem.api === 'node') {
        response = await fetch(`${nodeApiUrl}/api/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
      } else {
        response = await fetch(`${springApiUrl}/api/spring/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const addedItem = await response.json();
      
      if (newItem.api === 'node') {
        setNodeItems([...nodeItems, addedItem]);
      } else {
        setSpringItems([...springItems, addedItem]);
      }
      
      setNewItem({ name: '', description: '', api: newItem.api });
    } catch (err) {
      setError(prev => ({ ...prev, form: `Failed to add item: ${err.message}` }));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Three-Tier Microservices Demo</h1>
        <p className="subtitle">Showing data from Node.js and Spring Boot APIs</p>
      </header>
      
      <section className="add-item-form">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="api">API Service:</label>
            <select
              id="api"
              name="api"
              value={newItem.api}
              onChange={handleInputChange}
            >
              <option value="node">Node.js API</option>
              <option value="spring">Spring Boot API</option>
            </select>
          </div>
          <button type="submit">Add Item</button>
        </form>
      </section>

      <div className="api-sections">
        <section className="items-list node-api">
          <h2>Node.js API Items</h2>
          {loading.node ? (
            <p>Loading Node.js items...</p>
          ) : error.node ? (
            <p>Error: {error.node}</p>
          ) : nodeItems.length === 0 ? (
            <p>No Node.js items found. Add some!</p>
          ) : (
            <ul>
              {nodeItems.map((item) => (
                <li key={item.id} className="node-item">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="api-badge node-badge">Node.js</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="items-list spring-api">
          <h2>Spring Boot API Items</h2>
          {loading.spring ? (
            <p>Loading Spring Boot items...</p>
          ) : error.spring ? (
            <p>Error: {error.spring}</p>
          ) : springItems.length === 0 ? (
            <p>No Spring Boot items found. Add some!</p>
          ) : (
            <ul>
              {springItems.map((item) => (
                <li key={item.id} className="spring-item">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="api-badge spring-badge">Spring</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;