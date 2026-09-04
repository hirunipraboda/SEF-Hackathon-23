import { useState, useEffect, useRef, useCallback } from 'react';
import { trackingService } from '../services/trackingService';

export const useLiveTracking = ({ pollingInterval = 8000 } = {}) => {
  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [statusMeta, setStatusMeta] = useState(null);

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedTrainDetails, setSelectedTrainDetails] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ON_TIME, DELAYED, STOPPED
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('');

  const timerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Fetch initial static/semi-static data (stations & routes)
  useEffect(() => {
    isMountedRef.current = true;

    const fetchBaseData = async () => {
      try {
        const [stationsData, routesData, statusData] = await Promise.all([
          trackingService.getStations(),
          trackingService.getTrackingRoutes(),
          trackingService.getTrackingStatus(),
        ]);
        if (isMountedRef.current) {
          setStations(stationsData);
          setRoutes(routesData);
          setStatusMeta(statusData);
        }
      } catch (err) {
        console.warn('Failed to load tracking stations/routes base data:', err);
      }
    };

    fetchBaseData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Poll live train positions
  const fetchLiveTrains = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await trackingService.getLiveTrains();
      if (!isMountedRef.current) return;

      setTrains(data);
      setLastUpdated(new Date());
      setError('');

      // Keep selected train synced with updated coordinates
      setSelectedTrain((currentSelected) => {
        if (!currentSelected) return null;
        const updated = data.find((t) => t.id === currentSelected.id || t.trainNumber === currentSelected.trainNumber);
        return updated || currentSelected;
      });
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Unable to connect to live tracking service.');
      }
    } finally {
      if (isMountedRef.current && isInitial) {
        setLoading(false);
      }
    }
  }, []);

  // Set up polling interval with clean teardown
  useEffect(() => {
    fetchLiveTrains(true);

    timerRef.current = setInterval(() => {
      fetchLiveTrains(false);
    }, pollingInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fetchLiveTrains, pollingInterval]);

  // Fetch full details when a train is selected
  useEffect(() => {
    if (!selectedTrain) {
      setSelectedTrainDetails(null);
      return;
    }

    trackingService.getTrainTracking(selectedTrain.id || selectedTrain.trainNumber)
      .then((details) => {
        if (isMountedRef.current) {
          setSelectedTrainDetails(details);
        }
      })
      .catch((err) => console.warn('Could not fetch train details:', err));
  }, [selectedTrain?.id, selectedTrain?.lastUpdated]);

  const selectTrain = (train) => {
    setSelectedStation(null);
    setSelectedTrain(train);
  };

  const selectStation = (station) => {
    setSelectedTrain(null);
    setSelectedStation(station);
  };

  const clearSelection = () => {
    setSelectedTrain(null);
    setSelectedTrainDetails(null);
    setSelectedStation(null);
  };

  // Filtered trains
  const filteredTrains = trains.filter((train) => {
    // Status filter
    if (statusFilter !== 'ALL' && train.status !== statusFilter) {
      return false;
    }
    // Route filter
    if (selectedRouteFilter && train.routeId !== selectedRouteFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNumber = train.trainNumber?.toLowerCase().includes(q);
      const matchName = train.trainName?.toLowerCase().includes(q);
      const matchRoute = train.routeName?.toLowerCase().includes(q);
      const matchStation = train.currentStation?.toLowerCase().includes(q) || train.nextStation?.toLowerCase().includes(q);
      if (!matchNumber && !matchName && !matchRoute && !matchStation) return false;
    }
    return true;
  });

  return {
    trains: filteredTrains,
    allTrains: trains,
    routes,
    stations,
    statusMeta,
    selectedTrain,
    selectedTrainDetails,
    selectedStation,
    loading,
    error,
    lastUpdated,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedRouteFilter,
    setSelectedRouteFilter,
    selectTrain,
    selectStation,
    clearSelection,
    refresh: () => fetchLiveTrains(false),
  };
};
