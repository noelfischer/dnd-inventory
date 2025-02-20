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
import { useDictionary } from "@/app/[lang]/DictionaryProvider"
import { Dictionary } from "@/app/[lang]/dictionaries"

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
  const dictionary = useDictionary();
  const updateLayoutWithData = updateLayout.bind(null, cleanLayout(layouts));
  const noChange: boolean = compareLayouts(layouts, initialLayouts);
  const addableElements: AddableElement[] = useMemo(() => getAddableElements(layouts, characters, isPartyDashboard, dictionary), [characters, layouts.lg, isPartyDashboard]);
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

  return (
    <div className={(editMode && "edit") + " bg-main  py-3 xl:py-1 mt-[-19px] -mx-7 items-stretch border-y-4 border-black pl-2 pr-5 flex place-items-center gap-2 sm:gap-6"}>
      <div className="flex gap-6 flex-wrap content-between">
        {editMode ?
          <div className="text-text flex text-lg opacity-50 mt-2"><ChevronLeft className="w-7 h-7" />{dictionary.general.campaigns}</div>
          :
          <Link href='/campaigns' className="text-text flex text-lg mt-2"><ChevronLeft className="w-7 h-7" />{dictionary.general.campaigns}</Link>
        }
        <div className="flex gap-2 flex-wrap">
          {navLinks.map(({ name, links }) => (
            <Dropdown key={name} text={name === "Party" ? dictionary.dashboard.navigation.party : dictionary.general.players} items={links} disabled={editMode} />
          ))}
          <Button className='w-auto min-w-[180px] flex justify-between mb-1' type="submit" disabled={isPending || editMode} onClick={() => dispatchServerFunction(newDashboard)}>
            {dictionary.dashboard.navigation.newDashboard} <Plus /></Button>
          {ableToDeleteDashboard &&
            <Button className='w-auto min-w-[180px] flex justify-between px-3' disabled={isPending || editMode} onClick={() => dispatchServerFunction(deleteDashboard)}>
              {dictionary.dashboard.navigation.deleteDashboard}
              <Trash2 />
            </Button>
          }
        </div>
      </div>

      <div className="ml-auto flex flex-wrap md:flex-nowrap items-start gap-2 h-min flex-row-reverse">
        {editMode ?
          <Button className='min-w-[160px] flex justify-between bg-main-accent' disabled={isPending} onClick={save}>
            {isPending && <span className="animate-spin mr-2"><LoaderCircle /></span>}
            <span>{dictionary.general.save}</span>
            <PanelsLeftBottom className="ml-2" />
          </Button>
          :
          <Button className='min-w-[160px] flex justify-between bg-main-accent' onClick={() => setEditMode(true)}>{dictionary.dashboard.navigation.editLayout}<PanelsLeftBottom className="ml-2" /></Button>
        }
        <AddElement addableElements={addableElements} addElementHandler={addElementHandler} disabled={isPending} />
      </div>
    </div>
  )
}

function getAddableElements(layouts: Layouts, characters: keyValuePair[], isPartyDashboard: boolean, dictionary: Dictionary): AddableElement[] {
  const elementOptions = [
    { key: "name", value: dictionary.general.name },
    { key: "health", value: dictionary.dashboard.navigation.element.options.health },
    { key: "inventory", value: dictionary.dashboard.navigation.element.options.inventory },
    { key: "currency", value: dictionary.dashboard.navigation.element.options.currency },
    { key: "conditions", value: dictionary.dashboard.navigation.element.options.conditions },
    { key: "levelup", value: dictionary.dashboard.navigation.element.options.levelup },
    { key: "weight", value: dictionary.dashboard.navigation.element.options.weight },
    { key: "notes", value: dictionary.dashboard.navigation.element.options.notes },
    { key: "abilities", value: dictionary.dashboard.navigation.element.options.abilities },
    { key: "spellslots", value: dictionary.dashboard.navigation.element.options.spellslots },
    { key: "inspiration", value: dictionary.dashboard.navigation.element.options.inspiration },
    { key: "longrest", value: dictionary.dashboard.navigation.element.options.longrest },
  ].sort((a, b) => a.value.localeCompare(b.value));

  if (isPartyDashboard) {
    elementOptions.unshift({ key: "status", value: dictionary.dashboard.navigation.element.options.status });
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