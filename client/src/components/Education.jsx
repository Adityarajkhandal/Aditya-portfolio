import useScrollReveal from '../hooks/useScrollReveal';
import resumeData from '../data/resumeData';

export default function Education() {
  const [sectionRef, isVisible] = useScrollReveal();

  return (
    <div
      ref={sectionRef}
      className={`reveal ${isVisible ? 'visible' : ''}`}
      style={{ marginTop: '30px' }}
    >
      <h3 className="section-header" style={{ fontSize: '1.5rem' }}>
        <span className="slash">/</span> education
      </h3>

      <div className="education-cards">
        {resumeData.education.map((edu, i) => (
          <div
            key={i}
            className={`education-card reveal ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
          >
            <h4 className="education-card-degree">{edu.degree}</h4>
            <p className="education-card-school">{edu.institution}</p>
            <p className="education-card-period">{edu.period}</p>
            <p className="education-card-details">{edu.details}</p>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <h3
        className="section-header"
        style={{ fontSize: '1.5rem', marginTop: '50px' }}
      >
        <span className="slash">/</span> certifications
      </h3>

      <div className="certifications-list">
        {resumeData.certifications.map((cert, i) => (
          <div
            key={i}
            className={`certification-item reveal ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
          >
            <span className="certification-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </span>
            <span className="certification-text">{cert}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
