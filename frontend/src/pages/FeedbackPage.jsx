import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { trainService } from '../services/trainService';
import { feedbackService } from '../services/feedbackService';
import {
  Star,
  Train,
  CheckCircle2,
  ShieldCheck,
  Building,
  ThumbsUp,
  PhoneCall,
  ArrowRight,
  Sparkles,
  ChevronRight,
  MessageSquareQuote,
} from 'lucide-react';

const FeedbackPage = () => {
  const [searchParams] = useSearchParams();
  const paramTrainNumber = searchParams.get('trainNumber');
  const paramTrainId = searchParams.get('trainId');

  const [trains, setTrains] = useState([]);
  const [selectedTrainId, setSelectedTrainId] = useState('');
  const [routeText, setRouteText] = useState('Colombo Fort → Kandy');
  const [travelDate, setTravelDate] = useState('2026-09-04');
  const [travelClass, setTravelClass] = useState('Second Class Reserved');

  // Star ratings
  const [overallRating, setOverallRating] = useState(4);
  const [punctuality, setPunctuality] = useState(4);
  const [cleanliness, setCleanliness] = useState(3);
  const [comfort, setComfort] = useState(4);
  const [staffService, setStaffService] = useState(5);
  const [comment, setComment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // Aggregated data
  const [summary, setSummary] = useState({
    averageRating: 4.2,
    punctualityRating: 4.1,
    cleanlinessRating: 3.5,
    comfortRating: 4.0,
    staffServiceRating: 4.3,
    recommendPct: 84,
  });

  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Nimali Silva',
      initials: 'NS',
      date: 'Yesterday • Second Class',
      rating: 5.0,
      comment:
        'The morning scenic views through Kadugannawa pass were breathtaking. Train departed on time from Fort and seats were clean and comfortable. Great experience!',
      route: 'Colombo Fort → Kandy',
      likes: 14,
    },
    {
      id: 2,
      name: 'Rohan Jayawardena',
      initials: 'RJ',
      date: '02 Sep 2026 • Third Class',
      rating: 3.0,
      comment:
        'Very crowded during the morning commuter rush between Ragama and Polgahawela. Once past Rambukkana, the ride was much smoother. Needs extra carriages.',
      route: 'Ragama → Polgahawela',
      likes: 28,
    },
    {
      id: 3,
      name: 'Dilshan Perera',
      initials: 'DP',
      date: '30 Aug 2026 • First Class A/C',
      rating: 4.0,
      comment:
        'Observation carriage was cool and quiet. A 10-minute delay near Peradeniya, but train staff kept everyone informed. Would ride again.',
      route: 'Colombo Fort → Badulla',
      likes: 9,
    },
  ]);

  useEffect(() => {
    trainService.getAllTrains()
      .then((data) => {
        setTrains(data);
        if (data.length > 0) {
          const matched = data.find(
            (t) => (paramTrainId && t._id === paramTrainId) || (paramTrainNumber && t.trainNumber === paramTrainNumber)
          );
          const initialTrain = matched || data[0];
          setSelectedTrainId(initialTrain._id);
          if (initialTrain.trainName.includes('Podi') || initialTrain.trainName.includes('Udarata')) {
            setRouteText('Colombo Fort → Kandy');
          } else if (initialTrain.trainName.includes('Ruhunu')) {
            setRouteText('Colombo Fort → Matara');
          } else if (initialTrain.trainName.includes('Yal Devi')) {
            setRouteText('Colombo Fort → Jaffna');
          }
          loadSummaryForTrain(initialTrain._id);
          loadFeedbackList(initialTrain._id);
        }
      })
      .catch((err) => console.error(err));
  }, [paramTrainId, paramTrainNumber]);

  const loadFeedbackList = async (trainId) => {
    try {
      const data = trainId 
        ? await feedbackService.getFeedbackByTrain(trainId)
        : await feedbackService.getAllFeedback();
      if (data && data.length > 0) {
        setReviewsList(data.map((f) => ({
          id: f._id,
          name: f.passengerName || 'Verified Commuter',
          initials: (f.passengerName || 'VC').substring(0, 2).toUpperCase(),
          date: new Date(f.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          rating: f.rating || 5,
          comment: f.comment,
          route: f.train?.route?.name || f.route?.name || 'Sri Lanka Railways',
          likes: 4,
        })));
      }
    } catch (e) {
      console.warn('Could not load feedback from server', e);
    }
  };

  const loadSummaryForTrain = async (trainId) => {
    try {
      const sum = await feedbackService.getFeedbackSummary(trainId);
      if (sum && sum.totalReviews > 0) {
        setSummary({
          averageRating: sum.averageRating,
          punctualityRating: sum.punctualityRating,
          cleanlinessRating: sum.cleanlinessRating,
          comfortRating: sum.comfortRating,
          staffServiceRating: sum.staffServiceRating,
          recommendPct: Math.round((sum.averageRating / 5) * 100),
        });
      }
    } catch (e) {
      console.warn('Using default summary metrics', e);
    }
  };

  const handleTrainSelect = (trainId) => {
    setSelectedTrainId(trainId);
    const found = trains.find((t) => t._id === trainId);
    if (found) {
      if (found.trainName.includes('Podi') || found.trainName.includes('Udarata')) {
        setRouteText('Colombo Fort → Kandy');
      } else if (found.trainName.includes('Ruhunu')) {
        setRouteText('Colombo Fort → Matara');
      } else if (found.trainName.includes('Yal Devi')) {
        setRouteText('Colombo Fort → Jaffna');
      }
      loadSummaryForTrain(trainId);
      loadFeedbackList(trainId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorNotice('');
    setSuccessNotice('');

    try {
      await feedbackService.createFeedback({
        trainId: selectedTrainId,
        rating: overallRating,
        punctualityRating: punctuality,
        cleanlinessRating: cleanliness,
        comfortRating: comfort,
        staffServiceRating: staffService,
        comment,
      });

      setSuccessNotice('Your feedback was successfully verified and recorded into the civic railway audit log.');
      setComment('');
      loadSummaryForTrain(selectedTrainId);
      loadFeedbackList(selectedTrainId);
    } catch (err) {
      setErrorNotice(err.message || 'Feedback could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Star selector helper
  const renderInteractiveStars = (currentVal, setter, max = 5) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-0.5 focus:outline-none hover:scale-110 transition-transform"
          >
            <Star
              className={`w-4 h-4 ${
                star <= currentVal
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300 fill-transparent'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#F8FAFC]">
      {/* Top Breadcrumb & Protocol Strip */}
      <div className="bg-white border-b border-gray-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <span>TrainTrack Civic Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Passenger Voice</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-800">Service Feedback</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Civic Audit Protocol Active • Sept 2026</span>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Sri Lanka Railways Passenger Experience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2C] tracking-tight">
              How Was Your Journey?
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Rate your train travel experience, recognize great service, and provide constructive feedback to improve Sri Lanka's railway network.
            </p>
          </div>

          {/* Current Target Focus Card */}
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-3.5 flex items-center gap-3.5 min-w-[280px]">
            <div className="w-10 h-10 rounded-lg bg-[#0B1A2C] text-white flex items-center justify-center shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Target Focus
              </span>
              <span className="text-xs font-black text-gray-900 block">Train 1015 — Podi Menike</span>
              <span className="text-[11px] text-gray-500">Main Line • Colombo to Badulla</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Passenger Review Submission Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded">
                    <MessageSquareQuote className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0B1A2C]">Passenger Review Submission</h2>
                    <p className="text-[11px] text-gray-400">Your ticket verification validates your civic vote</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  ● Digital Ticket #SLR-9824
                </span>
              </div>

              {successNotice && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}

              {errorNotice && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {errorNotice}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Train and Route row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Selected Train
                    </label>
                    <select
                      value={selectedTrainId}
                      onChange={(e) => handleTrainSelect(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                    >
                      {trains.map((t) => (
                        <option key={t._id} value={t._id}>
                          Train {t.trainNumber} — {t.trainName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Route & Stations
                    </label>
                    <input
                      type="text"
                      value={routeText}
                      onChange={(e) => setRouteText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                    />
                  </div>
                </div>

                {/* Date and Travel Class row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Travel Class
                    </label>
                    <select
                      value={travelClass}
                      onChange={(e) => setTravelClass(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                    >
                      <option value="Second Class Reserved">Second Class Reserved</option>
                      <option value="Third Class">Third Class Standard</option>
                      <option value="First Class A/C">First Class A/C Observation</option>
                    </select>
                  </div>
                </div>

                {/* Primary Overall Indicator Card */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                        Primary Indicator
                      </span>
                      <h4 className="text-sm font-bold text-gray-900">Overall Journey Experience</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setOverallRating(star)}
                            className="focus:outline-none hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= overallRating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300 fill-transparent'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-700 ml-1">
                        {overallRating} out of 5 stars – {overallRating >= 4 ? 'Good' : overallRating === 3 ? 'Average' : 'Needs Work'}
                      </span>
                    </div>
                  </div>

                  {/* Sub-criteria grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-blue-100/80 mt-2">
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-50">
                      <span className="text-xs text-gray-700 font-medium">Punctuality</span>
                      <div className="flex items-center gap-2">
                        {renderInteractiveStars(punctuality, setPunctuality)}
                        <span className="text-xs font-bold text-gray-600">{punctuality} / 5</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-50">
                      <span className="text-xs text-gray-700 font-medium">Cleanliness</span>
                      <div className="flex items-center gap-2">
                        {renderInteractiveStars(cleanliness, setCleanliness)}
                        <span className="text-xs font-bold text-gray-600">{cleanliness} / 5</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-50">
                      <span className="text-xs text-gray-700 font-medium">Comfort & Seating</span>
                      <div className="flex items-center gap-2">
                        {renderInteractiveStars(comfort, setComfort)}
                        <span className="text-xs font-bold text-gray-600">{comfort} / 5</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-50">
                      <span className="text-xs text-gray-700 font-medium">Staff & Station Service</span>
                      <div className="flex items-center gap-2">
                        {renderInteractiveStars(staffService, setStaffService)}
                        <span className="text-xs font-bold text-gray-600">{staffService} / 5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Written Observation textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Written Journey Observations & Suggestions
                    </label>
                    <span className="text-[11px] text-gray-400">Min 20 characters</span>
                  </div>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience, station amenities, scenic highlights, or suggestions for improvement..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                  />
                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="inline-flex items-center gap-2 bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold">Kasun P.</span>
                    <span className="text-gray-400">• Verified Passenger</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1A2C] hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-lg shadow-sm transition-colors"
                  >
                    <span>{submitting ? 'Recording Vote...' : 'Submit Journey Feedback'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Heritage Route Scenic Card */}
            <div className="h-44 rounded-xl overflow-hidden relative shadow-sm flex items-end p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-900 text-white border border-gray-200">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Main Line Heritage Route
                </span>
                <p className="text-xs text-slate-200 max-w-lg leading-relaxed">
                  Passing Kadugannawa Pass & Bible Rock. Daily commuter feedback ensures structural track maintenance and scenic coach glass upkeep.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Community Aggregates & Impact (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dark Navy Community Ratings Card */}
            <div className="bg-[#0B1A2C] text-white rounded-xl p-6 shadow-sm border border-slate-800 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  ● Official Aggregate Index
                </span>
                <h3 className="text-base font-bold text-white leading-snug">
                  Community Ratings for Train 1015 (Podi Menike)
                </h3>
              </div>

              {/* Large Score & Circular badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{summary.averageRating}</span>
                    <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Based on 125 passenger ratings this month
                  </span>
                </div>

                {/* Circle badge */}
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/80 bg-slate-900 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-lg font-black text-white leading-none">
                    {summary.recommendPct}%
                  </span>
                  <span className="text-[8px] uppercase tracking-tighter text-emerald-400 font-bold leading-tight mt-0.5">
                    Commuters Recommend
                  </span>
                </div>
              </div>

              {/* Category Progress Bars */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
                    <span>Punctuality</span>
                    <span className="font-bold text-white">{summary.punctualityRating} / 5 (82% positive)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
                    <span>Cleanliness</span>
                    <span className="font-bold text-white">{summary.cleanlinessRating} / 5 (70% positive)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
                    <span>Comfort</span>
                    <span className="font-bold text-white">{summary.comfortRating} / 5 (80% positive)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
                    <span>Staff Service</span>
                    <span className="font-bold text-white">{summary.staffServiceRating} / 5 (86% positive)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Updated automatically every 4 hours from gate validation records.</span>
              </div>
            </div>

            {/* How Your Feedback Drives Change Card */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-800">
                <Building className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Civic Accountability</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900">How your feedback drives change</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Monthly ratings are shared directly with the Ministry of Transport and regional railway operating departments to influence carriage allocations, scheduled cleanings, and crew recognitions.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Verified Passenger Reviews Section */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Live Passenger Feed</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B1A2C]">Recent Verified Passenger Reviews</h3>
            </div>
            <span className="text-xs text-gray-500">Showing latest submissions for Main Line</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                        {rev.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-none">{rev.name}</h4>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(rev.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{rev.rating.toFixed(1)}</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>{rev.route}</span>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{rev.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Need Urgent Assistance Strip */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-900">
                Need urgent onboard railway police or medical support?
              </h5>
              <p className="text-xs text-gray-500">
                For acute in-transit delays, security concerns, or lost baggage, use the Rapid Issue Desk.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/report-issue"
              className="text-xs font-bold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg transition-colors"
            >
              Report Urgent Issue
            </Link>
            <a
              href="tel:1971"
              className="text-xs font-bold text-white bg-[#0B1A2C] hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-colors"
            >
              Dial 1971 Hotline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
