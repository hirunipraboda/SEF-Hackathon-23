import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { trainService } from '../services/trainService';
import { stationService } from '../services/stationService';
import { issueService } from '../services/issueService';
import {
  Clock,
  Users,
  Sparkles,
  AlertTriangle,
  Wrench,
  UserCheck,
  HelpCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  FileText,
  UploadCloud,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Send,
  Map,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'TRAIN_DELAY', label: 'Delay / Punctuality', icon: Clock },
  { id: 'OVERCROWDING', label: 'Overcrowding', icon: Users },
  { id: 'CLEANLINESS', label: 'Cleanliness', icon: Sparkles },
  { id: 'UNSAFE_CONDITION', label: 'Track Hazard', icon: AlertTriangle },
  { id: 'BROKEN_FACILITY', label: 'Broken Facilities', icon: Wrench },
  { id: 'STAFF_SERVICE', label: 'Staff / Service', icon: UserCheck },
  { id: 'OTHER', label: 'Other Inquiries', icon: HelpCircle },
];

const SEVERITY_LEVELS = [
  {
    id: 'LOW',
    label: 'Low Severity',
    desc: 'Minor cosmetic issue, lights',
    dotColor: 'bg-slate-400',
    borderActive: 'border-slate-400 bg-slate-50',
  },
  {
    id: 'MEDIUM',
    label: 'Medium Severity',
    desc: 'Delays, broken fan, congestion',
    dotColor: 'bg-amber-500',
    borderActive: 'border-amber-500 bg-amber-50/50',
  },
  {
    id: 'HIGH',
    label: 'High Severity',
    desc: 'Safety risk, track obstruction, door fault',
    dotColor: 'bg-red-500',
    borderActive: 'border-red-500 bg-red-50/50',
  },
];

const ReportIssuePage = () => {
  const [searchParams] = useSearchParams();
  const paramTrainNumber = searchParams.get('trainNumber');
  const paramTrainId = searchParams.get('trainId');

  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [myReports, setMyReports] = useState([]);

  const [selectedTrainId, setSelectedTrainId] = useState('');
  const [journeyRoute, setJourneyRoute] = useState('Colombo Fort → Kandy');
  const [category, setCategory] = useState('TRAIN_DELAY');
  const [stationLocation, setStationLocation] = useState('Kadugannawa Station / In-Transit');
  const [date, setDate] = useState('2026-09-04');
  const [time, setTime] = useState('08:45');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState(
    'Train 1015 experienced a sudden 20-minute unscheduled stop just before Kadugannawa tunnel due to signal failure. Carriage 3 ceiling fan is also inoperative.'
  );

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
          if (initialTrain.trainName.includes('Podi Menike') || initialTrain.trainName.includes('Udarata')) {
            setJourneyRoute('Colombo Fort → Kandy');
          } else if (initialTrain.trainName.includes('Ruhunu')) {
            setJourneyRoute('Colombo Fort → Matara');
          } else if (initialTrain.trainName.includes('Yal Devi')) {
            setJourneyRoute('Colombo Fort → Jaffna');
          }
        }
      })
      .catch((err) => console.error(err));

    stationService.getAllStations()
      .then((data) => setStations(data))
      .catch((err) => console.error(err));

    issueService.getAllIssues()
      .then((data) => setMyReports(data))
      .catch((err) => console.error(err));
  }, [paramTrainId, paramTrainNumber]);

  const handleTrainChange = (trainId) => {
    setSelectedTrainId(trainId);
    const found = trains.find((t) => t._id === trainId);
    if (found) {
      if (found.trainName.includes('Podi Menike') || found.trainName.includes('Udarata')) {
        setJourneyRoute('Colombo Fort → Kandy');
      } else if (found.trainName.includes('Ruhunu')) {
        setJourneyRoute('Colombo Fort → Matara');
      } else if (found.trainName.includes('Yal Devi')) {
        setJourneyRoute('Colombo Fort → Jaffna');
      } else {
        setJourneyRoute('Main Line Express Route');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || description.trim().length < 5) {
      setErrorMessage('Please provide an incident description with at least 5 characters.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const created = await issueService.createIssue({
        trainId: selectedTrainId || null,
        issueType: category,
        severity,
        description: description.trim(),
      });

      setSuccessMessage(`Report ${created.reportId} submitted successfully to depot dispatch.`);
      setMyReports([created, ...myReports]);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit report. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Dark Navy Hero Header */}
      <div className="bg-[#0B1A2C] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Civic Operations & Passenger Safety</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Direct Depot Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Report a Railway Issue
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Help us identify problems and improve the railway experience for all passengers. Submitted reports are channeled directly to railway station masters and maintenance divisions across Sri Lanka Railways.
            </p>
          </div>

          {/* Right Metrics in Hero */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#11243B] border border-slate-700/80 rounded-xl p-4 flex items-center gap-3 min-w-[170px]">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Avg Response Time
                </span>
                <span className="text-lg font-extrabold text-white">18 Minutes</span>
              </div>
            </div>

            <div className="bg-[#11243B] border border-slate-700/80 rounded-xl p-4 flex items-center gap-3 min-w-[170px]">
              <div className="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800/40">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Resolved Today
                </span>
                <span className="text-lg font-extrabold text-white">42 Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Transit Incident Intake Form (7 Cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-md">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-[#0B1A2C]">Transit Incident Intake</h2>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Step 1 of 1
                </span>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Train Number & Journey Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Train Number & Name
                    </label>
                    <select
                      value={selectedTrainId}
                      onChange={(e) => handleTrainChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-lg text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                    >
                      {trains.map((t) => (
                        <option key={t._id} value={t._id}>
                          Train {t.trainNumber} ({t.trainName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Journey Route (Auto-Linked)
                    </label>
                    <div className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center justify-between">
                      <span>{journeyRoute}</span>
                      <span className="text-xs text-slate-400 font-mono">Linked</span>
                    </div>
                  </div>
                </div>

                {/* Category of Incident */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Category of Incident
                    </label>
                    <span className="text-[11px] text-gray-400">Select primary factor</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CATEGORIES.map((cat) => {
                      const IconComponent = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                            isSelected
                              ? 'bg-[#0B1A2C] border-[#0B1A2C] text-white shadow-sm'
                              : 'bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100'
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                          <span className="text-xs font-medium leading-tight">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Station Milepost & Timestamp */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Station or Track Milepost
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={stationLocation}
                        onChange={(e) => setStationLocation(e.target.value)}
                        placeholder="e.g. Kadugannawa Station / In-Transit"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                      />
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Occurrence Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                      />
                      <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Timestamp
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                      />
                      <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Severity Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Severity Level
                    </label>
                    <span className="text-[11px] text-gray-400">Calibrates response hierarchy</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SEVERITY_LEVELS.map((lvl) => {
                      const isSelected = severity === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setSeverity(lvl.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? `${lvl.borderActive} border-2 shadow-sm`
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2.5 h-2.5 rounded-full ${lvl.dotColor}`}></span>
                            <span className="text-xs font-bold text-gray-900">{lvl.label}</span>
                          </div>
                          <p className="text-[11px] text-gray-500">{lvl.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Incident Narrative */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Detailed Incident Narrative
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={600}
                    placeholder="Provide details including carriage number, specific coaches affected, or safety conditions observed..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0B1A2C]"
                  />
                  <div className="text-right text-[11px] text-gray-400 mt-1">
                    Maximum 600 characters ({600 - description.length} remaining)
                  </div>
                </div>

                {/* Photo / Ticket Proof Attachment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Photo / Ticket Proof Attachment (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 hover:border-slate-400 bg-slate-50/50 rounded-xl p-6 text-center transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-800">
                      Drop photo of carriage or station board
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      PNG, JPG or HEIC (Maximum file size 6MB)
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>GPS & station stamp attached automatically</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1A2C] hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Dispatching Report...' : 'Submit Railway Report'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Civic Accountability Banner under Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5">
              <div className="w-full sm:w-44 h-28 rounded-lg overflow-hidden shrink-0 bg-gradient-to-tr from-emerald-800 to-teal-600 flex items-end p-2 text-white relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <span className="relative text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded">
                  Kadugannawa Incline
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block mb-1">
                  Civic Accountability
                </span>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  How Your Report Resolves Commuter Friction
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Reports filed on TrainTrack Sri Lanka are synchronized directly with Department of Railways Divisional Superintendents in Colombo, Kandy, Nawalapitiya, and Anuradhapura to verify physical defects within scheduled maintenance cycles.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: My Reports, Hotspots, Helpline (4 Cols on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            {/* My Reports Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-700" />
                  <h3 className="font-bold text-sm text-gray-900">My Reports</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {myReports.length || 3} Tracked
                </span>
              </div>

              <div className="space-y-3">
                {/* Item 1 */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">TR-1024</span>
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Under Review
                    </span>
                    <span className="text-[10px] text-gray-400">Today, 09:15 AM</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">Train Delay & Inoperative Fan</h4>
                  <p className="text-[11px] text-gray-500">Colombo Fort → Kandy (Train 1015)</p>
                  <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600 flex items-start gap-1">
                    <span className="font-semibold text-slate-800">Assigned:</span>
                    <span>Rambukkana Technical Division. Inspection underway.</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">TR-1018</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Resolved
                    </span>
                    <span className="text-[10px] text-gray-400">2 days ago</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">Cleanliness in Washrooms</h4>
                  <p className="text-[11px] text-gray-500">Colombo Fort → Galle (Ruhunu Kumari)</p>
                  <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600 flex items-start gap-1">
                    <span className="font-semibold text-slate-800">Action:</span>
                    <span>Sanitation crew deployed at Galle station terminal.</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">TR-0992</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Resolved
                    </span>
                    <span className="text-[10px] text-gray-400">28 Aug 2026</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">Severe Overcrowding at Peak Hour</h4>
                  <p className="text-[11px] text-gray-500">Gampaha → Colombo Fort</p>
                  <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600 flex items-start gap-1">
                    <span className="font-semibold text-slate-800">Action:</span>
                    <span>Additional commuter carriage scheduled on train 1072.</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <Link
                  to="/my-reports"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <span>View All Tracked Submissions</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Report Hotspots Today */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                  Report Hotspots Today
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Main Line Active
                </span>
              </div>

              {/* Map Illustration Box */}
              <div className="h-32 rounded-lg bg-[#e5eff8] border border-blue-100 relative overflow-hidden flex items-center justify-center p-3">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 to-slate-200/50"></div>
                <div className="relative text-center">
                  <Map className="w-6 h-6 text-blue-600 mx-auto mb-1 opacity-75" />
                  <span className="text-xs font-bold text-slate-700 block">
                    Colombo ↔ Rambukkana ↔ Kadugannawa
                  </span>
                  <span className="text-[10px] text-slate-500">Hill Country Railway Gradient</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-snug">
                High incident volume concentrated around the Kadugannawa – Rambukkana mountain pass due to monsoon track clearing.
              </p>
            </div>

            {/* Railway Urgent Helpline */}
            <div className="bg-[#0B1A2C] text-white rounded-xl p-5 shadow-sm space-y-3 border border-slate-800">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Railway Urgent Helpline
                </h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                In case of severe derailment danger, fallen trees across tracks, medical distress, or safety security incidents, contact emergency officers immediately.
              </p>

              <div className="bg-[#12253c] p-3 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Central Center Hotline</span>
                  <span className="text-lg font-black text-white">1971</span>
                </div>
                <a
                  href="tel:1971"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Dial Toll-Free</span>
                </a>
              </div>

              <div className="bg-[#12253c] p-3 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Railway Security Police</span>
                  <span className="text-xs font-bold text-white">011-2434215</span>
                </div>
                <a
                  href="tel:0112434215"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Direct</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Community Verification Strip Banner */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-gray-900">Community Verification System</h5>
              <p className="text-xs text-gray-500">
                Over 1,200 verified daily Sri Lankan rail commuters maintain real-time transit awareness.
              </p>
            </div>
          </div>

          <Link
            to="/my-reports"
            className="text-xs font-bold text-[#0B1A2C] hover:text-blue-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg border border-slate-200 shrink-0 transition-colors"
          >
            View System Transparency Log
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;
