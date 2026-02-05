import { useMemo } from 'react';

export function useFilteredData(data, filters) {
  return useMemo(() => {
    if (!data) return [];

    return data.filter((spot) => {
      // Filter by shelter
      if (filters.shelterOnly && spot.ShelterIndicator !== 'Y') {
        return false;
      }

      // Filter by rack types
      if (filters.rackTypes.length > 0 && !filters.rackTypes.includes(spot.RackType)) {
        return false;
      }

      // Filter by minimum capacity
      if (filters.minCapacity > 0 && spot.RackCount < filters.minCapacity) {
        return false;
      }

      return true;
    });
  }, [data, filters.shelterOnly, filters.rackTypes, filters.minCapacity]);
}

export const RACK_TYPE_LABELS = {
  'HDB_RACKS': 'HDB',
  'MRT_RACKS': 'MRT',
  'LTA_RACKS': 'LTA',
  'NPARKS_RACKS': 'Parks',
  'NLB_RACKS': 'Library',
  'PA_RACKS': 'CC',
  'SPORTSG_RACKS': 'Sports',
  'JTC_RACKS': 'JTC',
  'ITE_RACKS': 'ITE',
  'NANYANG POLY_RACKS': 'NYP',
  'JBTC_RACKS': 'JBTC',
  'Yellow Box': 'Yellow Box',
};

export const DEFAULT_FILTERS = {
  shelterOnly: false,
  rackTypes: [],
  minCapacity: 0,
};
