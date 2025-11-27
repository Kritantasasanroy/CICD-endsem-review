import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find the perfect freelance services for your business</h1>
          <p className="hero-subtitle">
            Connect with talented freelancers or find your next opportunity. 
            Join thousands of professionals building their careers.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero btn-primary-hero">Get Started</Link>
            <Link to="/login" className="btn-hero btn-secondary-hero">Sign In</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <div className="illustration-circle"></div>
            <div className="illustration-dots"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why choose our platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Quality Projects</h3>
            <p>Access to high-quality projects from verified employers worldwide</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Hiring</h3>
            <p>Connect with freelancers quickly and start your project within hours</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Safe and secure payment system with milestone-based releases</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Top Talent</h3>
            <p>Work with skilled professionals across various industries</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How it works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up as a freelancer or employer in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Post or Browse Jobs</h3>
            <p>Employers post jobs, freelancers browse opportunities</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Submit Proposals</h3>
            <p>Freelancers submit proposals with their best offer</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Start Working</h3>
            <p>Get hired and start working on exciting projects</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to get started?</h2>
          <p>Join our community of freelancers and employers today</p>
          <Link to="/register" className="btn-hero btn-primary-hero">Create Free Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Freelancer Marketplace</h4>
            <p>Connecting talent with opportunity</p>
          </div>
          <div className="footer-section">
            <h4>For Freelancers</h4>
            <ul>
              <li>Find Work</li>
              <li>How It Works</li>
              <li>Success Stories</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Employers</h4>
            <ul>
              <li>Post a Job</li>
              <li>Find Talent</li>
              <li>Enterprise</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Freelancer Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
