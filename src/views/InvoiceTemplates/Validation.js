const isValidJSON = (value) => {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateInvoiceTemplate = (formData) => {
  const errors = {};

  // Name Validation
  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  }

  // Processor Class Validation
  if (!formData.processor_class.trim()) {
    errors.processor_class = "Processor Class is required.";
  }

  // Class Level JSON Validation
  if (!isValidJSON(formData.class_level)) {
    errors.class_level = "Class Level must be valid JSON.";
  }

  // Instance Level JSON Validation
  if (!isValidJSON(formData.instance_level)) {
    errors.instance_level = "Instance Level must be valid JSON.";
  }

  return errors;
};

export const hasValidationErrors = (errors) => {
  return Object.keys(errors).length > 0;
};