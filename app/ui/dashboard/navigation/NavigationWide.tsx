'use client'

import { Button } from "@/components/ui/button"
import Dropdown from "@/components/Dropdown"
import { ChevronLeft, LoaderCircle, Plus } from "lucide-react"
import Link from "next/link"
import "./styles.css"
import { useActionState, useEffect, useState } from "react"
import { Layouts } from "react-grid-layout"

export const NavigationWide = ({ editMode, setEditMode, layouts, updateLayout }: { editMode: boolean, setEditMode: (editMode: boolean) => void, layouts: Layouts, updateLayout: any }) => {
  let updateLayoutWithData = updateLayout.bind(null, cleanLayout(layouts));

  const [errorMessage, formAction, isPending] = useActionState(
    updateLayoutWithData,
    undefined,
  );

  const [pendingClick, setPendingClick] = useState(false);


  console.log("isPending", isPending);
  console.log("errorMessage", errorMessage);

  useEffect(() => {
    if (pendingClick && isPending === false && errorMessage === undefined) {
      setEditMode(false);
    }
  }, [isPending, errorMessage]);

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
          <form action={formAction}>
            <Button type="submit" className='w-[110px] h-10 mb-1' disabled={isPending} onClick={() => setPendingClick(true)}>
              {isPending && <span className="animate-spin mr-2">
                <LoaderCircle />
              </span>}
              Save
            </Button>
          </form>
        </> :
        <>
          <Link href='/campaigns' className="text-text flex text-lg"><ChevronLeft className="w-7 h-7" />Campaigns</Link>
          <Button className='w-[110px] h-10 mb-1' onClick={() => setEditMode(true)}>Edit Layout</Button>
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


function cleanLayout(layouts: Layouts): Layouts {
  let newLayouts: Layouts = { lg: [] };
  for (const breakpoint in layouts) {
    if (layouts.hasOwnProperty(breakpoint)) {
      newLayouts[breakpoint] = layouts[breakpoint].map(({ moved, static: staticProp, ...rest }) => rest);
    }
  }
  return newLayouts;
}