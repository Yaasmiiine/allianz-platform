// src/components/Services.jsx
import "../styles/services.css";

function Services() {
  return (
    <section className="services">
      <h2>Our Services</h2>
      <div className="service-cards">
        <div className="card">
          <h3>Life Insurance</h3>
          <p>Protect your loved ones with comprehensive life insurance plans.</p>
        </div>
        <div className="card">
          <h3>Health Insurance</h3>
          <p>Access the best healthcare services with our tailored plans.</p>
        </div>
        <div className="card">
          <h3>Vehicle Insurance</h3>
          <p>Cover your car with Allianz’s reliable and flexible policies.</p>
        </div>
      </div>
    </section>
  );
}

export default Services;