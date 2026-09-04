import React, { useState } from 'react';
import Select from './Select';
import Button from './Button';
import RatingStars from './RatingStars';
import { MessageSquareQuote } from 'lucide-react';

const FeedbackForm = ({ trains = [], onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    trainId: '',
    rating: 5,
    punctualityRating: 5,
    cleanlinessRating: 4,
    comfortRating: 4,
    staffServiceRating: 5,
    comment: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.trainId) {
      setError('Please select a train to review');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Select
        label="Select Train"
        placeholder="Choose the train you traveled on"
        value={formData.trainId}
        onChange={(e) => {
          setFormData({ ...formData, trainId: e.target.value });
          if (error) setError('');
        }}
        options={trains.map((t) => ({ value: t._id, label: `${t.trainName} (#${t.trainNumber})` }))}
        error={error}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
          <RatingStars
            value={formData.rating}
            onChange={(r) => setFormData({ ...formData, rating: r })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Punctuality:</span>
          <RatingStars
            value={formData.punctualityRating}
            onChange={(r) => setFormData({ ...formData, punctualityRating: r })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Cleanliness:</span>
          <RatingStars
            value={formData.cleanlinessRating}
            onChange={(r) => setFormData({ ...formData, cleanlinessRating: r })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Comfort:</span>
          <RatingStars
            value={formData.comfortRating}
            onChange={(r) => setFormData({ ...formData, comfortRating: r })}
          />
        </div>
        <div className="flex items-center justify-between md:col-span-2">
          <span className="text-sm font-medium text-gray-700">Staff Service:</span>
          <RatingStars
            value={formData.staffServiceRating}
            onChange={(r) => setFormData({ ...formData, staffServiceRating: r })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review Comments (Optional)
        </label>
        <textarea
          rows={3}
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Share your travel experience, highlights, or suggestions for improvement..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting Review...' : 'Submit Feedback'}</span>
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
