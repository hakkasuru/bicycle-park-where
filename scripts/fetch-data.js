/**
 * Fetches bicycle parking data from LTA DataMall API
 *
 * Usage: LTA_API_KEY=your_key node scripts/fetch-data.js
 *
 * Get your API key from: https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html
 */

const API_URL = 'https://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2';
const SINGAPORE_CENTER = { lat: 1.3521, lng: 103.8198 };
const SEARCH_RADIUS = 50; // km - covers all of Singapore

async function fetchBicycleParking() {
  const apiKey = process.env.LTA_API_KEY;

  if (!apiKey) {
    console.error('Error: LTA_API_KEY environment variable is required');
    console.error('Usage: LTA_API_KEY=your_key node scripts/fetch-data.js');
    console.error('Get your API key from: https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html');
    process.exit(1);
  }

  console.log('Fetching bicycle parking data from LTA DataMall...');

  const uniqueRecords = new Map();
  let skip = 0;
  const batchSize = 500;
  const maxIterations = 50; // Safety limit
  let iterations = 0;

  while (iterations < maxIterations) {
    const url = `${API_URL}?Lat=${SINGAPORE_CENTER.lat}&Long=${SINGAPORE_CENTER.lng}&Dist=${SEARCH_RADIUS}&$skip=${skip}`;

    const response = await fetch(url, {
      headers: {
        'AccountKey': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const batch = data.value || [];

    if (batch.length === 0) break;

    // Deduplicate using lat+long+description as key
    let newCount = 0;
    for (const record of batch) {
      const key = `${record.Latitude}_${record.Longitude}_${record.Description}`;
      if (!uniqueRecords.has(key)) {
        uniqueRecords.set(key, record);
        newCount++;
      }
    }

    console.log(`Batch ${iterations + 1}: ${batch.length} records, ${newCount} new. Total unique: ${uniqueRecords.size}`);

    // Stop if no new records were added (we've seen all data)
    if (newCount === 0) break;

    skip += batchSize;
    iterations++;
  }

  const allData = Array.from(uniqueRecords.values());
  console.log(`\nTotal unique records: ${allData.length}`);

  // Write to file
  const fs = await import('fs');
  const path = await import('path');
  const outputPath = path.join(process.cwd(), 'src/data/bicycle-parking.json');

  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log(`Data saved to ${outputPath}`);

  // Print stats
  const sheltered = allData.filter(d => d.ShelterIndicator === 'Y').length;
  const unsheltered = allData.length - sheltered;
  const rackTypes = [...new Set(allData.map(d => d.RackType))];

  console.log('\nStats:');
  console.log(`  Sheltered: ${sheltered} (${Math.round(sheltered/allData.length*100)}%)`);
  console.log(`  Unsheltered: ${unsheltered} (${Math.round(unsheltered/allData.length*100)}%)`);
  console.log(`  Rack types: ${rackTypes.join(', ')}`);
}

fetchBicycleParking().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
