// Node.js script to seed all cabins from cabinData.js into your backend MongoDB via the API
// Usage: node seedCabins.mjs
// Make sure your backend is running on http://localhost:5079

import { cabinData } from './src/components/cabinData.js';

async function seedCabins() {
  for (const cabin of cabinData) {
    // Remove the 'id' property if it exists
    const { id, ...cabinWithoutId } = cabin;
    try {
      const response = await fetch('http://localhost:5079/api/cabins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cabinWithoutId),
      });
      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to insert cabin: ${cabin.name}\n${error}`);
      } else {
        console.log(`Inserted: ${cabin.name}`);
      }
    } catch (err) {
      console.error(`Error inserting ${cabin.name}:`, err);
    }
  }
}

seedCabins();
