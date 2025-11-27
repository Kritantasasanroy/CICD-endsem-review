import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p className="dashboard-subtitle">
          {user.role === 'job_seeker' 
            ? 'Ready to find your next opportunity?' 
            : 'Manage your jobs and find the perfect talent'}
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <h3>Active Jobs</h3>
            <p className="stat-number">-</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Proposals</h3>
            <p className="stat-number">-</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>Rating</h3>
            <p className="stat-number">5.0</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3>Quick Actions</h3>
        <p style={{ marginBottom: '1.5rem', color: 'var(--gray)' }}>
          {user.role === 'job_seeker' 
            ? 'Browse available jobs and submit proposals to get hired!'
            : 'Post jobs and review proposals from talented freelancers!'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/jobs" className="btn btn-primary">
            {user.role === 'job_seeker' ? '🔍 Browse Jobs' : '📋 View My Jobs'}
          </Link>
          {user.role === 'worker_seeker' && (
            <Link to="/post-job" className="btn btn-success">➕ Post a New Job</Link>
          )}
          <Link to="/proposals" className="btn btn-primary">
            {user.role === 'job_seeker' ? '📄 My Proposals' : '📬 Review Proposals'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
