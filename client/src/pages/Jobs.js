import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Jobs({ user }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposal, setProposal] = useState({ coverLetter: '', proposedBudget: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/proposals', {
        job: selectedJob._id,
        ...proposal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Proposal submitted successfully!');
      setSelectedJob(null);
      setProposal({ coverLetter: '', proposedBudget: '' });
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Job deleted successfully!');
      fetchJobs();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete job');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Available Jobs</h1>
      {message && <div className={message.includes('success') ? 'success' : 'error'}>{message}</div>}
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card">
          <p>{user.role === 'worker_seeker' ? 'You haven\'t posted any jobs yet.' : 'No jobs available at the moment.'}</p>
        </div>
      ) : (
        jobs.map(job => (
        <div key={job._id} className="card">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p><strong>Budget:</strong> ${job.budget}</p>
          <p><strong>Posted by:</strong> {job.postedBy?.name}</p>
          <div className="skills">
            {job.skills?.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
          <span className={`badge badge-${job.status}`}>{job.status}</span>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {user.role === 'job_seeker' && job.status === 'open' && (
              <>
                <button className="btn btn-primary" onClick={() => setSelectedJob(job)}>
                  Submit Proposal
                </button>
                <Link 
                  to={`/messages?job=${job._id}&user=${job.postedBy._id}`} 
                  className="btn btn-primary"
                >
                  💬 Message Employer
                </Link>
              </>
            )}
            {user.role === 'worker_seeker' && job.postedBy?._id === user.id && (
              <button className="btn btn-danger" onClick={() => handleDeleteJob(job._id)}>
                Delete Job
              </button>
            )}
          </div>
        </div>
        ))
      )}

      {selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h3>Submit Proposal for: {selectedJob.title}</h3>
            <form onSubmit={handleSubmitProposal}>
              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  value={proposal.coverLetter}
                  onChange={(e) => setProposal({ ...proposal, coverLetter: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Proposed Budget ($)</label>
                <input
                  type="number"
                  value={proposal.proposedBudget}
                  onChange={(e) => setProposal({ ...proposal, proposedBudget: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Proposal'}
              </button>
              <button type="button" className="btn btn-danger" onClick={() => setSelectedJob(null)} disabled={submitting}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
