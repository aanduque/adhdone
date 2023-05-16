// Function to write data to LocalStorage.
export function write(key, data) {
  const jsonString = JSON.stringify(data);

  // Check if the content is too large for LocalStorage.
  // Note: This is a simplistic check and might not be completely accurate due to
  // differences in how different browsers and systems calculate storage.
  if (jsonString.length > 5000000) { // 5MB in characters, simplistic check.
    console.error('Data is too large to store in LocalStorage.');
  }

  localStorage.setItem(key, jsonString);
}

// Function to read data from LocalStorage.
// Function to read data from LocalStorage.
export function read(key, defaultValue) {
  const jsonString = localStorage.getItem(key);

  if (jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return data;
    } catch (error) {
      console.error('Could not parse data as JSON:', error);
    }
  }

  // If the data is not JSON or does not exist, return the default value.
  // If the default value is a function, call it and return the result.
  return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
}

