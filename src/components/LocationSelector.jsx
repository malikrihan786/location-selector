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

  // ✅ Fetch all countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://crio-location-selector.onrender.com/countries");
        const data = await res.json();
        setCountries(data.data.map((item) => item.country));
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // ✅ Fetch states when country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) {
        setStates([]);
        setSelectedState("");
        setCities([]);
        setSelectedCity("");
        return;
      }
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
        console.error("Error fetching states:", err);
        setError("Failed to load states");
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, [selectedCountry]);

  // ✅ Fetch cities when state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry || !selectedState) {
        setCities([]);
        setSelectedCity("");
        return;
      }
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
        setCities(data.data || []);
      } catch (err) {
        console.error("Error fetching cities:", err);
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
          id="country-dropdown"
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
          id="state-dropdown"
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
          id="city-dropdown"
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

      {selectedCity && selectedState && selectedCountry && (
        <h3 style={{ marginTop: "20px" }}>
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
