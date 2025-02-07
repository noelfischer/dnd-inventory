'use client'

import { Button } from "@/components/ui/button"
import Dropdown from "@/components/Dropdown"
import { ChevronLeft, LoaderCircle, PanelsLeftBottom, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import "./styles.css"
import { useMemo, useState } from "react"
import { Layouts } from "react-grid-layout"
import AddElement, { AddableElement } from "./AddElement"
import { keyValuePair } from "@/lib/utils"

type LinkText = {
  name: string
  link: string
}

export type NavLink = {
  name: string
  links: LinkText[]
}

type Props = {
  editMode: boolean,
  setEditMode: (editMode: boolean) => void,
  layouts: Layouts,
  initialLayouts: Layouts,
  updateLayout: Function,
  navLinks: NavLink[],
  newDashboard: any,
  ableToDeleteDashboard: boolean,
  deleteDashboard: any,
  isPartyDashboard: boolean,
  characters: keyValuePair[],
  addElementHandler: (formData: FormData) => Promise<string>
}

export const NavigationWide = ({ editMode, setEditMode, layouts, initialLayouts, updateLayout, navLinks, newDashboard, ableToDeleteDashboard, deleteDashboard, isPartyDashboard, characters, addElementHandler }: Props) => {
  const updateLayoutWithData = updateLayout.bind(null, cleanLayout(layouts));
  const noChange: boolean = compareLayouts(layouts, initialLayouts);
  const addableElements: AddableElement[] = useMemo(() => getAddableElements(layouts, characters, isPartyDashboard), [characters, layouts.lg]);
  const [isPending, setIsPending] = useState(false);

  async function save() {
    if (noChange) { setEditMode(false); }
    else {
      await dispatchServerFunction(updateLayoutWithData);
      setEditMode(false);
    }
  };


  async function dispatchServerFunction(serverFunction: Function) {
    setIsPending(true);
    try {
      await serverFunction();
    } catch (error) {
      console.error("an error:", error);
    }
    setIsPending(false);
  }

  async function addElementHandlerCustom(formData: FormData) {
    const layoutUpdatePromise = updateLayoutWithData();
    const elementHandlerPromise = addElementHandler(formData);
    const res = await Promise.all([layoutUpdatePromise, elementHandlerPromise]);
    return res[1];
  }

  return (
    <div className={(editMode && "edit") + " bg-main  py-3 xl:py-1 mt-[-19px] -mx-7 items-stretch border-y-4 border-black pl-2 pr-5 flex place-items-center gap-2 sm:gap-6"}>
      <div className="flex gap-6 flex-wrap content-between">
        {editMode ?
          <div className="text-text flex text-lg opacity-50 mt-2"><ChevronLeft className="w-7 h-7" />Campaigns</div>
          :
          <Link href='/campaigns' className="text-text flex text-lg mt-2"><ChevronLeft className="w-7 h-7" />Campaigns</Link>
        }
        <div className="flex gap-2 flex-wrap">
          {navLinks.map(({ name, links }) => (
            <Dropdown key={name} text={name === "Party" ? name : name.charAt(0).toUpperCase() + name.slice(1) + "s"} items={links} disabled={editMode} />
          ))}
          <Button className='w-auto min-w-[180px] flex justify-between mb-1' type="submit" disabled={isPending || editMode} onClick={() => dispatchServerFunction(newDashboard)}>
            New Dashboard <Plus /></Button>
          {ableToDeleteDashboard &&
            <Button className='w-auto min-w-[180px] flex justify-between px-3' disabled={isPending || editMode} onClick={() => dispatchServerFunction(deleteDashboard)}>
              Delete Dashboard
              <Trash2 />
            </Button>
          }
        </div>
      </div>

      <div className="ml-auto flex flex-wrap md:flex-nowrap items-start gap-2 h-min flex-row-reverse">
        {editMode ?
          <Button className='min-w-[160px] flex justify-between bg-main-accent' disabled={isPending} onClick={save}>
            {isPending && <span className="animate-spin mr-2"><LoaderCircle /></span>}
            Save <PanelsLeftBottom />
          </Button>
          :
          <Button className='min-w-[160px] flex justify-between bg-main-accent' onClick={() => setEditMode(true)}>Edit Layout <PanelsLeftBottom /></Button>
        }
        <AddElement addableElements={addableElements} addElementHandler={addElementHandlerCustom} disabled={isPending} />
      </div>
    </div>
  )
}

function getAddableElements(layouts: Layouts, characters: keyValuePair[], isPartyDashboard: boolean): AddableElement[] {
  const elementOptions = [
    { key: "name", value: "Name" },
    { key: "health", value: "Health" },
    { key: "inventory", value: "Inventory" },
    { key: "currency", value: "Coinage" },
    { key: "conditions", value: "Conditions" },
    { key: "levelup", value: "Level Up" },
    { key: "weight", value: "Weight" },
    { key: "notes", value: "Notes" },
    { key: "abilities", value: "Abilities" },
    { key: "spellslots", value: "Spell Slots" },
    { key: "inspiration", value: "Inspiration" },
    { key: "longrest", value: "Long Rest" },
  ].sort((a, b) => a.value.localeCompare(b.value));

  if (isPartyDashboard) {
    elementOptions.unshift({ key: "status", value: "Status" });
  }

  let addableElements: AddableElement[] = [];
  for (const character of characters) {

    addableElements.push({
      character, addableElements: elementOptions.filter(
        (element) => !(layouts.lg || []).find((layout) => {
          return layout.i.includes(`${element.key},${character.key}`)

        }
        ))
    });
  }
  return addableElements;
}

function cleanLayout(layouts: Layouts): Layouts {
  let newLayouts: Layouts = { lg: [] };
  for (const breakpoint in layouts) {
    if (layouts.hasOwnProperty(breakpoint)) {
      newLayouts[breakpoint] = layouts[breakpoint].map(({ moved, static: staticProp, ...rest }) => { return { i: rest.i, x: rest.x, y: rest.y, h: rest.h, w: rest.w } });
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
    } else {
      return false;
    }
  }

  return true;
}