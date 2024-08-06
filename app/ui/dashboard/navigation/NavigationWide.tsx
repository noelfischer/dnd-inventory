'use client'

import { Button } from "@/components/ui/button"
import Dropdown from "@/components/Dropdown"
import { ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"
import "./styles.css"

export const NavigationWide = ({ editMode, setEditMode }:
  { editMode: boolean, setEditMode: (editMode: boolean) => void }
) => {

  const items = [
    {
      name: 'Player 1, Dashboard 1',
      link: 'https://www.youtube.com',
    },
    {
      name: 'Player 1, Dashboard 2',
      link: 'https://www.facebook.com',
    },
    {
      name: 'Player 2, Dashboard 1',
      link: 'https://www.google.com',
    },
  ]

  return (
    <div className={(editMode && "edit") + " bg-main mt-[-19px] -mx-7 border-y-4 border-black pl-2 pr-5 py-1 flex place-items-center gap-6"}>
      {editMode ?
        <>
          <div className="text-text flex text-lg opacity-50"><ChevronLeft className="w-7 h-7" />Campaigns</div>
          <Button className='w-[110px] h-10 mb-1' onClick={() => setEditMode(!editMode)}>Save</Button>
        </> :
        <>
          <Link href='/campaigns' className="text-text flex text-lg"><ChevronLeft className="w-7 h-7" />Campaigns</Link>
          <Button className='w-[110px] h-10 mb-1' onClick={() => setEditMode(!editMode)}>Edit Layout</Button>
        </>
      }


      <div className="flex gap-2 flex-wrap">
        <Dropdown text={'Global'} items={items} disabled={editMode} />
        <Dropdown text={'Players'} items={items} disabled={editMode} />
        <Dropdown text={'Pets'} items={items} disabled={editMode} />
        <Dropdown text={'NPCs'} items={items} disabled={editMode} />
        <Dropdown text={'Enemies'} items={items} disabled={editMode} />
      </div>
      <Button className='w-auto h-10 px-2 mb-1 ml-auto' disabled={editMode}><Plus /></Button>
    </div>
  )
}
