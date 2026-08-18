import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import resumeData from '../data/resumeData';

export default function Experience() {
  const [activeTab, setActiveTab] = useState(0);
  const [sectionRef, isVisible] = useScrollReveal();

  const activeExp = resumeData.experience[activeTab];

  return (
    <section className="experience" id="experience">
      <div
        ref={sectionRef}
        className={`reveal ${isVisible ? 'visible' : ''}`}
      >
        <h2 className="section-header">
          <span className="slash">/</span> experience
        </h2>
      </div>

      <div
        className={`experience-container reveal ${isVisible ? 'visible' : ''}`}
        style={{ transitionDelay: '0.2s' }}
      >
        {/* Tabs */}
        <div className="experience-tabs">
          {resumeData.experience.map((exp, i) => (
            <button
              key={exp.id}
              className={`experience-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {exp.company}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="experience-panel" key={activeTab}>
          <h3 className="experience-role">
            {activeExp.role}{' '}
            <span className="company">@ {activeExp.companyHighlight}</span>
          </h3>
          <p className="experience-period">{activeExp.period}</p>
          <ul className="experience-bullets">
            {activeExp.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
