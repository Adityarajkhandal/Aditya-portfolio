import useScrollReveal from '../hooks/useScrollReveal';
import resumeData from '../data/resumeData';

export default function About() {
  const [sectionRef, isVisible] = useScrollReveal();
  const [photoRef, isPhotoVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <section className="about" id="about">
      <div
        ref={sectionRef}
        className={`reveal ${isVisible ? 'visible' : ''}`}
      >
        <h2 className="section-header">
          <span className="slash">/</span> about me
        </h2>
      </div>

      <div className="about-container">
        <div
          className={`about-text reveal ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.2s' }}
        >
          <p>
            I am currently pursuing my{' '}
            <span className="bold">Master of Computer Applications</span> at{' '}
            <span className="highlight">BIT Mesra, Ranchi</span>. Previously, I
            interned as an <span className="bold">AI Automation Intern</span> at{' '}
            <span className="highlight">Appsavio</span>, where I integrated
            advanced AI models into Salesforce CRM and built intelligent agents.
          </p>

          <p>
            I'm passionate about building scalable solutions at the intersection
            of AI and software engineering. I love turning complex problems into
            elegant, user-friendly applications.
          </p>

          <p className="about-skills-intro">
            Here are some technologies I have been working with:
          </p>

          <ul className="about-skills">
            {resumeData.featuredSkills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>

          <p>
            {resumeData.personal.hobbies}
          </p>
        </div>

        <div
          ref={photoRef}
          className={`about-photo reveal ${isPhotoVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <div className="about-photo-wrapper">
            <img
              src="/about-photo.jpg"
              alt={`${resumeData.personal.name} photo`}
              onError={(e) => {
                // Fallback to a generated avatar
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(resumeData.personal.name)}&size=280&background=112240&color=64ffda&font-size=0.4&bold=true`;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
