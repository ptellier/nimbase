

export const clusterLayer={
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#000000', 100, '#000000', 750, '#000000'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    // 'circle-opacity': 0.8,
    // change line color
    'circle-stroke-color': 'lightblue',
    'circle-stroke-width': 2
  }
};

export const clusterCountLayer= {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
    // change font color
  },
  paint: {
    'text-color': '#ffffff'
  }
};

export const unclusteredPointLayer= {
  id: 'unclustered-point',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#9c2a21',
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};