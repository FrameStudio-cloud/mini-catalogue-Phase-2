function Badge({ badge, variant }) {
  if (!badge && !variant) return null

  const styles = {
    'New':         'bg-blue-500 text-white',
    'Best Seller': 'bg-orange-500 text-white',
    'On Sale':     'bg-green-500 text-white',
    'Sale':        'bg-red-500 text-white',
    'Limited':     'bg-red-500 text-white',
  }

  const label = badge || variant

  return (
    <span className={`
      ${styles[label] || (variant === 'new_arrival' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white')}
      text-xs font-medium px-2 py-0.5 rounded-full
    `}>
      {label === 'new_arrival' ? 'New Arrival' : label}
    </span>
  )
}

export default Badge