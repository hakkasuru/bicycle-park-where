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

      // Hide Yellow Box spots unless enabled
      if (!filters.showYellowBox && spot.RackType === 'Yellow Box') {
        return false;
      }

      return true;
    });
  }, [data, filters.shelterOnly, filters.rackTypes, filters.minCapacity, filters.showYellowBox]);
}

export const RACK_TYPE_LABELS = {
  'HDB_RACKS': 'HDB',
  'MRT_RACKS': 'MRT',
  'LTA_RACKS': 'LTA',
  'NPARKS_RACKS': 'Parks',
  'NLB_RACKS': 'Library',
  'PA_RACKS': 'Community Club',
  'SPORTSG_RACKS': 'Sports',
  'JTC_RACKS': 'JTC',
  'ITE_RACKS': 'ITE',
  'NANYANG POLY_RACKS': 'NYP',
  'JBTC_RACKS': 'JBTC',
  'Yellow Box': 'Yellow Box',
  'SHOPPING_MALL': 'Shopping Mall',
  'OTHER': 'Other',
};

export const DEFAULT_FILTERS = {
  shelterOnly: false,
  rackTypes: [],
  minCapacity: 0,
  showYellowBox: false,
};
