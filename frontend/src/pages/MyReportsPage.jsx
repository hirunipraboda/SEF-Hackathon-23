import React, { useState, useEffect, useCallback } from 'react';
import { issueService } from '../services/issueService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { AlertCircle, Filter, Calendar, MapPin, Train, RefreshCw, Trash2 } from 'lucide-react';

const MyReportsPage = () => {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to withdraw and delete this incident report from the railway audit log?')) {
      return;
    }
    setDeleting(true);
    try {
      await issueService.deleteIssue(issueId);
      setIssues((prev) => prev.filter((item) => item._id !== issueId && item.reportId !== issueId));
      setSelectedIssue(null);
    } catch (err) {
      alert(`Failed to delete report: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await issueService.getAllIssues(statusFilter ? { status: statusFilter } : {});
      setIssues(data);
    } catch (err) {
      setError(err.message || 'Unable to load incident reports');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleStatusChange = async (issueId, newStatus) => {
    setStatusUpdating(true);
    try {
      const updated = await issueService.updateIssueStatus(issueId, newStatus);
      setIssues((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      if (selectedIssue && selectedIssue._id === updated._id) {
        setSelectedIssue(updated);
      }
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const map = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-amber-100 text-amber-800',
      HIGH: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${map[severity] || 'bg-gray-100 text-gray-800'}`}>
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const map = {
      UNDER_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
      IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
      RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return (
      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${map[status] || 'bg-gray-100 text-gray-800'}`}>
        {(status || '').replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Reports & Status</h1>
          <p className="text-sm text-gray-500">Track and monitor remediation progress across reported railway issues</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <button
            onClick={fetchIssues}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-md border border-gray-300 hover:bg-gray-50"
            title="Refresh reports"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchIssues} />}

      {loading && <LoadingSpinner text="Retrieving railway incident reports..." />}

      {!loading && !error && (
        <>
          {issues.length === 0 ? (
            <EmptyState
              icon={AlertCircle}
              title="No incident reports logged"
              message={
                statusFilter
                  ? `No reports currently match the status filter '${statusFilter}'.`
                  : 'There are currently no passenger incident reports on file.'
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues.map((issue) => (
                <div
                  key={issue._id || issue.reportId}
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {issue.reportId}
                        </span>
                        {getSeverityBadge(issue.severity)}
                      </div>
                      {getStatusBadge(issue.status)}
                    </div>

                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {(issue.issueType || '').replace('_', ' ')}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{issue.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {issue.trainId && (
                        <span className="flex items-center gap-1">
                          <Train className="w-3 h-3 text-gray-400" />
                          {issue.trainId.trainName || 'Train'}
                        </span>
                      )}
                      {issue.stationId && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {issue.stationId.name || 'Station'}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedIssue && (
        <Modal
          isOpen={Boolean(selectedIssue)}
          onClose={() => setSelectedIssue(null)}
          title={`Report Details - ${selectedIssue.reportId}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Change Status:</span>
                <select
                  disabled={statusUpdating}
                  value={selectedIssue.status}
                  onChange={(e) => handleStatusChange(selectedIssue._id, e.target.value)}
                  className="text-xs border rounded p-1 bg-white font-medium"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteIssue(selectedIssue._id)}
                  disabled={deleting}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {deleting ? 'Withdrawing...' : 'Withdraw Report'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedIssue(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-500 block">Category</span>
                <span className="font-semibold text-gray-900">
                  {(selectedIssue.issueType || '').replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Severity</span>
                {getSeverityBadge(selectedIssue.severity)}
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Current Status</span>
                {getStatusBadge(selectedIssue.status)}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 block font-medium mb-1">Issue Description</span>
              <p className="bg-gray-50 p-3 rounded text-gray-700 text-xs leading-relaxed border border-gray-100">
                {selectedIssue.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div>
                <span className="text-gray-400 block">Logged Timestamp:</span>
                <span className="font-medium">{new Date(selectedIssue.createdAt).toLocaleString()}</span>
              </div>
              {selectedIssue.trainId && (
                <div>
                  <span className="text-gray-400 block">Reported Train:</span>
                  <span className="font-medium">{selectedIssue.trainId.trainName}</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyReportsPage;
