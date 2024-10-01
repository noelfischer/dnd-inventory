'use client'

import { Button } from '@/components/ui/button';
import { BookCopy, Ellipsis, Package } from 'lucide-react'
import Link from 'next/link';

import { useState } from 'react'

type Props = {
  duplicateCharacterById: () => void,
  character_id: string,
  campaign_id: string,
}

export default function DropdownCampaignCharacterOptions({ duplicateCharacterById, character_id, campaign_id }: Props) {
  const [isActiveDropdown, setIsActiveDropdown] = useState(false)

  return (
    <div
      data-state={isActiveDropdown ? 'open' : 'closed'}
      className="relative group text-text"
    >
      <Button
        aria-haspopup="listbox"
        aria-expanded={isActiveDropdown}
        onBlur={() => {
          setIsActiveDropdown(false)
        }}
        onClick={() => {
          setIsActiveDropdown(!isActiveDropdown)
        }}
        className="h-11"
      >
        <span className="sr-only">More Options</span>

        <Ellipsis className="w-5 h-6" />
      </Button>
      <div
        role="listbox"
        className="absolute z-10 left-0 w-max group-data-[state=open]:top-[43px] group-data-[state=open]:opacity-100 group-data-[state=closed]:invisible group-data-[state=closed]:top-[50px] group-data-[state=closed]:opacity-0 group-data-[state=open]:visible rounded-base border-2 border-border dark:border-darkBorder text-center font-base shadow-light dark:shadow-dark transition-all"
      >
        <form action={duplicateCharacterById}>
          <button className="flex gap-2 w-full border-b-2 border-border dark:border-darkBorder bg-main px-7 py-2 no-underline first:rounded-t-base last:rounded-b-base hover:bg-mainAccent"
            type='submit'
          >
            <BookCopy className="w-5 h6" /> Duplicate
          </button>
        </form>
        <Link className="flex gap-2 w-full border-b-2 border-border dark:border-darkBorder bg-main px-7 py-2 no-underline first:rounded-t-base last:rounded-b-base hover:bg-mainAccent"
          href={`/campaigns/${campaign_id}/${character_id}/move`}
        >
          <Package className="w-5 h6" /> Move campaign
        </Link>
      </div>
    </div>
  )
}