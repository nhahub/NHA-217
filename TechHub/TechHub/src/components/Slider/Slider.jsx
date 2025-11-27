import { useState, useEffect } from 'react';
import './Slider.css';

const Slider = ({ slides, autoPlay = true, interval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ background: slide.background }}
          >
            <div className="slide-image-wrapper">
              {slide.image && (
                <img 
                  src={slide.image} 
                  alt={slide.text || `Slide ${index + 1}`}
                  className="slide-image"
                />
              )}
            </div>
            {slide.text && (
              <div className="slide-text-overlay">
                <h1 className="slide-text">{slide.text}</h1>
              </div>
            )}
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button 
              className="slider-arrow slider-arrow-left" 
              onClick={goToPrevious}
              aria-label="Previous slide"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="slider-arrow slider-arrow-right" 
              onClick={goToNext}
              aria-label="Next slide"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
