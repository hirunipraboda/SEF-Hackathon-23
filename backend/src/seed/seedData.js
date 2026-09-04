import { TRAIN_TYPES, TRAIN_STATUS, TRAIN_CLASSES, PASSENGER_TYPES, ISSUE_TYPES, ISSUE_SEVERITY, ISSUE_STATUS } from '../utils/constants.js';

export const sampleStations = [
  { name: 'Colombo Fort', city: 'Colombo', province: 'Western', code: 'FOT', latitude: 6.9344, longitude: 79.8504, active: true },
  { name: 'Maradana', city: 'Colombo', province: 'Western', code: 'MDA', latitude: 6.9271, longitude: 79.8667, active: true },
  { name: 'Ragama', city: 'Ragama', province: 'Western', code: 'RGM', latitude: 7.0278, longitude: 79.9234, active: true },
  { name: 'Gampaha', city: 'Gampaha', province: 'Western', code: 'GPH', latitude: 7.0917, longitude: 79.9997, active: true },
  { name: 'Polgahawela', city: 'Polgahawela', province: 'North Western', code: 'PLG', latitude: 7.3333, longitude: 80.3000, active: true },
  { name: 'Kandy', city: 'Kandy', province: 'Central', code: 'KDY', latitude: 7.2906, longitude: 80.6337, active: true },
  { name: 'Galle', city: 'Galle', province: 'Southern', code: 'GLE', latitude: 6.0367, longitude: 80.2170, active: true },
  { name: 'Matara', city: 'Matara', province: 'Southern', code: 'MTR', latitude: 5.9549, longitude: 80.5550, active: true },
  { name: 'Jaffna', city: 'Jaffna', province: 'Northern', code: 'JAF', latitude: 9.6615, longitude: 80.0255, active: true },
  { name: 'Anuradhapura', city: 'Anuradhapura', province: 'North Central', code: 'ANP', latitude: 8.3114, longitude: 80.4037, active: true },
  { name: 'Negombo', city: 'Negombo', province: 'Western', code: 'NGB', latitude: 7.2008, longitude: 79.8737, active: true },
];

export const sampleTrains = [
  { trainNumber: '1005', trainName: 'Podi Menike', trainType: 'Express', status: TRAIN_STATUS.ON_TIME, active: true },
  { trainNumber: '1015', trainName: 'Udarata Menike', trainType: 'Express', status: TRAIN_STATUS.ON_TIME, active: true },
  { trainNumber: '4077', trainName: 'Yal Devi', trainType: 'Intercity', status: TRAIN_STATUS.ON_TIME, active: true },
  { trainNumber: '8056', trainName: 'Ruhunu Kumari', trainType: 'Express', status: TRAIN_STATUS.DELAYED, active: true },
  { trainNumber: '1041', trainName: 'Senkadagala Menike', trainType: 'Intercity', status: TRAIN_STATUS.ON_TIME, active: true },
  { trainNumber: '8050', trainName: 'Galu Kumari', trainType: 'Normal', status: TRAIN_STATUS.ON_TIME, active: true },
  { trainNumber: '4003', trainName: 'Uttara Devi', trainType: 'Intercity', status: TRAIN_STATUS.ON_TIME, active: true },
];

export const sampleIssuesData = [
  {
    reportId: 'TT-1001',
    issueType: ISSUE_TYPES.TRAIN_DELAY,
    description: 'Podi Menike delayed by 25 minutes due to signal issue near Polgahawela.',
    severity: ISSUE_SEVERITY.MEDIUM,
    status: ISSUE_STATUS.IN_PROGRESS,
  },
  {
    reportId: 'TT-1002',
    issueType: ISSUE_TYPES.OVERCROWDING,
    description: 'Heavy overcrowding in second class compartments on Ruhunu Kumari during evening commute.',
    severity: ISSUE_SEVERITY.HIGH,
    status: ISSUE_STATUS.UNDER_REVIEW,
  },
  {
    reportId: 'TT-1003',
    issueType: ISSUE_TYPES.CLEANLINESS,
    description: 'Restrooms in coach 3 need sanitation and water supply refill.',
    severity: ISSUE_SEVERITY.LOW,
    status: ISSUE_STATUS.RESOLVED,
  },
  {
    reportId: 'TT-1004',
    issueType: ISSUE_TYPES.BROKEN_FACILITY,
    description: 'Platform digital announcement speaker distorted at Maradana platform 2.',
    severity: ISSUE_SEVERITY.LOW,
    status: ISSUE_STATUS.UNDER_REVIEW,
  },
];

export const sampleFeedbackData = [
  {
    rating: 5,
    punctualityRating: 5,
    cleanlinessRating: 4,
    comfortRating: 5,
    staffServiceRating: 5,
    comment: 'Exceptional scenic journey to Kandy! The train arrived right on schedule.',
  },
  {
    rating: 4,
    punctualityRating: 4,
    cleanlinessRating: 4,
    comfortRating: 4,
    staffServiceRating: 4,
    comment: 'Very comfortable journey on Yal Devi to Jaffna. AC was working properly.',
  },
  {
    rating: 3,
    punctualityRating: 2,
    cleanlinessRating: 3,
    comfortRating: 3,
    staffServiceRating: 4,
    comment: 'Delayed departure from Fort station, but staff was courteous and helpful.',
  },
  {
    rating: 4,
    punctualityRating: 4,
    cleanlinessRating: 3,
    comfortRating: 4,
    staffServiceRating: 5,
    comment: 'Scenic coastal views on Ruhunu Kumari. Could improve cleanliness of second class.',
  },
];
