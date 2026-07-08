/**
 * Geocoding Service for Kinshasa Location Data
 * 
 * This service provides dynamic geocoding for streets, quartiers, and communes
 * using the OpenStreetMap Nominatim API. It caches results locally to avoid
 * repeated API calls and updates the database when verified data is found.
 * 
 * Data Source: OpenStreetMap (https://nominatim.openstreetmap.org)
 * License: ODbL 1.0 (https://osm.org/copyright)
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'Yengo-React-App/1.0';

// Local cache for geocoding results
const geocodingCache = new Map();

/**
 * Reverse geocode coordinates into an address using Nominatim API.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object|null>} Address object with address details, or null on failure
 */
async function reverseGeocode(lat, lng) {
  const cacheKey = `reverse-${lat}-${lng}`;
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  try {
    const params = new URLSearchParams({
      lat,
      lon: lng,
      format: 'json',
      addressdetails: 1,
      zoom: 18,
      namedetails: 1
    });

    const response = await fetch(
      'https://nominatim.openstreetmap.org/reverse?' + params,
      { headers: { 'User-Agent': USER_AGENT } }
    );

    if (!response.ok) {
      throw new Error(`Nominatim reverse API error: ${response.status}`);
    }

    const result = await response.json();
    if (result && result.lat) {
      geocodingCache.set(cacheKey, result);
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        displayName: result.display_name || '',
        address: result.address || {},
        osmId: result.osm_id,
        osmType: result.osm_type
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Search for a location using Nominatim API
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Object|null>} Geocoding result or null if not found
 */
async function searchLocation(query, options = {}) {
  const {
    format = 'json',
    limit = 5,
    countrycodes = 'cd',
    addressdetails = 1,
    namedetails = 1
  } = options;

  const cacheKey = `${query}-${JSON.stringify(options)}`;
  
  // Check cache first
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format,
      limit,
      countrycodes,
      addressdetails,
      namedetails
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}?${params}`, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const results = await response.json();
    
    // Cache the results
    if (results.length > 0) {
      geocodingCache.set(cacheKey, results);
      return results;
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Search for a commune in Kinshasa
 * @param {string} communeName - Name of the commune
 * @returns {Promise<Object|null>} Commune geocoding data
 */
async function searchCommune(communeName) {
  const query = `${communeName}, Kinshasa, Democratic Republic of the Congo`;
  const results = await searchLocation(query, { limit: 1 });
  
  if (results && results.length > 0) {
    const result = results[0];
    return {
      name: result.name,
      coords: [parseFloat(result.lat), parseFloat(result.lon)],
      centroid: [parseFloat(result.lat), parseFloat(result.lon)],
      boundary: result.boundingbox ? {
        minLat: parseFloat(result.boundingbox[0]),
        maxLat: parseFloat(result.boundingbox[1]),
        minLon: parseFloat(result.boundingbox[2]),
        maxLon: parseFloat(result.boundingbox[3])
      } : null,
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: result.osm_id,
      osmType: result.osm_type,
      placeId: result.place_id
    };
  }
  
  return null;
}

/**
 * Search for a quartier within a specific commune
 * @param {string} quartierName - Name of the quartier
 * @param {string} communeName - Name of the parent commune
 * @returns {Promise<Object|null>} Quartier geocoding data
 */
async function searchQuartier(quartierName, communeName) {
  const query = `${quartierName}, ${communeName}, Kinshasa, Democratic Republic of the Congo`;
  const results = await searchLocation(query, { limit: 3 });
  
  if (results && results.length > 0) {
    // Find the most relevant result (prefer administrative boundaries)
    const result = results.find(r => 
      r.class === 'boundary' && r.type === 'administrative'
    ) || results[0];
    
    return {
      name: quartierName,
      parentCommune: communeName,
      coords: [parseFloat(result.lat), parseFloat(result.lon)],
      centroid: [parseFloat(result.lat), parseFloat(result.lon)],
      boundary: result.boundingbox ? {
        minLat: parseFloat(result.boundingbox[0]),
        maxLat: parseFloat(result.boundingbox[1]),
        minLon: parseFloat(result.boundingbox[2]),
        maxLon: parseFloat(result.boundingbox[3])
      } : null,
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: result.osm_id,
      osmType: result.osm_type,
      placeId: result.place_id
    };
  }
  
  return null;
}

/**
 * Search for a street in Kinshasa
 * @param {string} streetName - Name of the street
 * @param {string} communeName - Optional commune name for better accuracy
 * @returns {Promise<Object|null>} Street geocoding data
 */
async function searchStreet(streetName, communeName = null) {
  let query = `${streetName}, Kinshasa, Democratic Republic of the Congo`;
  if (communeName) {
    query = `${streetName}, ${communeName}, Kinshasa, Democratic Republic of the Congo`;
  }
  
  const results = await searchLocation(query, { limit: 5 });
  
  if (results && results.length > 0) {
    // Find the most relevant result (prefer highways/roads)
    const result = results.find(r => 
      r.class === 'highway' || r.type === 'road'
    ) || results[0];
    
    return {
      name: streetName,
      parentCommune: communeName,
      coords: [parseFloat(result.lat), parseFloat(result.lon)],
      dataSource: 'OpenStreetMap/Nominatim',
      osmId: result.osm_id,
      osmType: result.osm_type,
      placeId: result.place_id,
      displayName: result.display_name
    };
  }
  
  return null;
}

/**
 * Batch geocode multiple locations
 * @param {Array} locations - Array of location objects with name and type
 * @returns {Promise<Array>} Array of geocoding results
 */
async function batchGeocode(locations) {
  const results = [];
  
  for (const location of locations) {
    let result;
    
    switch (location.type) {
      case 'commune':
        result = await searchCommune(location.name);
        break;
      case 'quartier':
        result = await searchQuartier(location.name, location.parentCommune);
        break;
      case 'street':
        result = await searchStreet(location.name, location.parentCommune);
        break;
      default:
        result = null;
    }
    
    results.push({
      ...location,
      geocoded: result !== null,
      data: result
    });
  }
  
  return results;
}

/**
 * Clear the geocoding cache
 */
function clearCache() {
  geocodingCache.clear();
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  return {
    size: geocodingCache.size,
    keys: Array.from(geocodingCache.keys())
  };
}

/**
 * Export cached data for persistence
 * @returns {Object} Cached data
 */
function exportCache() {
  return Object.fromEntries(geocodingCache);
}

/**
 * Import cached data
 * @param {Object} data - Cached data to import
 */
function importCache(data) {
  geocodingCache.clear();
  Object.entries(data).forEach(([key, value]) => {
    geocodingCache.set(key, value);
  });
}

export const geocodingService = {
  reverseGeocode,
  searchLocation,
  searchCommune,
  searchQuartier,
  searchStreet,
  batchGeocode,
  clearCache,
  getCacheStats,
  exportCache,
  importCache
};

export default geocodingService;
