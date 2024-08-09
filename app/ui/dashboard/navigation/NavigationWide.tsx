'use client'

import { Button } from "@/components/ui/button"
import Dropdown from "@/components/Dropdown"
import { ChevronLeft, LoaderCircle, Plus } from "lucide-react"
import Link from "next/link"
import "./styles.css"
import { useActionState, useEffect, useState } from "react"
import { Layouts } from "react-grid-layout"

type LinkText = {
  name: string
  link: string
}

export type NavLink = {
  name: string
  links: LinkText[]
}

export const NavigationWide = ({ editMode, setEditMode, layouts, initialLayouts, updateLayout, navLinks, newDashboard }: { editMode: boolean, setEditMode: (editMode: boolean) => void, layouts: Layouts, initialLayouts: Layouts, updateLayout: Function, navLinks: NavLink[], newDashboard: any }) => {
  const updateLayoutWithData = updateLayout.bind(null, cleanLayout(layouts));
  const noChange: boolean = compareLayouts(layouts, initialLayouts);

  const [errorMessageUpdateLayout, formActionUpdateLayout, isPendingUpdateLayout] = useActionState(updateLayoutWithData, undefined,);
  const [errorMessageNewDashboard, formActionNewDashboard, isPendingNewDashboard] = useActionState(newDashboard, undefined);
  const [pendingClick, setPendingClick] = useState(false);

  useEffect(() => {
    if (pendingClick && isPendingUpdateLayout === false && errorMessageUpdateLayout === undefined) {
      setEditMode(false);
    }
  }, [isPendingUpdateLayout, errorMessageUpdateLayout]);

  function save() {
    if (noChange) { setEditMode(false); }
    else { setPendingClick(true); }
  };

  return (
    <div className={(editMode && "edit") + " bg-main  py-3 sm:py-1 mt-[-19px] -mx-7 items-stretch border-y-4 border-black pl-2 pr-5 flex place-items-center gap-2 sm:gap-6"}>
      <div className="flex place-items-center gap-6 flex-wrap content-between">
        {editMode ?
          <>
            <div className="text-text flex text-lg opacity-50"><ChevronLeft className="w-7 h-7" />Campaigns</div>
            <form action={formActionUpdateLayout}>
              <Button type={noChange ? "button" : "submit"} className='w-[110px] h-10 mb-1' disabled={isPendingUpdateLayout} onClick={save}>
                {isPendingUpdateLayout && <span className="animate-spin mr-2">
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
        {navLinks.map(({ name, links }) => (
          <Dropdown key={name} text={name === "Party" ? name : name.charAt(0).toUpperCase() + name.slice(1) + "s"} items={links} disabled={editMode} />
        ))}
        <form action={formActionNewDashboard}>
          <Button className='w-auto min-w-[180px] flex justify-between' type="submit" disabled={isPendingNewDashboard}>
            {isPendingNewDashboard && <span className="animate-spin mr-2">
              <LoaderCircle />
            </span>}
            New Dashboard <Plus /></Button>
        </form>
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