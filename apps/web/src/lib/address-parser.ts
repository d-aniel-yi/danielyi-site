/**
 * Address Parser Utility
 *
 * Normalizes Google Maps Place API address components into a stable key-value structure
 * for consistent storage and retrieval.
 */

/**
 * Google Maps Geocoder Address Component structure
 */
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Type mapping for Google Maps address component types to stable keys
 */
const TYPE_MAPPING: Record<string, string> = {
  street_number: 'street_number',
  route: 'street',
  locality: 'city',
  administrative_area_level_1: 'state',
  postal_code: 'zip',
  country: 'country',
};

/**
 * Parses Google Maps Place API address components into a normalized object
 *
 * @param addressComponents - Array of address components from Google Maps API
 * @param formattedAddress - Formatted address string from Google Maps API
 * @returns Normalized address object with stable keys
 *
 * @example
 * ```typescript
 * const components = [
 *   { long_name: "123", short_name: "123", types: ["street_number"] },
 *   { long_name: "Main Street", short_name: "Main St", types: ["route"] },
 *   { long_name: "Portland", short_name: "Portland", types: ["locality"] }
 * ];
 * const result = parseAddress(components, "123 Main St, Portland, OR 97201");
 * // Returns: { street_number: "123", street: "Main Street", city: "Portland", formattedAddress: "..." }
 * ```
 */
export function parseAddress(
  addressComponents: AddressComponent[],
  formattedAddress: string
): Record<string, string> {
  const result: Record<string, string> = {
    formattedAddress,
  };

  // Handle null/undefined input gracefully
  if (!addressComponents || !Array.isArray(addressComponents)) {
    return result;
  }

  // Iterate over each component and map to stable keys
  for (const component of addressComponents) {
    // Find the first matching type that we have a mapping for
    for (const type of component.types) {
      const stableKey = TYPE_MAPPING[type];

      if (stableKey) {
        // Use long_name for most fields (full street name, full city name, etc.)
        // short_name would be abbreviations like "OR" for Oregon
        result[stableKey] = component.long_name;

        // Only map the first matching type to avoid duplicates
        break;
      }
    }
  }

  return result;
}
