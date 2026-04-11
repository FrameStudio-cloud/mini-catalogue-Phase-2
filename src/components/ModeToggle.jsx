import { useState } from "react"
import { useTheme } from "./ThemeProvider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>

      {open && (
        <div className="absolute right-0 z-50 w-32 mt-2 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
          {["light", "dark", "system"].map((t) => (
            <button
              key={t}
              onClick={() => { setTheme(t); setOpen(false) }}
              className="block w-full px-4 py-2 text-sm text-left capitalize hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}