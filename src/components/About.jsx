import { motion } from 'framer-motion'
import shop from '../config/shop'

function About() {
  return (
    <section id="about" className="py-20 overflow-hidden bg-cream">
      <div className="max-w-6xl px-4 mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-sm font-medium tracking-widest uppercase text-forest">
            Our Story
          </p>
          <h2 className="text-4xl font-bold text-primary">
            Fashion That Tells
            <span className="text-gold"> Your Story</span>
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid items-center grid-cols-1 gap-12 mb-20 md:grid-cols-2">

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Decorative background block */}
            <div className="absolute w-full h-full -top-4 -left-4 bg-forest rounded-2xl" />
            <div className="absolute w-32 h-32 a -bottom-4 -right-4 bg-gold rounded-2xl" />

            {/* Main image */}
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
              alt="About our shop"
              className="relative z-10 object-cover w-full h-96 rounded-2xl"
            />

            {/* Floating years badge */}
            <div className="absolute z-20 p-5 shadow-lg -bottom-6 -right-6 bg-gold text-primary rounded-2xl">
              <p className="text-4xl font-bold">{shop.yearsInBusiness}</p>
              <p className="mt-1 text-xs font-medium">Years in business</p>
            </div>

            {/* Floating tag */}
            <div className="absolute z-20 px-4 py-2 text-xs font-medium text-white rounded-full top-4 -right-4 bg-forest">
              🇰🇪 Made in Nairobi
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:pl-6"
          >
            {/* Story text */}
            <p className="mb-4 text-lg leading-relaxed text-gray-600">
              {shop.about}
            </p>
            <p className="mb-8 leading-relaxed text-gray-600">
              {shop.aboutExtra}
            </p>

            {/* Feature list */}
            <div className="mb-8 space-y-3">
              {[
                { icon: "🌿", text: "Locally sourced African prints" },
                { icon: "✂️", text: "Custom sizing available" },
                { icon: "🚚", text: "Same day delivery in Nairobi" },
                { icon: "💚", text: "Supporting local artisans" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-gray-600">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <a
              href="#catalogue"
              className="inline-block px-8 py-4 font-medium text-white transition-colors rounded-full bg-forest hover:bg-green-700"
            >
              View Our Collection
            </a>
          </motion.div>

        </div>

       

        {/* Story Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="mb-10 text-2xl font-bold text-center text-primary">
            Our <span className="text-gold">Journey</span>
          </h3>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

            <div className="space-y-8">

              {shop.timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: item.side === 'left' ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center gap-6
                    ${item.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'}
                    flex-col md:w-1/2
                    // ${item.side === 'right' ? 'md:ml-auto' : ''}
                  `}
                >
                  {/* Year badge */}
                  <div className={`${item.color} px-4 py-2 rounded-full font-bold text-sm flex-shrink-0`}>
                    {item.year}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 bg-white border border-gray-100 shadow-sm rounded-xl">
                    <h4 className="mb-1 font-semibold text-primary">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default About
