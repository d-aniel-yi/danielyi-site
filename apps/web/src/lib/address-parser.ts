
export interface ParsedAddress {
    address_number: string
    address_dir: string
    address_street: string
    address_suffix: string
    address_quad: string
    unit: string
    city: string
    state: string
    zip: string
    zip_plus4: string
}

const DIRECTIONS = ['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'];
const SUFFIXES = [
    'ALLEE', 'ALLEY', 'ALLY', 'ALY', 'ANEX', 'ANNEX', 'ANNX', 'ANX', 'ARC', 'ARCADE', 'AV', 'AVE', 'AVEN', 'AVENU', 'AVENUE', 'AVN', 'AVUE', 'BAYOO', 'BAYOU', 'BCH', 'BEACH', 'BEND', 'BG', 'BGS', 'BLF', 'BLFS', 'BLUF', 'BLUFF', 'BLUFFS', 'BLVD', 'BND', 'BOT', 'BOTTM', 'BOTTOM', 'BOUL', 'BOULEVARD', 'BR', 'BRNCH', 'BROOK', 'BROOKS', 'BRK', 'BRKS', 'BRG', 'BRIDGE', 'BYP', 'BYPA', 'BYPAS', 'BYPASS', 'BYPS', 'CAMP', 'CMP', 'CP', 'CANYN', 'CANYON', 'CNYN', 'CAPE', 'CPE', 'CAUSEWAY', 'CAUSWA', 'CSWY', 'CEN', 'CENT', 'CENTER', 'CENTERS', 'CENTR', 'CENTRE', 'CNTER', 'CNTR', 'CTR', 'CTRS', 'CIR', 'CIRC', 'CIRCL', 'CIRCLE', 'CRCL', 'CRCLE', 'CLF', 'CLIFF', 'CLIFFS', 'CLFS', 'CLB', 'CLUB', 'COMMON', 'COMMONS', 'CMN', 'CMNS', 'COR', 'CORNER', 'CORNERS', 'CORS', 'COURSE', 'CRSE', 'COURT', 'CT', 'COURTS', 'CTS', 'COVE', 'CV', 'COVES', 'CVS', 'CREEK', 'CRK', 'CRESCENT', 'CRES', 'CRSENT', 'CRSNT', 'CREST', 'CRST', 'CROSSING', 'CROSSING', 'CRSSNG', 'XING', 'CROSSROAD', 'CROSSROADS', 'CURVE', 'DALE', 'DL', 'DAM', 'DM', 'DIV', 'DIVIDE', 'DV', 'DVD', 'DR', 'DRIV', 'DRIVE', 'DRVS', 'EST', 'ESTATE', 'ESTATES', 'ESTS', 'EXP', 'EXPR', 'EXPRESS', 'EXPRESSWAY', 'EXPW', 'EXPY', 'EXT', 'EXTENSION', 'EXTN', 'EXTNSN', 'EXTS', 'FALL', 'FALLS', 'FLS', 'FERRY', 'FRRY', 'FRY', 'FIELD', 'FIELDS', 'FLD', 'FLDS', 'FLT', 'FLATS', 'FLAT', 'FORD', 'FRD', 'FORDS', 'FRDS', 'FOREST', 'FORESTS', 'FRST', 'FORG', 'FORGE', 'FORGES', 'FRG', 'FRGS', 'FORK', 'FORKS', 'FRK', 'FRKS', 'FORT', 'FRT', 'FT', 'FREEWAY', 'FREEWY', 'FRWAY', 'FRWY', 'FWY', 'GARDEN', 'GARDENS', 'GDN', 'GDNS', 'GRDEN', 'GRDNS', 'GATEWAY', 'GATEWY', 'GATWAY', 'GTWAY', 'GTWY', 'GLEN', 'GLENS', 'GLN', 'GLNS', 'GREEN', 'GREENS', 'GRN', 'GRNS', 'GROV', 'GROVE', 'GROVES', 'GRV', 'GRVS', 'HARB', 'HARBOR', 'HARBORS', 'HBR', 'HBRS', 'HAVEN', 'HVN', 'HT', 'HTS', 'HIGHWAY', 'HIGHWY', 'HIWAY', 'HIWY', 'HWAY', 'HWY', 'HILL', 'HILLS', 'HL', 'HLS', 'HOLLOW', 'HOLLOWS', 'HOLW', 'HOLWS', 'INLT', 'IS', 'ISLAND', 'ISLANDS', 'ISLND', 'ISLNDS', 'ISS', 'ISLE', 'JCT', 'JCTION', 'JCTN', 'JUNCTION', 'JUNCTIONS', 'JUNCTN', 'JCTNS', 'KEY', 'KEYS', 'KY', 'KYS', 'KNL', 'KNOL', 'KNOLL', 'KNOLLS', 'KNLS', 'LAKE', 'LAKES', 'LK', 'LKS', 'LAND', 'LANDING', 'LNDG', 'LNDNG', 'LANE', 'LN', 'LGT', 'LIGHT', 'LIGHTS', 'LGTS', 'LOAF', 'LF', 'LOCK', 'LOCKS', 'LCK', 'LCKS', 'LDG', 'LODGE', 'LODG', 'LOOP', 'LOOPS', 'MALL', 'MANOR', 'MANORS', 'MNR', 'MNRS', 'MEADOW', 'MEADOWS', 'MDW', 'MDWS', 'MEDOWS', 'MEWS', 'MILL', 'MILLS', 'ML', 'MLS', 'MISSION', 'MISSN', 'MSN', 'MSSN', 'MOTORWAY', 'MTWY', 'MNT', 'MT', 'MOUNT', 'MOUNTAIN', 'MNTAIN', 'MNTN', 'MOUNTAINS', 'MNTNS', 'MTNS', 'NCK', 'NECK', 'ORCH', 'ORCHARD', 'ORCHRD', 'OVAL', 'OVL', 'OVERPASS', 'OPAS', 'PARK', 'PRK', 'PARKS', 'PARKWAY', 'PARKWY', 'PKWAY', 'PKWY', 'PKY', 'PARKWAYS', 'PKWYS', 'PASS', 'PASSAGE', 'PSGE', 'PATH', 'PATHS', 'PIKE', 'PIKES', 'PINE', 'PINES', 'PNES', 'PL', 'PLACE', 'PLAIN', 'PLAINS', 'PLN', 'PLNS', 'PLAZA', 'PLZ', 'PLZA', 'POINT', 'POINTS', 'PT', 'PTS', 'PORT', 'PORTS', 'PRT', 'PRTS', 'PR', 'PRAIRIE', 'PRR', 'RAD', 'RADIAL', 'RADIEL', 'RADL', 'RAMP', 'RANCH', 'RANCHES', 'RNCH', 'RNCHS', 'RAPID', 'RAPIDS', 'RPD', 'RPDS', 'REST', 'RST', 'RIDGE', 'RIDGES', 'RDG', 'RDGS', 'RIV', 'RIVER', 'RVR', 'ROAD', 'RD', 'ROADS', 'RDS', 'ROUTE', 'RTE', 'ROW', 'RUE', 'RUN', 'SHOAL', 'SHOALS', 'SHL', 'SHLS', 'SHOAR', 'SHORE', 'SHORES', 'SHR', 'SHRS', 'SKYWAY', 'SKWY', 'SPG', 'SPGS', 'SPNG', 'SPNGS', 'SPRING', 'SPRINGS', 'SPUR', 'SPURS', 'SQ', 'SQR', 'SQRE', 'SQU', 'SQUARE', 'SQUARES', 'SQS', 'STA', 'STATION', 'STATN', 'STN', 'STRA', 'STRAV', 'STRAVEN', 'STRAVENUE', 'STRAVN', 'STRVN', 'STRAVENUE', 'STREAM', 'STRM', 'ST', 'STREET', 'STRT', 'STREETS', 'STS', 'SMT', 'SUMMIT', 'SUMIT', 'TER', 'TERR', 'TERRACE', 'THROUGHWAY', 'TRWY', 'TRACE', 'TRACES', 'TRCE', 'TRACK', 'TRACKS', 'TRAK', 'TRK', 'TRKS', 'TRAFFICWAY', 'TRFY', 'TRAIL', 'TRAILS', 'TRL', 'TRLS', 'TRAILER', 'TRLR', 'TRLRS', 'TUNEL', 'TUNL', 'TUNLS', 'TUNNEL', 'TUNNELS', 'TUNNL', 'TURNPIKE', 'TPKE', 'TRNPK', 'TRPK', 'TURNPK', 'UNDERPASS', 'UPAS', 'UN', 'UNION', 'UNIONS', 'UNS', 'VALLEY', 'VALLEYS', 'VALLY', 'VLY', 'VLYS', 'VDCT', 'VIA', 'VIADUCT', 'VIEW', 'VIEWS', 'VW', 'VWS', 'VILL', 'VILLAG', 'VILLAGE', 'VILLAGES', 'VLG', 'VLGS', 'VILLE', 'VL', 'VIS', 'VIST', 'VISTA', 'VST', 'VSTA', 'WALK', 'WALKS', 'WALL', 'WY', 'WAY', 'WAYS', 'WELL', 'WELLS', 'WLS'
];

interface AddressComponent {
    longText: string;
    shortText: string;
    types: string[];
}

export function parseAddress(components: AddressComponent[] | null | undefined, formattedAddress: string): ParsedAddress {
    const result: ParsedAddress = {
        address_number: '',
        address_dir: '',
        address_street: '',
        address_suffix: '',
        address_quad: '',
        unit: '',
        city: '',
        state: '',
        zip: '',
        zip_plus4: ''
    };

    if (!components) return result;

    let route = '';
    let streetNumber = '';

    // 1. Extract basic components from Google's parsed fields
    for (const component of components) {
        const type = component.types[0];
        const value = component.longText || component.shortText;

        switch (type) {
            case 'street_number':
                streetNumber = value;
                result.address_number = value;
                break;
            case 'route':
                route = value;
                break;
            case 'subpremise': // Unit number
            case 'sublocality_level_1': // Sometimes unit/building info
                result.unit = value;
                break;
            case 'locality':
                result.city = value;
                break;
            case 'administrative_area_level_1':
                result.state = component.shortText; // Use short code (OR, WA)
                break;
            case 'postal_code':
                result.zip = value;
                break;
            case 'postal_code_suffix':
                result.zip_plus4 = value;
                break;
        }
    }

    // 2. Parse the Route (Street Name)
    // Google "route" usually contains: [Direction] [Street Name] [Suffix] [Quadrant]
    // Example: "NW 23rd Ave" or "E Burnside St" or "Main St SW"

    if (route) {
        const parts = route.split(' ');

        // Check for Pre-Directional (e.g., "N Main St")
        if (parts.length > 1 && DIRECTIONS.includes(parts[0].toUpperCase())) {
            result.address_dir = parts.shift()!.toUpperCase();
        }

        // Check for Post-Quadrant (e.g., "Main St SW")
        // Only if we haven't found a pre-directional, OR if it's a known quadrant style
        // Actually, some streets have both, but usually it's one or the other acting as the directional/quadrant.
        // RMLS distinguishes `address_dir` (N, S, E, W) and `address_quad` (likely the suffix quad).
        // Let's check the last part.
        if (parts.length > 1 && DIRECTIONS.includes(parts[parts.length - 1].toUpperCase())) {
            // If we already have a dir, this might be the quad. Or if we don't, it might be the quad.
            // Let's assume the last part is the Quad if it's a direction.
            result.address_quad = parts.pop()!.toUpperCase();
        }

        // Check for Suffix (e.g., "Ave", "St")
        // It should be at the end (after popping quad)
        if (parts.length > 0) {
            const lastPart = parts[parts.length - 1].toUpperCase().replace('.', '');
            if (SUFFIXES.includes(lastPart)) {
                result.address_suffix = parts.pop()!;
            }
        }

        // Whatever is left is the Street Name
        result.address_street = parts.join(' ');
    }

    // Fallback: If unit wasn't in components, try to parse it from formatted address
    // Formatted address often looks like: "123 Main St #4B, Portland, OR..."
    if (!result.unit && formattedAddress) {
        const unitMatch = formattedAddress.match(/#\s*([a-zA-Z0-9-]+)/) || formattedAddress.match(/Unit\s+([a-zA-Z0-9-]+)/i) || formattedAddress.match(/Apt\s+([a-zA-Z0-9-]+)/i);
        if (unitMatch) {
            result.unit = unitMatch[1];
        }
    }

    return result;
}
