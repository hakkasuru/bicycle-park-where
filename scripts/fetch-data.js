/**
 * Fetches bicycle parking data from LTA DataMall API
 *
 * Usage: LTA_API_KEY=your_key node scripts/fetch-data.js
 *
 * Get your API key from: https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html
 */

const API_URL = 'https://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2';
const SEARCH_RADIUS = 5; // km per query point
const DELAY_MS = 100; // delay between API calls to avoid rate limiting

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Multiple query points to cover all of Singapore
const QUERY_POINTS = [
  { lat: 1.35, lng: 103.70 },  // West (Jurong/Tuas)
  { lat: 1.35, lng: 103.75 },  // West-Central
  { lat: 1.35, lng: 103.82 },  // Central
  { lat: 1.35, lng: 103.89 },  // East-Central
  { lat: 1.35, lng: 103.96 },  // East (Tampines/Changi)
  { lat: 1.30, lng: 103.82 },  // South-Central
  { lat: 1.40, lng: 103.82 },  // North-Central
  { lat: 1.44, lng: 103.79 },  // North (Woodlands)
  { lat: 1.40, lng: 103.90 },  // Northeast (Sengkang/Punggol)
  { lat: 1.32, lng: 103.66 },  // Far West (Tuas)
];

async function fetchBicycleParking() {
  const apiKey = process.env.LTA_API_KEY;

  if (!apiKey) {
    console.error('Error: LTA_API_KEY environment variable is required');
    console.error('Usage: LTA_API_KEY=your_key node scripts/fetch-data.js');
    console.error('Get your API key from: https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html');
    process.exit(1);
  }

  console.log('Fetching bicycle parking data from LTA DataMall...');
  console.log(`Querying ${QUERY_POINTS.length} points across Singapore...\n`);

  const uniqueRecords = new Map();

  for (const point of QUERY_POINTS) {
    let skip = 0;
    const batchSize = 500;
    const maxIterations = 20;
    let iterations = 0;
    let pointRecords = 0;

    while (iterations < maxIterations) {
      const url = `${API_URL}?Lat=${point.lat}&Long=${point.lng}&Dist=${SEARCH_RADIUS}&$skip=${skip}`;

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
      await sleep(DELAY_MS); // Rate limiting
      const batch = data.value || [];

      if (batch.length === 0) break;

      // Deduplicate using lat+long+description as key
      let newCount = 0;
      for (const record of batch) {
        const key = `${record.Latitude}_${record.Longitude}_${record.Description}`;
        if (!uniqueRecords.has(key)) {
          uniqueRecords.set(key, record);
          newCount++;
          pointRecords++;
        }
      }

      // Stop if no new records from this point
      if (newCount === 0) break;

      skip += batchSize;
      iterations++;
    }

    console.log(`Point (${point.lat}, ${point.lng}): ${pointRecords} new records. Total: ${uniqueRecords.size}`);
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
