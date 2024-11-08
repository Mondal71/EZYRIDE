import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import bigInt from 'big-integer';
import { useNavigate } from 'react-router-dom';

// Create context
const viewContext = createContext();
const useViewContext = () => useContext(viewContext);

// Custom hook to use the context for the Customer Login
const ViewProvider = ({ children }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    c_no: '',
    c_password: '',
  });

  const [errors, setErrors] = useState({});
  const [mess, setMess] = useState("");
  const [userName, setUserName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'c_no') {
      // Convert contact number to BigInt if necessary
      setFormData({ ...formData, [name]: bigInt(value).toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.c_no) newErrors.c_no = 'Contact is required';
    if (!formData.c_password) newErrors.c_password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Form Data:', formData);
        const response = await axios.post('http://localhost:3001/customer_login', formData, {
          headers: { 'Content-Type': 'application/json' }
        });
        setMess(response.data.mess);
        setUserName(response.data.user.name);
        navigate('/');
      } catch (error) {
        if (error.response) {
          setMess(error.response.data.mess || 'An error occurred. Please try again.');
        } else {
          console.log('An error occurred. Please try again.');
          setMess('An error occurred. Please try again.');
        }
      }
    }
  };

  const [searchVehData, setSearchVehData] = useState({
    carType: '',
    color: '',
    vehicleType: '',
    priceRange: '',
    pickUp: '',
    dropOff: '',
    pickDate: '',
    pickTime: '',
    dropDate: '',
    dropTime: '',
    carImg: '',
    driverRequired: ''
  });

  const vehicleInputChange = (e) => {
    console.log("current initiated:", searchVehData);
  const { name, value } = e.target;
  setSearchVehData(prevData => ({ ...prevData, [name]: value }));
};

  const [vehicle,setVehicle]=useState([]);
  const handleSearch = async () => {
    try {
      console.log("Search initiated:", searchVehData);
      const response = await axios.get(`http://localhost:3001/vehicles`, {
        params: searchVehData,
      });
      console.log('Search Results:', response.data);
      setVehicle(response.data);
      console.log('Results:', vehicle);
      navigate('/models');
    } catch (error) {
      console.log('Error fetching vehicles:', error);
    }
  };

  const allValue = { 
    handleSubmit,
    handleInputChange,
    formData,
    errors,
    userName,
    mess,
    handleSearch,
    vehicleInputChange,
    searchVehData,
    vehicle,
  };

  return (
    <viewContext.Provider value={allValue}>
      {children}
    </viewContext.Provider>
  );
};

export { ViewProvider, viewContext, useViewContext };
