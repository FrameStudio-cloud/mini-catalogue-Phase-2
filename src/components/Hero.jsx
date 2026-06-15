import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useShop } from '../context/ShopContext'

function Hero() {
  const { shop } = useShop()
  const slides = shop.slides || []

  const [currentSlideState, setCurrentSlideState] = useState(0)
  const [directionState, setDirectionState] = useState(1)
  const timerRef = useRef(null)

  const goToSlide = useCallback((index) => {
    setDirectionState(index > currentSlideState ? 1 : -1)
    setCurrentSlideState(index)
  }, [currentSlideState])

  const nextSlide = useCallback(() => {
    setDirectionState(1)
    setCurrentSlideState(prev => prev === slides.length - 1 ? 0 : prev + 1)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setDirectionState(-1)
    setCurrentSlideState(prev => prev === 0 ? slides.length - 1 : prev - 1)
  }, [slides.length])

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(nextSlide, 4000)
  }

  function handleNext() { resetTimer(); nextSlide() }
  function handlePrev() { resetTimer(); prevSlide() }
  function handleGoTo(index) { resetTimer(); goToSlide(index) }

  useEffect(() => {
    if (slides.length < 2) return
    timerRef.current = setInterval(nextSlide, 4000)
    return () => clearInterval(timerRef.current)
  }, [nextSlide, slides.length])

  if (!slides.length) return null

  const slide = slides[currentSlideState]

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
      <AnimatePresence custom={directionState} mode="wait">
        <motion.div
          key={currentSlideState}
          custom={directionState}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            role="img"
            aria-label={slide.title}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {slide.tag && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 text-sm font-medium tracking-widest uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  {slide.tag}
                </motion.p>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
              >
                {slide.title}
                {slide.titleAccent && (
                  <span style={{ color: 'var(--accent)' }}> {slide.titleAccent}</span>
                )}
              </motion.h1>
              {slide.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-2xl mx-auto mb-10 text-lg text-gray-300 md:text-xl"
                >
                  {slide.description}
                </motion.p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col justify-center gap-4 sm:flex-row"
              >
                <a
                  href={slide.buttonLink || '#catalogue'}
                  className="px-8 py-4 text-lg font-medium text-white transition-colors rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {slide.buttonText || 'Shop Now'}
                </a>
                <a
                  href={`https://wa.me/${shop.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white transition-colors border border-white rounded-full hover:border-accent"
                >
                  <FaWhatsapp size={20} />
                  Order on WhatsApp
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute z-20 p-3 text-white transition-all -translate-y-1/2 bg-white/20 rounded-full left-4 top-1/2 hover:bg-white/40"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute z-20 p-3 text-white transition-all -translate-y-1/2 bg-white/20 rounded-full right-4 top-1/2 hover:bg-white/40"
          >
            <FiChevronRight size={24} />
          </button>
          <div className="absolute z-20 flex items-center gap-3 -translate-x-1/2 bottom-8 left-1/2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleGoTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlideState === index
                    ? 'w-8 h-2'
                    : 'w-2 h-2 bg-white/50 hover:bg-white'
                }`}
                style={currentSlideState === index ? { backgroundColor: 'var(--accent)' } : {}}
              />
            ))}
          </div>
          <div className="absolute z-20 text-sm font-medium text-white bottom-8 right-6 opacity-70">
            {currentSlideState + 1} / {slides.length}
          </div>
        </>
      )}
    </section>
  )
}

export default Hero
