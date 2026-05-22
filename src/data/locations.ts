import type { Location } from '../types'

export const NS_LOCATIONS: Location[] = [
  // HRM
  { id: 'halifax', name: 'Halifax', lat: 44.6488, lng: -63.5752, region: 'HRM' },
  { id: 'dartmouth', name: 'Dartmouth', lat: 44.6717, lng: -63.5774, region: 'HRM' },
  { id: 'tantallon', name: 'Tantallon', lat: 44.7011, lng: -63.9903, region: 'HRM' },
  { id: 'hammonds-plains', name: 'Hammonds Plains', lat: 44.7444, lng: -63.8654, region: 'HRM' },
  { id: 'musquodoboit', name: 'Musquodoboit Harbour', lat: 44.7726, lng: -63.1502, region: 'HRM' },

  // Annapolis Valley
  { id: 'windsor', name: 'Windsor', lat: 44.9947, lng: -64.1328, region: 'Hants County' },
  { id: 'wolfville', name: 'Wolfville', lat: 45.0878, lng: -64.3615, region: 'Kings County' },
  { id: 'kentville', name: 'Kentville', lat: 45.0766, lng, -64.4956, region: 'Kings County' },
  { id: 'annapolis-royal', name: 'Annapolis Royal', lat: 44.7439, lng: -65.5164, region: 'Annapolis County' },

  // South Shore
  { id: 'bridgewater', name: 'Bridgewater', lat: 44.3722, lng: -64.5197, region: 'Lunenburg County' },
  { id: 'lunenburg', name: 'Lunenburg', lat: 44.3783, lng: -64.3178, region: 'Lunenburg County' },
  { id: 'shelburne', name: 'Shelburne', lat: 43.7634, lng: -65.3197, region: 'Shelburne County' },
  { id: 'barrington', name: 'Barrington', lat: 43.5617, lng: -65.5633, region: 'Shelburne County' },
  { id: 'liverpool', name: 'Liverpool', lat: 44.0378, lng: -64.7183, region: 'Queens County' },

  // Northern NS
  { id: 'truro', name: 'Truro', lat: 45.3647, lng: -63.2800, region: 'Colchester County' },
  { id: 'amherst', name: 'Amherst', lat: 45.8344, lng: -64.2128, region: 'Cumberland County' },
  { id: 'springhill', name: 'Springhill', lat: 45.6531, lng: -64.0631, region: 'Cumberland County' },
  { id: 'tatamagouche', name: 'Tatamagouche', lat: 45.7042, lng: -63.3467, region: 'Colchester County' },

  // Eastern NS
  { id: 'antigonish', name: 'Antigonish', lat: 45.6233, lng: -61.9963, region: 'Antigonish County' },
  { id: 'pictou', name: 'Pictou', lat: 45.6800, lng: -62.7100, region: 'Pictou County' },
  { id: 'new-glasgow', name: 'New Glasgow', lat: 45.5833, lng: -62.6500, region: 'Pictou County' },
  { id: 'guysborough', name: 'Guysborough', lat: 45.3833, lng: -61.5000, region: 'Guysborough County' },

  // Cape Breton
  { id: 'sydney', name: 'Sydney', lat: 46.1368, lng: -60.1942, region: 'Cape Breton County' },
  { id: 'glace-bay', name: 'Glace Bay', lat: 46.1969, lng: -59.9578, region: 'Cape Breton County' },
  { id: 'inverness', name: 'Inverness', lat: 46.2000, lng: -61.1000, region: 'Inverness County' },
  { id: 'baddeck', name: 'Baddeck', lat: 46.1000, lng: -60.7500, region: 'Victoria County' },
]