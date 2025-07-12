import React, { useEffect, useState } from "react";
import { ArrowLeftSquare, ArrowRightSquare } from "lucide-react";

const App = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [paginationCounter, setPaginationCounter] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    setAllUsers(data);
    setDisplayUsers(data);
    const cities = [...new Set(data.map((user) => user.address.city))];
    setFilterCity(cities);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, selectedCity);
    setPaginationCounter(0);
  };

  const handleCityFilter = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    applyFilters(searchTerm, value);
    setPaginationCounter(0);
  };

  const applyFilters = (searchValue, cityValue) => {
    let filtered = [...allUsers];

    if (searchValue) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (cityValue) {
      filtered = filtered.filter((user) => user.address.city === cityValue);
    }

    setDisplayUsers(filtered);
  };

  const resetFilter = () => {
    setSearchTerm("");
    setSelectedCity("");
    setDisplayUsers(allUsers);
    setPaginationCounter(0);
  };

  const handlePaginationNext = () => {
    if ((paginationCounter + 1) * pageSize < displayUsers.length) {
      setPaginationCounter((prev) => prev + 1);
    }
  };

  const handlePaginationPrev = () => {
    if (paginationCounter > 0) {
      setPaginationCounter((prev) => prev - 1);
    }
  };

  const paginatedUsers = displayUsers.slice(
    paginationCounter * pageSize,
    (paginationCounter + 1) * pageSize
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>User List</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name"
          style={{ padding: "6px 10px", width: "200px" }}
        />

        <select
          value={selectedCity}
          onChange={handleCityFilter}
          style={{ padding: "6px 10px" }}
        >
          <option value="">All Cities</option>
          {filterCity.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilter}
          style={{
            padding: "6px 12px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Reset
        </button>

        <strong>Total Users: {displayUsers.length}</strong>
      </div>

      <table
        style={{
          marginTop: "20px",
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>City</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>{user.id}</td>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.address.city}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={tdStyle}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
        <button
          onClick={handlePaginationPrev}
          disabled={paginationCounter === 0}
          style={paginationButtonStyle}
        >
          <ArrowLeftSquare />
        </button>
        <span style={{ fontWeight: "bold" }}>{paginationCounter + 1}</span>
        <button
          onClick={handlePaginationNext}
          disabled={(paginationCounter + 1) * pageSize >= displayUsers.length}
          style={paginationButtonStyle}
        >
          <ArrowRightSquare />
        </button>
      </div>
    </div>
  );
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#333",
  color: "#fff",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};

const paginationButtonStyle = {
  backgroundColor: "#3498db",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default App;
