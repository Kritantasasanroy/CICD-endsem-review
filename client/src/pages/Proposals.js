import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Proposals({ user }) {
  const [proposals, setProposals] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/proposals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (proposalId, status) => {
    setUpdating(proposalId);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/proposals/${proposalId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Proposal ${status} successfully!`);
      fetchProposals();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update proposal');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteProposal = async (proposalId) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) return;
    setUpdating(proposalId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/proposals/${proposalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Proposal deleted successfully!');
      fetchProposals();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete proposal');
      setUpdating(null);
    }
  };

  return (
    <div className="container">
      <h1>Proposals</h1>
      {message && <div className={message.includes('success') ? 'success' : 'error'}>{message}</div>}
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="card">
          <p>{user.role === 'worker_seeker' ? 'No proposals received yet.' : 'You haven\'t submitted any proposals yet.'}</p>
        </div>
      ) : (
        proposals.map(proposal => (
          <div key={proposal._id} className="card">
            <h3>{proposal.job?.title}</h3>
            <p><strong>Freelancer:</strong> {proposal.freelancer?.name}</p>
            <p><strong>Cover Letter:</strong> {proposal.coverLetter}</p>
            <p><strong>Proposed Budget:</strong> ${proposal.proposedBudget}</p>
            <span className={`badge badge-${proposal.status}`}>{proposal.status}</span>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {user.role === 'worker_seeker' && proposal.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleUpdateStatus(proposal._id, 'accepted')}
                    disabled={updating === proposal._id}
                  >
                    {updating === proposal._id ? 'Processing...' : 'Accept'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleUpdateStatus(proposal._id, 'rejected')}
                    disabled={updating === proposal._id}
                  >
                    {updating === proposal._id ? 'Processing...' : 'Reject'}
                  </button>
                  <Link 
                    to={`/messages?job=${proposal.job._id}&user=${proposal.freelancer._id}`}
                    className="btn btn-primary"
                  >
                    💬 Message Freelancer
                  </Link>
                </>
              )}
              {user.role === 'job_seeker' && (
                <>
                  {proposal.status === 'pending' && (
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDeleteProposal(proposal._id)}
                      disabled={updating === proposal._id}
                    >
                      {updating === proposal._id ? 'Deleting...' : 'Delete Proposal'}
                    </button>
                  )}
                  <Link 
                    to={`/messages?job=${proposal.job._id}&user=${proposal.job.postedBy}`}
                    className="btn btn-primary"
                  >
                    💬 Message Employer
                  </Link>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Proposals;
