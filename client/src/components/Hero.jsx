import { useState, useEffect } from 'react';
import resumeData from '../data/resumeData';
import ParticleImage from './ParticleImage';

export default function Hero() {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = `hi, `;
  const nameText = resumeData.personal.firstName;
  const endText = ` here.`;
  const [phase, setPhase] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const texts = [fullText, nameText, endText];
    const currentText = texts[phase];

    if (phase > 2) {
      const blinkInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);
      return () => clearInterval(blinkInterval);
    }

    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 80 + Math.random() * 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPhase(prev => prev + 1);
        setCharIndex(0);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [phase, charIndex]);

  const getDisplayText = () => {
    let result = '';
    const texts = [fullText, nameText, endText];
    for (let p = 0; p < Math.min(phase, 3); p++) {
      result += texts[p];
    }
    if (phase <= 2) {
      const currentText = texts[phase];
      result += currentText.substring(0, charIndex);
    }
    return result;
  };

  const displayText = getDisplayText();
  const nameStart = fullText.length;
  const nameEnd = nameStart + nameText.length;

  const beforeName = displayText.substring(0, nameStart);
  const nameShown = displayText.substring(nameStart, nameEnd);
  const afterName = displayText.substring(nameEnd);

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-particle-portrait" aria-hidden="true">
          <ParticleImage
            src="/particle-portrait.png"
            alt={`${resumeData.personal.name} particle portrait`}
            dotSpacing={4}
            minDotSize={1.0}
            maxDotSize={2.4}
            crossSize={4}
            crossThreshold={0.7}
            scatter={220}
            gatherDuration={2000}
            stagger={550}
            pointerRepel={45}
            repelRadius={110}
            idleDrift={0.35}
            glow
          />
        </div>

        <div className="hero-content">
          <h1 className="hero-greeting">
            {beforeName}
            <strong>{nameShown}</strong>
            {afterName}
            <span
              className="typewriter-cursor"
              style={{
                color: '#64ffda',
                fontWeight: 300,
                fontSize: '3.5rem',
                marginLeft: '2px',
                animation: 'cursorBlink 1s step-end infinite',
              }}
            >|</span>
          </h1>

          <p className="hero-description">
            {resumeData.personal.tagline}
          </p>

          <div className="hero-cta">
            <a href="#contact" className="btn" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Say hi!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
