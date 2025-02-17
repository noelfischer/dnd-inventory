// dictionary-provider.tsx
// https://github.com/vercel/next.js/discussions/57405#discussioncomment-7382170
'use client'

import React from "react"
import { Dictionary } from "./dictionaries"

const DictionaryContext = React.createContext<Dictionary | null>(null)

export default function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary
  children: React.ReactNode
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary() {
  const dictionary = React.useContext(DictionaryContext)
  if (dictionary === null) {
    throw new Error('useDictionary hook must be used within DictionaryProvider')
  }

  return dictionary
}