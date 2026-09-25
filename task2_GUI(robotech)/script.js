
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  
  if (!form) return;

  // Track field interactions for real-time validation
  const requiredInputs = form.querySelectorAll('input[required], select[required]');

  // ----------------------------------------------------
  // 1. Real-time visual feedback (Green/Red borders)
  // ----------------------------------------------------
  requiredInputs.forEach(input => {
    // Validate on user blur (when leaving field)
    input.addEventListener('blur', () => validateField(input));
    
    // Validate on input/change
    input.addEventListener('input', () => validateField(input));
  });

  function validateField(field) {
    let isValid = true;

    if (field.type === 'radio') {
      const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(radioGroup).some(r => r.checked);
      isValid = checked;
      radioGroup.forEach(r => toggleClass(r.parentElement, checked));
    } else {
      isValid = field.checkValidity();
      toggleClass(field, isValid);
    }

    return isValid;
  }

  function toggleClass(element, isValid) {
    if (isValid) {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');
    } else {
      element.classList.remove('is-valid');
      element.classList.add('is-invalid');
    }
  }

  // ----------------------------------------------------
  // 2. Interactive Textarea Auto-Clear / Focus Highlight
  // ----------------------------------------------------
  const textareas = form.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    // Highlight background when focused
    textarea.addEventListener('focus', () => {
      textarea.style.backgroundColor = '#f0f7ff';
    });
    
    textarea.addEventListener('blur', () => {
      textarea.style.backgroundColor = '#ffffff';
    });
  });

  // ----------------------------------------------------
  // 3. Form Submission Handling (Validation & Save JSON)
  // ----------------------------------------------------
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop default form submission

    let isFormValid = true;

    // Validate all required fields before proceeding
    requiredInputs.forEach(input => {
      const valid = validateField(input);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
      alert('Please fill out all required fields before submitting.');
      return;
    }

    // Capture Form Data into JavaScript Object
    const formData = new FormData(form);
    const formDataObject = {};

    // Collect array data for multi-selection checkboxes
    formData.forEach((value, key) => {
      if (key === '_next') return; // Skip hidden field in output
      if (formDataObject[key]) {
        if (!Array.isArray(formDataObject[key])) {
          formDataObject[key] = [formDataObject[key]];
        }
        formDataObject[key].push(value);
      } else {
        formDataObject[key] = value;
      }
    });

    // Save & Download JSON file locally
    saveJSONFile(formDataObject, 'feedback_submission.json');

    // Submit form via Formspree after local save
    alert('Validation passed! Saving JSON copy and submitting feedback.');
    form.submit();
  });

  
  // Helper function to generate and download JSON file
  function saveJSONFile(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
});