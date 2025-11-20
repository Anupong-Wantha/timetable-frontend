import { useState } from 'react';

export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleArrayChange = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const validate = (validationRules) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(key => {
      const rule = validationRules[key];
      const value = values[key];
      
      if (rule.required && !value) {
        newErrors[key] = rule.message || 'This field is required';
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        newErrors[key] = rule.message || `Minimum length is ${rule.minLength}`;
      }
      
      if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[key] = rule.message || 'Invalid format';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    handleChange,
    handleArrayChange,
    reset,
    validate,
    setValues,
    setErrors
  };
};