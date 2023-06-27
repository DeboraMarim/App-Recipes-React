const fetchData = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return Object.values(data)[0] ?? [];
  } catch (error) {
    return [];
  }
};

export default fetchData;
