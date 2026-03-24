import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { MdLocationOn, MdAccessTime, MdEmail, MdPhone } from 'react-icons/md'
import shop from '../config/shop'

function Footer() {
  const currentYear = new Date().getFullYear()

  const socials = [
    { icon: <FaInstagram size={18} />, href: shop.instagram },
    { icon: <FaFacebook size={18} />, href: shop.facebook },
    { icon: <FaTiktok size={18} />, href: shop.tiktok },
    { icon: <FaWhatsapp size={18} />, href: `https://wa.me/${shop.whatsapp}` },
  ]

  const contactItems = [
    { icon: <MdLocationOn size={18} className="text-accent mt-0.5 flex-shrink-0" />, content: shop.location },
    { icon: <MdPhone size={18} className="text-accent mt-0.5 flex-shrink-0" />, content: <a href={`https://wa.me/${shop.whatsapp}`} className="hover:text-accent transition-colors">+{shop.whatsapp}</a> },
    { icon: <MdAccessTime size={18} className="text-accent mt-0.5 flex-shrink-0" />, content: shop.hours },
    { icon: <MdEmail size={18} className="text-accent mt-0.5 flex-shrink-0" />, content: <a href={`mailto:${shop.email}`} className="hover:text-accent transition-colors">{shop.email}</a> },
  ]

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Catalogue', href: '#catalogue' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">{shop.name}</span>
              <span className="text-2xl font-light text-accent">{shop.nameAccent}</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              {shop.description}
            </p>
            <div className="flex gap-4">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white bg-opacity-10 hover:bg-accent p-3 rounded-full transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Get In Touch</h3>
            <ul className="space-y-4">
              {contactItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-400">
                  {item.icon}
                  <span>{item.content}</span>
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/${shop.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <FaWhatsapp size={18} />
              Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white border-opacity-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} {shop.name} {shop.nameAccent}. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Website by
            <a
              href={`https://wa.me/${shop.developerWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline ml-1"
            >
              {shop.developerName}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
