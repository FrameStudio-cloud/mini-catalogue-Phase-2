import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import shop from '../config/shop'

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)
  const slides = shop.slides

  // Auto advance slides
  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentSlide(prev =>
      prev === slides.length - 1 ? 0 : prev + 1
    )
  }, [slides.length])

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide(prev =>
      prev === 0 ? slides.length - 1 : prev - 1
    )
  }

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  // Auto rotate every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const slide = slides[currentSlide]

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  }

  return (
    <section
      id="home"
      className="relative h-screen overflow-hidden bg-primary"
    >

      {/* Slides */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
            <div className="max-w-4xl mx-auto">

              {/* Tag */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-sm font-medium tracking-widest uppercase text-accent"
              >
                {slide.tag}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
              >
                {slide.title}
                <span className="text-accent"> {slide.titleAccent}</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-2xl mx-auto mb-10 text-lg text-gray-300 md:text-xl"
              >
                {slide.description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col justify-center gap-4 sm:flex-row"
              >
                <a
                  href={slide.buttonLink}
                  className="px-8 py-4 text-lg font-medium text-white transition-colors rounded-full bg-accent hover:bg-red-600"
                >
                  {slide.buttonText}
                </a>
                <a
                  href={`https://wa.me/${shop.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white transition-colors border border-white rounded-full hover:border-accent hover:text-accent"
                >
                  <FaWhatsapp size={20} />
                  Order on WhatsApp
                </a>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute z-20 p-3 text-white transition-all -translate-y-1/2 bg-white rounded-full left-4 top-1/2 bg-opacity-20 hover:bg-opacity-40"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute z-20 p-3 text-white transition-all -translate-y-1/2 bg-white rounded-full right-4 top-1/2 bg-opacity-20 hover:bg-opacity-40"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute z-20 flex items-center gap-3 -translate-x-1/2 bottom-8 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full
              ${currentSlide === index
                ? 'w-8 h-2 bg-accent'
                : 'w-2 h-2 bg-white bg-opacity-50 hover:bg-opacity-100'
              }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute z-20 text-sm font-medium text-white bottom-8 right-6 opacity-70">
        {currentSlide + 1} / {slides.length}
      </div>

    </section>
  )
}

export default Hero
