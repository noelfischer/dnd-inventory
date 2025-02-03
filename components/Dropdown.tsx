'use client'

import { ChevronDown } from 'lucide-react'

import { useState } from 'react'
import { Button } from './ui/button';

export default function Dropdown({
  items,
  text,
  disabled,
}: {
  items: { name: string; link: string }[]
  text: string
  disabled?: boolean
}) {
  const [isActiveDropdown, setIsActiveDropdown] = useState(false)

  return (
    <div
      data-state={isActiveDropdown ? 'open' : 'closed'}
      className="relative group text-text"
    >
      <Button
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isActiveDropdown}
        onBlur={() => {
          setIsActiveDropdown(false)
        }}
        onClick={() => {
          if (disabled) return
          setIsActiveDropdown(!isActiveDropdown)
        }}
        className="flex mb-1 min-w-[180px] w-auto"
      >
        <div className="w-full flex items-center justify-between">
          {text}
          <ChevronDown
            className={
              'ml-2 h-5 w-5 transition-transform group-data-[state=open]:rotate-180 group-data-[state=closed]:rotate-0 ease-in-out'
            }
          />
        </div>
      </Button>
      <div
        role="listbox"
        className="absolute z-10 left-0 w-auto group-data-[state=open]:top-[43px] group-data-[state=open]:opacity-100 group-data-[state=closed]:invisible group-data-[state=closed]:top-[50px] group-data-[state=closed]:opacity-0 group-data-[state=open]:visible rounded-base border-2 border-border dark:border-dark-border text-center font-base shadow-light dark:shadow-dark transition-all"
      >
        {items.map((item, index) => {
          return (
            <a
              key={index}
              href={item.link}
              className="block w-full border-b-2 border-border dark:border-dark-border bg-main px-7 py-2 no-underline first:rounded-t-base last:rounded-b-base hover:bg-main-accent"
            >
              {item.name}
            </a>
          )
        })}
      </div>
    </div>
  )
}