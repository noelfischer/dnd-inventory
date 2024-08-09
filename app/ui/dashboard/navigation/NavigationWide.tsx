'use client'

import { Button } from "@/components/ui/button"
import Dropdown from "@/components/Dropdown"
import { ChevronLeft, LoaderCircle, Plus } from "lucide-react"
import Link from "next/link"
import "./styles.css"
import { useActionState, useEffect, useState } from "react"
import { Layouts } from "react-grid-layout"

export const NavigationWide = ({ editMode, setEditMode, layouts, initialLayouts, updateLayout }: { editMode: boolean, setEditMode: (editMode: boolean) => void, layouts: Layouts, initialLayouts: Layouts, updateLayout: any }) => {
  const updateLayoutWithData = updateLayout.bind(null, cleanLayout(layouts));
  const noChange: boolean = compareLayouts(layouts, initialLayouts);

  const [errorMessage, formAction, isPending] = useActionState(updateLayoutWithData, undefined,);
  const [pendingClick, setPendingClick] = useState(false);

  useEffect(() => {
    if (pendingClick && isPending === false && errorMessage === undefined) {
      setEditMode(false);
    }
  }, [isPending, errorMessage]);

  function save() {
    if (noChange) { setEditMode(false); }
    else { setPendingClick(true); }
  };

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
    <div className={(editMode && "edit") + " bg-main  py-3 sm:py-1 mt-[-19px] -mx-7 items-stretch border-y-4 border-black pl-2 pr-5 flex place-items-center gap-2 sm:gap-6"}>
      <div className="flex place-items-center gap-6 flex-wrap content-between">
        {editMode ?
          <>
            <div className="text-text flex text-lg opacity-50"><ChevronLeft className="w-7 h-7" />Campaigns</div>
            <form action={formAction}>
              <Button type={noChange ? "button" : "submit"} className='w-[110px] h-10 mb-1' disabled={isPending} onClick={save}>
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
      </div>


      <div className="flex gap-2 flex-wrap">
        <Dropdown text={'Party'} items={items} disabled={editMode} />
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

function compareLayouts(layouts: Layouts, initialLayouts: Layouts): boolean {
  for (const breakpoint in layouts) {
    if (initialLayouts.hasOwnProperty(breakpoint)) {
      const currentLayout = layouts[breakpoint];
      const initialLayout = initialLayouts[breakpoint];

      if (currentLayout.length !== initialLayout.length) {
        return false;
      }

      for (let i = 0; i < currentLayout.length; i++) {
        const currentItem = currentLayout[i];
        const initialItem = initialLayout[i];

        if (
          currentItem.i !== initialItem.i ||
          currentItem.x !== initialItem.x ||
          currentItem.y !== initialItem.y ||
          currentItem.w !== initialItem.w ||
          currentItem.h !== initialItem.h
        ) {
          return false;
        }
      }
    }
  }

  return true;
}