'use client'

import { Button } from '@/components/ui/button';
import { ExportCharacter } from '@/lib/definitions';
import { cn, downloadJSON } from '@/lib/utils';
import { BookCopy, Download, Ellipsis, Package } from 'lucide-react'
import Link from 'next/link';

import { useState } from 'react'

type Props = {
  className?: string,
  duplicateCharacterById: () => void,
  exportCharacterById: () => Promise<ExportCharacter>,
  character_id: string,
  campaign_id: string,
}

export default function DropdownCampaignCharacterOptions({ className, duplicateCharacterById, exportCharacterById, character_id, campaign_id }: Props) {
  const [isActiveDropdown, setIsActiveDropdown] = useState(false)

  async function downloadCharacter() {
    const character = await exportCharacterById();
    downloadJSON(character, `${character.name}-character-dnd-inventory.json`);
  }

  return (
    <div
      data-state={isActiveDropdown ? 'open' : 'closed'}
      className={cn("relative group text-text", className)}
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
        className="absolute z-10 left-0 w-max group-data-[state=open]:top-[43px] group-data-[state=open]:opacity-100 group-data-[state=closed]:invisible group-data-[state=closed]:top-[50px] group-data-[state=closed]:opacity-0 group-data-[state=open]:visible rounded-base border-2 border-border dark:border-dark-border text-center font-base shadow-light dark:shadow-dark transition-all"
      >
        <form action={duplicateCharacterById}>
          <button className="flex gap-2 w-full border-b-2 border-border dark:border-dark-border bg-main px-7 py-2 no-underline first:rounded-t-base last:rounded-b-base hover:bg-main-accent"
            type='submit'
          >
            <BookCopy className="w-5 h6" /> Duplicate
          </button>
        </form>
        <Link className="flex gap-2 w-full border-b-2 border-border dark:border-dark-border bg-main px-7 py-2 no-underline first:rounded-t-base last:rounded-b-base hover:bg-main-accent"
          href={`/campaigns/${campaign_id}/${character_id}/move`}
        >
          <Package className="w-5 h6" /> Change Campaign
        </Link>
        <form action={downloadCharacter}>
          <button className="flex gap-2 w-full border-b-2 border-border dark:border-dark-border bg-main px-7 py-2 no-underline first:rounded-t-base last:rounded-b-base hover:bg-main-accent"
            type='submit'
          >
            <Download className="w-5 h6" /> Download Character
          </button>
        </form>
      </div>
    </div>
  )
}