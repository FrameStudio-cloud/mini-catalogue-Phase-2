function Badge({ badge }) {
  if (!badge) return null

  const styles = {
    'New':         'bg-blue-500 text-white',
    'Best Seller': 'bg-orange-500 text-white',
    'On Sale':     'bg-green-500 text-white',
    'Limited':     'bg-red-500 text-white',
  }

  return (
    <span className={`
      ${styles[badge] || 'bg-gray-500 text-white'}
      text-xs font-medium px-2 py-0.5 rounded-full
    `}>
      {badge}
    </span>
  )
}

export default Badge