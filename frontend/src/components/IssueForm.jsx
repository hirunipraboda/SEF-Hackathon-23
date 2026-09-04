import React, { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { Send } from 'lucide-react';

const ISSUE_TYPE_OPTIONS = [
  { value: 'TRAIN_DELAY', label: 'Train Delay' },
  { value: 'OVERCROWDING', label: 'Severe Overcrowding' },
  { value: 'UNSAFE_CONDITION', label: 'Unsafe Condition' },
  { value: 'CLEANLINESS', label: 'Cleanliness Problem' },
  { value: 'BROKEN_FACILITY', label: 'Broken Facility' },
  { value: 'STAFF_SERVICE', label: 'Staff / Service Issue' },
  { value: 'OTHER', label: 'Other Concern' },
];

const SEVERITY_OPTIONS = [
  { value: 'LOW', label: 'Low - Minor inconvenience' },
  { value: 'MEDIUM', label: 'Medium - Notable delay / disruption' },
  { value: 'HIGH', label: 'High - Urgent / safety hazard' },
];

const IssueForm = ({ trains = [], stations = [], onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    issueType: 'TRAIN_DELAY',
    severity: 'MEDIUM',
    trainId: '',
    stationId: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.issueType) errs.issueType = 'Issue type is required';
    if (!formData.description || formData.description.trim().length < 5) {
      errs.description = 'Description must be at least 5 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Issue Category"
          value={formData.issueType}
          onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
          options={ISSUE_TYPE_OPTIONS}
          error={errors.issueType}
          required
        />
        <Select
          label="Severity Level"
          value={formData.severity}
          onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
          options={SEVERITY_OPTIONS}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Related Train (Optional)"
          placeholder="Select train if applicable"
          value={formData.trainId}
          onChange={(e) => setFormData({ ...formData, trainId: e.target.value })}
          options={trains.map((t) => ({ value: t._id, label: `${t.trainName} (#${t.trainNumber})` }))}
        />
        <Select
          label="Related Station (Optional)"
          placeholder="Select station if applicable"
          value={formData.stationId}
          onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
          options={stations.map((s) => ({ value: s._id, label: `${s.name} (${s.code})` }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Please describe the issue in detail, including time, coach number, or platform if known..."
          required
          className={`w-full px-3 py-2 border rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-400 focus:ring-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}</span>
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;
