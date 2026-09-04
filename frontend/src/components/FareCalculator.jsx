import React, { useState, useEffect } from 'react';
import './FareCalculator.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORY_MULTIPLIER = {
  adult: 1,
  child: 0.5,
  senior: 0.8,
  infant: 0,
};

const CLASS_LABELS = {
  '3rd': 'Third Class',
  '2nd': 'Second Class Reserved',
  '1st': 'First Class A/C',
};

function estimateTravelTime(distanceKm) {
  if (!distanceKm) return '';
  const totalMinutes = Math.round((distanceKm / 42) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function FareCalculator() {
  const [stations, setStations] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [trainClass, setTrainClass] = useState('2nd');
  const [category, setCategory] = useState('adult');
  const [passengers, setPassengers] = useState(2);

  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/fare/stations`)
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch(() => setError('Could not load stations. Check your connection.'));
  }, []);

  const runCalculation = async (classToUse = trainClass) => {
    setError('');
    if (!origin || !destination) {
      setError('Please select both a departure and destination station.');
      return null;
    }
    if (origin === destination) {
      setError('Departure and destination must be different stations.');
      return null;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/fare/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, trainClass: classToUse }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return null;
      }

      const multiplier = CATEGORY_MULTIPLIER[category];
      const levyPerTicket = classToUse === '3rd' ? 0 : 100;
      const farePerPassenger = Math.round(data.totalFare * multiplier);
      const totalPayable = (farePerPassenger + levyPerTicket) * passengers;

      const enriched = {
        ...data,
        trainClass: classToUse,
        farePerPassenger,
        levyPerTicket,
        totalPayable,
      };
      setResult(enriched);
      return enriched;
    } catch {
      setError('Server not reachable. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setComparison(null);
    await runCalculation(trainClass);
  };

  const handleReset = () => {
    setOrigin('');
    setDestination('');
    setTrainClass('2nd');
    setCategory('adult');
    setPassengers(2);
    setResult(null);
    setComparison(null);
    setError('');
  };

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleCompare = async () => {
    setError('');
    if (!origin || !destination || origin === destination) {
      setError('Select valid, different departure and destination stations first.');
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/api/fare/compare?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Comparison failed.');
      } else {
        setComparison(data);
      }
    } catch {
      setError('Server not reachable. Please try again.');
    }
  };

  const handleClassCardClick = async (cls) => {
    setTrainClass(cls);
    await runCalculation(cls);
  };

  const getClassComparisonFare = (cls) => {
    if (!comparison) return null;
    const entry = comparison.comparison.find((c) => c.trainClass === cls);
    return entry ? entry.totalFare : null;
  };

  return (
    <div className="fc-page">
      <div className="fc-hero">
        <div className="fc-hero-left">
          <div className="fc-eyebrow">
            <span className="tt-dot" /> OFFICIAL SLRD DISTANCE CALCULATOR &bull; GAZETTE REV 2024/25
          </div>
          <h1>Calculate Your Train Fare</h1>
          <p className="fc-subtitle">
            Official Sri Lanka Railways distance-based fare estimator. Transparent ticket rates
            across all passenger categories and seat classes.
          </p>
        </div>
        <div className="fc-hero-stats">
          <div>
            <div className="fc-stat-label">FARE TARIFF BASIS</div>
            <div className="fc-stat-value">Distance Slabs</div>
          </div>
          <div>
            <div className="fc-stat-label">NETWORK REACH</div>
            <div className="fc-stat-value fc-green">1,508+ Track KM</div>
          </div>
        </div>
      </div>

      <div className="fc-grid">
        <form className="fc-card" onSubmit={handleCalculate}>
          <div className="fc-card-header">
            <span><span className="tt-dot" /> CONFIGURE ITINERARY</span>
            <span className="fc-step">Step 1 of 2</span>
          </div>

          <div className="fc-row-2">
            <div className="fc-field">
              <label><span className="fc-dot-blue" /> DEPARTURE STATION</label>
              <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                <option value="">Select station</option>
                {stations.map((s) => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <button type="button" className="fc-swap-btn" onClick={handleSwap} aria-label="Swap stations">
              ⇄
            </button>

            <div className="fc-field">
              <label><span className="fc-dot-red" /> DESTINATION STATION</label>
              <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="">Select station</option>
                {stations.map((s) => (
                  <option key={s._id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="fc-row-2">
            <div className="fc-field">
              <label>PASSENGER CATEGORY</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="adult">Adult (12+ years)</option>
                <option value="child">Child (3-11 years)</option>
                <option value="senior">Senior (60+ years)</option>
                <option value="infant">Infant (under 3, free)</option>
              </select>
            </div>
            <div className="fc-field">
              <label>TRAVEL CLASS & ACCOMMODATION</label>
              <select value={trainClass} onChange={(e) => setTrainClass(e.target.value)}>
                <option value="3rd">Third Class</option>
                <option value="2nd">Second Class Reserved</option>
                <option value="1st">First Class A/C</option>
              </select>
            </div>
          </div>

          <div className="fc-field">
            <div className="fc-passenger-box">
              <div>
                <div className="fc-passenger-label">Total Passengers</div>
                <div className="fc-passenger-hint">Maximum 10 tickets per calculation session</div>
              </div>
              <div className="fc-stepper">
                <button type="button" onClick={() => setPassengers((p) => Math.max(1, p - 1))}>−</button>
                <span>{passengers}</span>
                <button type="button" onClick={() => setPassengers((p) => Math.min(10, p + 1))}>+</button>
              </div>
            </div>
          </div>

          <div className="fc-info-box">
            ⓘ All calculations reflect official Sri Lanka Railways Gazette Extraordinary tariffs,
            Regulation Section 144a. Distance tables verified quarterly by Chief Commercial Superintendent.
          </div>

          {error && <p className="fc-error">{error}</p>}

          <div className="fc-btn-row">
            <button type="submit" className="fc-btn-primary" disabled={loading}>
              🎫 {loading ? 'Calculating...' : 'Calculate Fare'}
            </button>
            <button type="button" className="fc-btn-outline" onClick={handleReset}>
              Reset Form
            </button>
          </div>
        </form>

        <div className="fc-card">
          <div className="fc-card-header">
            <span>ESTIMATED TRIP COST SUMMARY</span>
            <span className="fc-verified">● Verified Tariff</span>
          </div>

          {result ? (
            <>
              <div className="fc-amount-box">
                <div className="fc-amount-label">ESTIMATED PAYABLE AMOUNT</div>
                <div className="fc-amount">
                  Rs. {result.totalPayable.toLocaleString()} <span>LKR Total</span>
                </div>
              </div>

              <div className="fc-summary-row">
                <span>Selected Route</span>
                <span>{result.origin} → {result.destination} ({result.distanceKm} km)</span>
              </div>
              <div className="fc-summary-row">
                <span>Fare per passenger</span>
                <span>Rs. {result.farePerPassenger}</span>
              </div>
              <div className="fc-summary-row">
                <span>Passenger Count</span>
                <span>{passengers} {category.charAt(0).toUpperCase() + category.slice(1)}(s)</span>
              </div>
              <div className="fc-summary-row">
                <span>Travel Class</span>
                <span>{CLASS_LABELS[result.trainClass]}</span>
              </div>
              <div className="fc-summary-row">
                <span>Seat Reservation Levy</span>
                <span className="fc-green">
                  {result.levyPerTicket > 0 ? `Included (Rs. ${result.levyPerTicket}/ticket)` : 'Not applicable'}
                </span>
              </div>

              <p className="fc-disclaimer">
                Official estimate. Tickets can be purchased at station ticket counters or official
                reservation windows. Note: this platform does not process payments or bookings.
              </p>

              <button type="button" className="fc-btn-link" onClick={handleCompare}>
                📊 Compare All Classes For This Route
              </button>
            </>
          ) : (
            <p className="fc-empty-state">
              Fill in your journey details and click <strong>Calculate Fare</strong> to see your
              estimated trip cost here.
            </p>
          )}
        </div>
      </div>

      <div className="fc-section">
        <div className="fc-section-header">
          <div>
            <div className="fc-eyebrow-small">ACCOMMODATIONS</div>
            <h2>Compare Carriage Classes</h2>
            <p className="fc-subtitle-small">
              Real passenger comfort specifications and tariff benchmarks
              {result ? ` for the ${result.origin} – ${result.destination} line.` : '.'}
            </p>
          </div>
          {result && (
            <div className="fc-distance-note">
              Distance: ~{result.distanceKm} km &bull; Approx. {estimateTravelTime(result.distanceKm)}
            </div>
          )}
        </div>

        <div className="fc-class-grid">
          <div className="fc-class-card">
            <div className="fc-class-top">
              <h3>Third Class</h3>
              <span className="fc-tag">Budget Essential</span>
            </div>
            <div className="fc-class-rate-label">PER PASSENGER RATE</div>
            <div className="fc-class-rate">
              Rs. {comparison ? getClassComparisonFare('3rd') : '—'} <span>/ seat</span>
            </div>
            <p className="fc-class-desc">
              Standard bench seating. High commuter volume. Walk-in ticketing directly at stations on travel day.
            </p>
            <ul>
              <li>✓ Standard vinyl bench seating</li>
              <li>✓ Unreserved walk-in purchase</li>
              <li>✓ Available on all express & slow trains</li>
              <li className="fc-no">✗ No seat reservation guarantee</li>
            </ul>
            <button type="button" onClick={() => handleClassCardClick('3rd')}>Calculate for 3rd Class</button>
          </div>

          <div className="fc-class-card fc-class-featured">
            <div className="fc-featured-badge">POPULAR CHOICE &bull; BEST VALUE</div>
            <div className="fc-class-top">
              <h3>Second Class</h3>
              <span className="fc-tag fc-tag-green">Best Value</span>
            </div>
            <div className="fc-class-rate-label">PER PASSENGER RATE</div>
            <div className="fc-class-rate">
              Rs. {comparison ? getClassComparisonFare('2nd') : '—'} <span>/ seat</span>
            </div>
            <p className="fc-class-desc">
              Cushioned individual seating with reserved coaches available up to 30 days in advance via SLR booking windows.
            </p>
            <ul>
              <li>✓ Cushioned 2x2 individual seats</li>
              <li>✓ Reserved numbered seats in coaches</li>
              <li>✓ Overhead luggage racks & roof fans</li>
              <li>✓ Full panoramic open-view windows</li>
            </ul>
            <button type="button" className="fc-btn-featured" onClick={() => handleClassCardClick('2nd')}>
              Calculate for 2nd Class
            </button>
          </div>

          <div className="fc-class-card">
            <div className="fc-class-top">
              <h3>First Class A/C</h3>
              <span className="fc-tag">Premium Scenic</span>
            </div>
            <div className="fc-class-rate-label">PER PASSENGER RATE</div>
            <div className="fc-class-rate">
              Rs. {comparison ? getClassComparisonFare('1st') : '—'} <span>/ seat</span>
            </div>
            <p className="fc-class-desc">
              Climate-controlled coaches, wide panoramic windows, reclining seats and peaceful noise-isolated carriages.
            </p>
            <ul>
              <li>✓ Fully air-conditioned climate control</li>
              <li>✓ Large panoramic observation glass</li>
              <li>✓ Assigned reserved numbered seats</li>
              <li>✓ Power outlets for mobile charging</li>
            </ul>
            <button type="button" onClick={() => handleClassCardClick('1st')}>Calculate for 1st Class</button>
          </div>
        </div>
      </div>

      <div className="fc-section">
        <div className="fc-section-header">
          <div>
            <div className="fc-eyebrow-small">QUICK REFERENCE MATRIX</div>
            <h2>Major Line Fares From Colombo Fort</h2>
          </div>
          <div className="fc-distance-note">Direct commuter rates per adult single journey</div>
        </div>

        <div className="fc-table-wrap">
          <table className="fc-table">
            <thead>
              <tr>
                <th>Destination Terminal</th>
                <th>Distance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stations
                .filter((s) => s.name !== 'Colombo Fort')
                .map((s) => (
                  <tr key={s._id}>
                    <td className="fc-station-name">🚉 {s.name}</td>
                    <td>{s.distanceFromColombo} km</td>
                    <td>
                      <button
                        type="button"
                        className="fc-load-btn"
                        onClick={() => {
                          setOrigin('Colombo Fort');
                          setDestination(s.name);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fc-policy-grid">
        <div className="fc-policy-card">
          <div className="fc-policy-icon">🙂</div>
          <h4>Children Policy</h4>
          <p>Infants under 3 travel free at no seat occupancy. Children between 3 and 11 years receive a 50% discount on standard fares.</p>
        </div>
        <div className="fc-policy-card">
          <div className="fc-policy-icon">👤</div>
          <h4>Senior Concessions</h4>
          <p>Sri Lankan citizens aged 60+ are eligible for concessionary rates on unreserved classes upon presentation of the NIC at counters.</p>
        </div>
        <div className="fc-policy-card">
          <div className="fc-policy-icon">🎟️</div>
          <h4>Advance Bookings</h4>
          <p>Reserved 1st, 2nd and 3rd class berths open for advance ticketing 30 days prior to departure at accredited reservation stations.</p>
        </div>
      </div>
    </div>
  );
}
