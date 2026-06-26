/**
 * Location Data Validation Script
 * 
 * This script validates the Kinshasa location database and generates a report
 * showing the status of coordinates, data sources, and missing data.
 */

import { kinshasaLocationData } from '../data/locationData.js';

function validateCoordinates(coords) {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) {
    return false;
  }
  const [lat, lon] = coords;
  return typeof lat === 'number' && typeof lon === 'number' &&
         lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

function validateBoundary(boundary) {
  if (!boundary || typeof boundary !== 'object') {
    return false;
  }
  const { minLat, maxLat, minLon, maxLon } = boundary;
  return typeof minLat === 'number' && typeof maxLat === 'number' &&
         typeof minLon === 'number' && typeof maxLon === 'number' &&
         minLat >= -90 && maxLat <= 90 && minLon >= -180 && maxLon <= 180 &&
         minLat < maxLat && minLon < maxLon;
}

function generateValidationReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalCommunes: 0,
      communesWithVerifiedCoords: 0,
      communesWithBoundary: 0,
      communesWithDataSource: 0,
      totalQuartiers: 0,
      quartiersWithVerifiedCoords: 0,
      quartiersMissingCoords: 0,
      totalStreets: 0,
      streetsWithCoords: 0
    },
    communes: {},
    quartiers: {},
    dataSources: {},
    missingData: {
      communesWithoutCoords: [],
      communesWithoutBoundary: [],
      communesWithoutDataSource: [],
      quartiersWithoutCoords: []
    }
  };

  // Validate city-level data
  const cityHasCoords = validateCoordinates(kinshasaLocationData.coords);
  const cityHasCentroid = validateCoordinates(kinshasaLocationData.centroid);
  const cityHasBoundary = validateBoundary(kinshasaLocationData.boundary);
  const cityHasDataSource = !!kinshasaLocationData.dataSource;

  report.city = {
    name: kinshasaLocationData.ville,
    hasCoords: cityHasCoords,
    hasCentroid: cityHasCentroid,
    hasBoundary: cityHasBoundary,
    hasDataSource: cityHasDataSource,
    dataSource: kinshasaLocationData.dataSource || 'MISSING',
    coords: kinshasaLocationData.coords,
    centroid: kinshasaLocationData.centroid,
    boundary: kinshasaLocationData.boundary
  };

  // Validate streets
  report.summary.totalStreets = kinshasaLocationData.streets.length;
  report.summary.streetsWithCoords = kinshasaLocationData.streets.filter(s => 
    validateCoordinates(s.coords)
  ).length;

  // Validate communes
  const communes = kinshasaLocationData.communes;
  report.summary.totalCommunes = Object.keys(communes).length;

  for (const [communeName, communeData] of Object.entries(communes)) {
    const hasCoords = validateCoordinates(communeData.coords);
    const hasCentroid = validateCoordinates(communeData.centroid);
    const hasBoundary = validateBoundary(communeData.boundary);
    const hasDataSource = !!communeData.dataSource;

    if (hasCoords) report.summary.communesWithVerifiedCoords++;
    if (hasBoundary) report.summary.communesWithBoundary++;
    if (hasDataSource) report.summary.communesWithDataSource++;

    // Track data sources
    if (communeData.dataSource) {
      report.dataSources[communeData.dataSource] = 
        (report.dataSources[communeData.dataSource] || 0) + 1;
    }

    // Track missing data
    if (!hasCoords) report.missingData.communesWithoutCoords.push(communeName);
    if (!hasBoundary) report.missingData.communesWithoutBoundary.push(communeName);
    if (!hasDataSource) report.missingData.communesWithoutDataSource.push(communeName);

    report.communes[communeName] = {
      hasCoords,
      hasCentroid,
      hasBoundary,
      hasDataSource,
      dataSource: communeData.dataSource || 'MISSING',
      coords: communeData.coords,
      centroid: communeData.centroid,
      boundary: communeData.boundary,
      osmId: communeData.osmId
    };

    // Validate quartiers
    const quartiers = communeData.quartiers || {};
    for (const [quartierName, quartierData] of Object.entries(quartiers)) {
      report.summary.totalQuartiers++;
      
      if (quartierData === null) {
        report.summary.quartiersMissingCoords++;
        report.missingData.quartiersWithoutCoords.push(`${communeName}/${quartierName}`);
        report.quartiers[`${communeName}/${quartierName}`] = {
          hasCoords: false,
          hasCentroid: false,
          hasBoundary: false,
          hasDataSource: false,
          dataSource: 'NOT_VERIFIED',
          coords: null,
          centroid: null,
          boundary: null
        };
      } else {
        const hasCoords = validateCoordinates(quartierData.coords);
        const hasCentroid = validateCoordinates(quartierData.centroid);
        const hasBoundary = validateBoundary(quartierData.boundary);
        const hasDataSource = !!quartierData.dataSource;

        if (hasCoords) report.summary.quartiersWithVerifiedCoords++;

        // Track data sources for quartiers
        if (quartierData.dataSource) {
          report.dataSources[quartierData.dataSource] = 
            (report.dataSources[quartierData.dataSource] || 0) + 1;
        }

        report.quartiers[`${communeName}/${quartierName}`] = {
          hasCoords,
          hasCentroid,
          hasBoundary,
          hasDataSource,
          dataSource: quartierData.dataSource || 'MISSING',
          coords: quartierData.coords,
          centroid: quartierData.centroid,
          boundary: quartierData.boundary,
          osmId: quartierData.osmId
        };
      }
    }
  }

  return report;
}

function printReport(report) {
  console.log('\n=== KINSHASA LOCATION DATA VALIDATION REPORT ===\n');
  console.log(`Generated: ${report.generatedAt}\n`);

  console.log('--- CITY LEVEL ---');
  console.log(`City: ${report.city.name}`);
  console.log(`Has Coordinates: ${report.city.hasCoords ? '✓' : '✗'}`);
  console.log(`Has Centroid: ${report.city.hasCentroid ? '✓' : '✗'}`);
  console.log(`Has Boundary: ${report.city.hasBoundary ? '✓' : '✗'}`);
  console.log(`Has Data Source: ${report.city.hasDataSource ? '✓' : '✗'}`);
  console.log(`Data Source: ${report.city.dataSource}`);
  console.log(`Coordinates: ${report.city.coords.join(', ')}`);
  console.log(`Centroid: ${report.city.centroid.join(', ')}`);
  console.log(`OSM ID: ${report.city.osmId}\n`);

  console.log('--- SUMMARY ---');
  console.log(`Total Communes: ${report.summary.totalCommunes}`);
  console.log(`Communes with Verified Coordinates: ${report.summary.communesWithVerifiedCoords} (${((report.summary.communesWithVerifiedCoords / report.summary.totalCommunes) * 100).toFixed(1)}%)`);
  console.log(`Communes with Boundary Data: ${report.summary.communesWithBoundary} (${((report.summary.communesWithBoundary / report.summary.totalCommunes) * 100).toFixed(1)}%)`);
  console.log(`Communes with Data Source: ${report.summary.communesWithDataSource} (${((report.summary.communesWithDataSource / report.summary.totalCommunes) * 100).toFixed(1)}%)`);
  console.log(`Total Quartiers: ${report.summary.totalQuartiers}`);
  console.log(`Quartiers with Verified Coordinates: ${report.summary.quartiersWithVerifiedCoords} (${((report.summary.quartiersWithVerifiedCoords / report.summary.totalQuartiers) * 100).toFixed(1)}%)`);
  console.log(`Quartiers Missing Coordinates: ${report.summary.quartiersMissingCoords} (${((report.summary.quartiersMissingCoords / report.summary.totalQuartiers) * 100).toFixed(1)}%)`);
  console.log(`Total Streets: ${report.summary.totalStreets}`);
  console.log(`Streets with Coordinates: ${report.summary.streetsWithCoords}\n`);

  console.log('--- DATA SOURCES ---');
  for (const [source, count] of Object.entries(report.dataSources)) {
    console.log(`${source}: ${count} locations`);
  }
  console.log();

  console.log('--- MISSING DATA ---');
  if (report.missingData.communesWithoutCoords.length > 0) {
    console.log(`Communes without coordinates (${report.missingData.communesWithoutCoords.length}):`);
    report.missingData.communesWithoutCoords.forEach(c => console.log(`  - ${c}`));
  }
  if (report.missingData.communesWithoutBoundary.length > 0) {
    console.log(`Communes without boundary data (${report.missingData.communesWithoutBoundary.length}):`);
    report.missingData.communesWithoutBoundary.forEach(c => console.log(`  - ${c}`));
  }
  if (report.missingData.communesWithoutDataSource.length > 0) {
    console.log(`Communes without data source (${report.missingData.communesWithoutDataSource.length}):`);
    report.missingData.communesWithoutDataSource.forEach(c => console.log(`  - ${c}`));
  }
  if (report.missingData.quartiersWithoutCoords.length > 0) {
    console.log(`Quartiers without coordinates (${report.missingData.quartiersWithoutCoords.length}):`);
    report.missingData.quartiersWithoutCoords.slice(0, 20).forEach(q => console.log(`  - ${q}`));
    if (report.missingData.quartiersWithoutCoords.length > 20) {
      console.log(`  ... and ${report.missingData.quartiersWithoutCoords.length - 20} more`);
    }
  }
  console.log();

  console.log('--- VERIFIED QUARTIERS ---');
  const verifiedQuartiers = Object.entries(report.quartiers)
    .filter(([_, data]) => data.hasCoords)
    .map(([name, data]) => ({ name, ...data }));
  
  if (verifiedQuartiers.length > 0) {
    console.log(`Quartiers with verified coordinates (${verifiedQuartiers.length}):`);
    verifiedQuartiers.forEach(q => {
      console.log(`  - ${q.name}`);
      console.log(`    Coordinates: ${q.coords.join(', ')}`);
      console.log(`    Data Source: ${q.dataSource}`);
      console.log(`    OSM ID: ${q.osmId}`);
    });
  } else {
    console.log('No quartiers with verified coordinates found.');
  }
  console.log();

  console.log('=== END OF REPORT ===\n');
}

// Run validation
const report = generateValidationReport();
printReport(report);

// Export for programmatic use
export { generateValidationReport, printReport };
