import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/items`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch items: ${err.message}`);
        setLoading(false);
      }
    };

    fetchItems();
  }, [apiUrl]);

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
      const response = await fetch(`${apiUrl}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const addedItem = await response.json();
      setItems([...items, addedItem]);
      setNewItem({ name: '', description: '' });
    } catch (err) {
      setError(`Failed to add item: ${err.message}`);
    }
  };

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Microservices Demo</h1>
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
          <button type="submit">Add Item</button>
        </form>
      </section>

      <section className="items-list">
        <h2>Items List</h2>
        {items.length === 0 ? (
          <p>No items found. Add some!</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;