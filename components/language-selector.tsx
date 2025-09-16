"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { languages } from "@/lib/translations"

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
      >
        <Globe className="h-4 w-4 text-slate-300" />
        <span className="text-sm text-white">{currentLanguage?.nativeName}</span>
        <ChevronDown className="h-4 w-4 text-slate-300" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-slate-700 rounded-lg shadow-lg border border-slate-600 min-w-[150px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-600 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code ? "bg-slate-600 text-blue-400" : "text-white"
              }`}
            >
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-slate-400">{lang.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
