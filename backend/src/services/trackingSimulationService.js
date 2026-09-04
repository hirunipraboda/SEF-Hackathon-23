/**
 * Sri Lanka Railways Live Tracking Simulation Service
 * Provides deterministic, progressive simulated live train movement along realistic railway corridors.
 */

export const TRACKING_STATIONS = [
  { id: 'st-fot', code: 'FOT', name: 'Colombo Fort', city: 'Colombo', latitude: 6.9344, longitude: 79.8504, province: 'Western' },
  { id: 'st-mda', code: 'MDA', name: 'Maradana', city: 'Colombo', latitude: 6.9271, longitude: 79.8667, province: 'Western' },
  { id: 'st-rgm', code: 'RGM', name: 'Ragama', city: 'Ragama', latitude: 7.0278, longitude: 79.9234, province: 'Western' },
  { id: 'st-gph', code: 'GPH', name: 'Gampaha', city: 'Gampaha', latitude: 7.0917, longitude: 79.9997, province: 'Western' },
  { id: 'st-plg', code: 'PLG', name: 'Polgahawela', city: 'Polgahawela', latitude: 7.3333, longitude: 80.3000, province: 'North Western' },
  { id: 'st-kdy', code: 'KDY', name: 'Kandy', city: 'Kandy', latitude: 7.2906, longitude: 80.6337, province: 'Central' },
  { id: 'st-klt', code: 'KLT', name: 'Kalutara South', city: 'Kalutara', latitude: 6.5854, longitude: 79.9607, province: 'Western' },
  { id: 'st-gle', code: 'GLE', name: 'Galle', city: 'Galle', latitude: 6.0367, longitude: 80.2170, province: 'Southern' },
  { id: 'st-mtr', code: 'MTR', name: 'Matara', city: 'Matara', latitude: 5.9549, longitude: 80.5550, province: 'Southern' },
  { id: 'st-kru', code: 'KRU', name: 'Kurunegala', city: 'Kurunegala', latitude: 7.4863, longitude: 80.3623, province: 'North Western' },
  { id: 'st-anp', code: 'ANP', name: 'Anuradhapura', city: 'Anuradhapura', latitude: 8.3114, longitude: 80.4037, province: 'North Central' },
  { id: 'st-jaf', code: 'JAF', name: 'Jaffna', city: 'Jaffna', latitude: 9.6615, longitude: 80.0255, province: 'Northern' },
];

export const TRACKING_ROUTES = [
  {
    id: 'route-main',
    name: 'Main Line (Colombo Fort → Kandy)',
    color: '#2563eb', // Blue
    stations: ['Colombo Fort', 'Maradana', 'Ragama', 'Gampaha', 'Polgahawela', 'Kandy'],
    coordinates: [
      [6.9344, 79.8504], // Colombo Fort
      [6.9271, 79.8667], // Maradana
      [7.0278, 79.9234], // Ragama
      [7.0917, 79.9997], // Gampaha
      [7.2000, 80.1200], // Mirigama waypoint
      [7.3333, 80.3000], // Polgahawela
      [7.3200, 80.4500], // Rambukkana waypoint
      [7.2600, 80.5200], // Kadugannawa Pass waypoint
      [7.2700, 80.5900], // Peradeniya waypoint
      [7.2906, 80.6337], // Kandy
    ],
  },
  {
    id: 'route-coastal',
    name: 'Coastal Line (Colombo Fort → Matara)',
    color: '#059669', // Emerald Green
    stations: ['Colombo Fort', 'Kalutara South', 'Galle', 'Matara'],
    coordinates: [
      [6.9344, 79.8504], // Colombo Fort
      [6.8700, 79.8600], // Wellawatte waypoint
      [6.8300, 79.8700], // Mount Lavinia waypoint
      [6.7200, 79.9100], // Panadura waypoint
      [6.5854, 79.9607], // Kalutara South
      [6.4200, 79.9900], // Aluthgama waypoint
      [6.2400, 80.0500], // Ambalangoda waypoint
      [6.1400, 80.1000], // Hikkaduwa waypoint
      [6.0367, 80.2170], // Galle
      [5.9700, 80.4000], // Weligama waypoint
      [5.9549, 80.5550], // Matara
    ],
  },
  {
    id: 'route-northern',
    name: 'Northern Line (Colombo Fort → Jaffna)',
    color: '#7c3aed', // Purple
    stations: ['Colombo Fort', 'Polgahawela', 'Kurunegala', 'Anuradhapura', 'Jaffna'],
    coordinates: [
      [6.9344, 79.8504], // Colombo Fort
      [7.0278, 79.9234], // Ragama
      [7.3333, 80.3000], // Polgahawela
      [7.4863, 80.3623], // Kurunegala
      [7.7500, 80.3800], // Maho waypoint
      [8.3114, 80.4037], // Anuradhapura
      [8.7500, 80.4900], // Vavuniya waypoint
      [9.1500, 80.4200], // Kilinochchi waypoint
      [9.6615, 80.0255], // Jaffna
    ],
  },
];

// Initial state of tracked trains
const initialTrackedTrains = [
  {
    id: 'trk-1015',
    trainNumber: '1015',
    trainName: 'Udarata Menike',
    trainType: 'Express',
    routeId: 'route-main',
    routeName: 'Colombo Fort → Kandy',
    status: 'ON_TIME',
    baseSpeed: 62,
    routeIndex: 3, // near Gampaha
    direction: 1,  // moving forward
    currentStation: 'Gampaha',
    nextStation: 'Polgahawela',
    estimatedArrival: '09:42 AM',
  },
  {
    id: 'trk-1005',
    trainNumber: '1005',
    trainName: 'Podi Menike',
    trainType: 'Express',
    routeId: 'route-main',
    routeName: 'Kandy → Colombo Fort',
    status: 'ON_TIME',
    baseSpeed: 58,
    routeIndex: 7, // near Kadugannawa
    direction: -1, // moving towards Colombo
    currentStation: 'Kadugannawa',
    nextStation: 'Rambukkana',
    estimatedArrival: '10:15 AM',
  },
  {
    id: 'trk-8056',
    trainNumber: '8056',
    trainName: 'Ruhunu Kumari',
    trainType: 'Express',
    routeId: 'route-coastal',
    routeName: 'Colombo Fort → Matara',
    status: 'DELAYED',
    baseSpeed: 48,
    routeIndex: 4, // near Kalutara
    direction: 1,
    currentStation: 'Kalutara South',
    nextStation: 'Aluthgama',
    estimatedArrival: '10:55 AM',
  },
  {
    id: 'trk-8050',
    trainNumber: '8050',
    trainName: 'Galu Kumari',
    trainType: 'Normal',
    routeId: 'route-coastal',
    routeName: 'Matara → Colombo Fort',
    status: 'ON_TIME',
    baseSpeed: 52,
    routeIndex: 8, // near Galle
    direction: -1,
    currentStation: 'Galle',
    nextStation: 'Hikkaduwa',
    estimatedArrival: '11:10 AM',
  },
  {
    id: 'trk-4077',
    trainNumber: '4077',
    trainName: 'Yal Devi',
    trainType: 'Intercity',
    routeId: 'route-northern',
    routeName: 'Colombo Fort → Jaffna',
    status: 'ON_TIME',
    baseSpeed: 72,
    routeIndex: 4, // near Maho / Anuradhapura
    direction: 1,
    currentStation: 'Maho Junction',
    nextStation: 'Anuradhapura',
    estimatedArrival: '12:30 PM',
  },
  {
    id: 'trk-4003',
    trainNumber: '4003',
    trainName: 'Uttara Devi',
    trainType: 'Intercity',
    routeId: 'route-northern',
    routeName: 'Jaffna → Colombo Fort',
    status: 'STOPPED',
    baseSpeed: 0,
    routeIndex: 6, // at Kilinochchi
    direction: -1,
    currentStation: 'Kilinochchi',
    nextStation: 'Vavuniya',
    estimatedArrival: 'Delayed (Signal Hold)',
  },
];

// In-memory simulation state
let simulatedTrains = [...initialTrackedTrains];
let lastTickTime = Date.now();

// Progress the trains deterministically along coordinates
const tickSimulation = () => {
  const now = Date.now();
  const elapsedSeconds = Math.max(1, Math.round((now - lastTickTime) / 1000));
  lastTickTime = now;

  simulatedTrains = simulatedTrains.map((train) => {
    const route = TRACKING_ROUTES.find((r) => r.id === train.routeId);
    if (!route || train.status === 'STOPPED') {
      return {
        ...train,
        lastUpdated: new Date().toISOString(),
      };
    }

    const maxIndex = route.coordinates.length - 1;
    let nextIndex = train.routeIndex + (0.15 * train.direction);

    // Reverse direction if reaching line end
    let newDirection = train.direction;
    if (nextIndex >= maxIndex) {
      nextIndex = maxIndex;
      newDirection = -1;
    } else if (nextIndex <= 0) {
      nextIndex = 0;
      newDirection = 1;
    }

    // Interpolate coordinate
    const lowerIdx = Math.floor(nextIndex);
    const upperIdx = Math.min(maxIndex, Math.ceil(nextIndex));
    const factor = nextIndex - lowerIdx;

    const p1 = route.coordinates[lowerIdx];
    const p2 = route.coordinates[upperIdx];

    const lat = p1[0] + (p2[0] - p1[0]) * factor;
    const lng = p1[1] + (p2[1] - p1[1]) * factor;

    // Small realistic speed variance
    const speed = train.status === 'STOPPED' ? 0 : Math.max(35, Math.min(85, train.baseSpeed + Math.sin(nextIndex) * 5));

    const progressPct = Math.round((nextIndex / maxIndex) * 100);

    return {
      ...train,
      routeIndex: nextIndex,
      direction: newDirection,
      latitude: Number(lat.toFixed(5)),
      longitude: Number(lng.toFixed(5)),
      speed: Math.round(speed),
      routeProgressPct: progressPct,
      lastUpdated: new Date().toISOString(),
    };
  });
};

export const trackingSimulationService = {
  getTrackedTrains() {
    tickSimulation();
    return simulatedTrains.map((t) => ({
      ...t,
      currentLocation: {
        lat: t.latitude,
        lng: t.longitude,
      },
      speedKmh: t.speed,
      etaNextStation: t.estimatedArrival,
      isSimulated: true,
      simulationNotice: 'SIMULATED LIVE DATA for Sri Lanka Railways MVP',
    }));
  },

  getTrainTracking(id) {
    tickSimulation();
    const train = simulatedTrains.find(
      (t) => t.id === id || t.trainNumber === id || t.id === `trk-${id}`
    );
    if (!train) return null;

    const route = TRACKING_ROUTES.find((r) => r.id === train.routeId);

    // Generate journey station progress
    const stationSequence = (route ? route.stations : []).map((stName, idx) => {
      const total = route.stations.length;
      const threshold = (idx / (total - 1)) * 100;
      let state = 'UPCOMING';
      if (train.routeProgressPct >= threshold + 10) state = 'COMPLETED';
      else if (Math.abs(train.routeProgressPct - threshold) <= 15) state = 'CURRENT';

      return {
        stationName: stName,
        state,
      };
    });

    return {
      ...train,
      currentLocation: {
        lat: train.latitude,
        lng: train.longitude,
      },
      speedKmh: train.speed,
      etaNextStation: train.estimatedArrival,
      routeInfo: route ? {
        ...route,
        path: route.coordinates.map(([lat, lng]) => ({ lat, lng })),
      } : null,
      journeyProgress: stationSequence,
      isSimulated: true,
      simulationNotice: 'SIMULATED LIVE DATA for Sri Lanka Railways MVP',
    };
  },

  getTrackingRoutes() {
    return TRACKING_ROUTES.map((r) => ({
      ...r,
      path: r.coordinates.map(([lat, lng]) => ({ lat, lng })),
    }));
  },

  getTrackingStations() {
    return TRACKING_STATIONS.map((st) => ({
      ...st,
      coordinates: {
        lat: st.latitude,
        lng: st.longitude,
      },
      lines: ['Main Line', 'Coastal Line', 'Northern Line'],
      upcomingTrains: simulatedTrains
        .filter((t) => t.currentStation === st.name || t.nextStation === st.name)
        .map((t) => ({
          trainNumber: t.trainNumber,
          trainName: t.trainName,
          status: t.status,
          estimatedArrival: t.estimatedArrival,
        })),
    }));
  },

  getTrackingStatus() {
    tickSimulation();
    const onTimeCount = simulatedTrains.filter((t) => t.status === 'ON_TIME').length;
    const delayedCount = simulatedTrains.filter((t) => t.status === 'DELAYED').length;
    const stoppedCount = simulatedTrains.filter((t) => t.status === 'STOPPED').length;

    return {
      activeTrains: simulatedTrains.length,
      onTimeCount,
      delayedCount,
      stoppedCount,
      networkOperational: true,
      isSimulated: true,
      dataSource: 'SIMULATED LIVE DATA (Sri Lanka Railways MVP)',
      lastSync: new Date().toISOString(),
    };
  },
};
