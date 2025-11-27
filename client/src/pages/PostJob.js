import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    skills: ''
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/jobs', {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Job posted successfully!');
      setTimeout(() => navigate('/jobs'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to post job');
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Post a New Job</h2>
        {message && <div className={message.includes('success') ? 'success' : 'error'}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Budget ($)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting Job...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
