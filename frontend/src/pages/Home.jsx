import { useNavigate } from "react-router-dom";
import "../styles/hero.css";
import heroImg from "../assets/images/main.png";
import carImg from "../assets/images/car.png";
import healthImg from "../assets/images/health.png";
import travelImg from "../assets/images/travel.png";
import whyImg from "../assets/images/why.png";
import Chatbot from "../components/Chatbot";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Protect What Matters Most with Allianz</h1>
            <p>
              A modern insurance platform to manage claims, payments, documents,
              and notifications with simplicity and security.
            </p>

            <div className="hero-buttons">
              <button onClick={() => navigate("/login")}>Get Started</button>
              <button
                className="secondary-btn"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h2>24/7</h2>
          <p>Support availability</p>
        </div>
        <div className="stat-card">
          <h2>100%</h2>
          <p>Secure online services</p>
        </div>
        <div className="stat-card">
          <h2>Fast</h2>
          <p>Claims processing workflow</p>
        </div>
      </section>

      <section className="services-section">
        <h2>Our Insurance Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <img
              src={carImg}
              alt="Car insurance"
            />
            <h3>Auto Insurance</h3>
            <p>Protect your vehicle with reliable coverage and rapid claim support.</p>
          </div>

          <div className="service-card">
            <img
              src={healthImg}
              alt="Health insurance"
            />
            <h3>Health Insurance</h3>
            <p>Access secure health protection plans designed for your needs.</p>
          </div>

          <div className="service-card">
            <img
              src={travelImg}
              alt="Travel insurance"
            />
            <h3>Travel Insurance</h3>
            <p>Travel confidently with coverage for delays, incidents, and emergencies.</p>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-text">
          <h2>Why Choose Allianz?</h2>
          <p>
            Our platform combines trust, speed, and technology to deliver a
            smooth digital insurance experience. From submitting a claim to
            tracking payments and receiving notifications, everything is
            designed to be simple and efficient.
          </p>
          <ul>
            <li>Secure client dashboard</li>
            <li>Easy claim declaration and tracking</li>
            <li>Integrated payment process</li>
            <li>Real-time notifications and support</li>
          </ul>
        </div>

        <div className="why-image">
          <img
            src={whyImg}
            alt="Professional insurance service"
          />
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to manage your insurance online?</h2>
        <p>Join Allianz and experience a modern, secure, and responsive platform.</p>
        <button onClick={() => navigate("/register")}>Join Now</button>
      </section>

      <Chatbot />
    </div>
  );
}

export default Home;