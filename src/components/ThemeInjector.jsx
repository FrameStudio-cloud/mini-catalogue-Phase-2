import { useShop } from '../context/ShopContext'

function ThemeInjector() {
  const { shop } = useShop()
  const { primaryColor, accentColor } = shop

  return (
    <style>{`
      :root {
        --primary: ${primaryColor};
        --accent: ${accentColor};
      }
    `}</style>
  )
}

export default ThemeInjector
