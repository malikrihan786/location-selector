import React, { useEffect, useState } from "react";

export default function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await res.json();
        setCountries(data.data.map((item) => item.country));
      } catch (err) {
        console.error(err);
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // ✅ Fetch states when country selected
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) return;
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: selectedCountry }),
          }
        );
        const data = await res.json();
        setStates(data.data.states.map((s) => s.name));
      } catch (err) {
        console.error(err);
        setError("Failed to load states");
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, [selectedCountry]);

  // ✅ Fetch cities when state selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry || !selectedState) return;
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              country: selectedCountry,
              state: selectedState,
            }),
          }
        );
        const data = await res.json();
        setCities(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load cities");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [selectedState]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Select Location</h2>

      <div style={styles.dropdownContainer}>
        {/* Country Dropdown */}
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState("");
            setSelectedCity("");
          }}
          style={styles.select}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State Dropdown */}
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
          disabled={!selectedCountry}
          style={{
            ...styles.select,
            ...(selectedCountry ? {} : styles.disabled),
          }}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          style={{
            ...styles.select,
            ...(selectedState ? {} : styles.disabled),
          }}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedCity && (
        <h3>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </h3>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "60px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "30px",
  },
  dropdownContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  select: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  disabled: {
    backgroundColor: "#f2f2f2",
    cursor: "not-allowed",
  },
};
