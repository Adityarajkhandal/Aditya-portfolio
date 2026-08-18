import { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import resumeData from '../data/resumeData';

export default function Projects() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sectionRef, isVisible] = useScrollReveal();

  const featuredProjects = resumeData.projects.filter((p) => p.featured);
  const totalSlides = featuredProjects.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="projects" id="projects">
      <div
        ref={sectionRef}
        className={`projects-header-row reveal ${isVisible ? 'visible' : ''}`}
      >
        <h2 className="section-header">
          <span className="slash">/</span> projects
        </h2>
        <a href={resumeData.personal.github} className="view-all-link" target="_blank" rel="noopener noreferrer">
          View all projects <span>→</span>
        </a>
      </div>

      {/* Featured Carousel */}
      <div
        className={`carousel-container reveal ${isVisible ? 'visible' : ''}`}
        style={{ transitionDelay: '0.2s' }}
      >
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredProjects.map((project, i) => (
              <div className="carousel-slide" key={i}>
                <h3 className="carousel-slide-title">{project.title}</h3>
                <h4 className="carousel-slide-title-accent">{project.title}</h4>
                <p className="carousel-slide-desc">{project.longDescription}</p>
                <div className="carousel-slide-tags">
                  {project.tech.map((t, j) => (
                    <span key={j}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={prevSlide}
          aria-label="Previous project"
        >
          ‹
        </button>
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={nextSlide}
          aria-label="Next project"
        >
          ›
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          {featuredProjects.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div className="project-cards">
        {resumeData.projects.map((project, i) => (
          <div
            key={i}
            className={`project-card reveal ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${0.3 + i * 0.15}s` }}
          >
            <div className="project-card-header">
              <span className="project-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <div className="project-card-links">
                <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                {project.live && project.live !== '#' && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <h3 className="project-card-title">{project.title}</h3>
            <p className="project-card-desc">{project.description}</p>

            <div className="project-card-tech">
              {project.tech.map((t, j) => (
                <span key={j}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
