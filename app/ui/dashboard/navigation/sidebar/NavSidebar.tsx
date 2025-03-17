"use client"

import * as React from "react"
import { Menu, PlusCircle, Trash2, Users, Skull, PawPrintIcon as Paw, ChevronLeft, ScrollText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CollapsibleSection } from "./CollapsibleSection"
import { NavLink } from "../NavigationWide"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Dictionary } from "@/app/[lang]/dictionaries"

function switchIcon(title: string) {
  switch (title) {
    case "Party":
      return Users
    case "Player":
      return Users
    case "NPC":
      return ScrollText
    case "Enemy":
      return Skull
    case "Pet":
      return Paw
    default:
      return Users
  }
}

function switchDictionary(title: string, dictionary: Dictionary) {
  switch (title) {
    case "Party":
      return dictionary.dashboard.navigation.party
    case "Player":
      return dictionary.general.players
    case "NPC":
      return "NPCs"
    case "Enemy":
      return dictionary.campaign.enemies
    case "Pet":
      return dictionary.campaign.pets
    default:
      return dictionary.dashboard.navigation.party
  }
}

function switchIndex(title: string) {
  switch (title) {
    case "Party":
      return 0
    case "Player":
      return 1
    case "Pet":
      return 2
    case "NPC":
      return 3
    case "Enemy":
      return 4
    default:
      return 5
  }
}

function mapNavLinks(navLinks: NavLink[], dictionary: Dictionary) {
  return navLinks.map((navLink) => {
    return {
      index: switchIndex(navLink.name),
      title: switchDictionary(navLink.name, dictionary),
      icon: switchIcon(navLink.name),
      defaultOpen: (switchIcon(navLink.name) === Users),
      dashboards: navLink.links.map((link) => {
        return { id: link.id, name: link.name }
      }).sort((a, b) => a.name.localeCompare(b.name))
    }
  }).sort((a, b) => a.index - b.index)
}

type NavSidebarProps = {
  dictionary: Dictionary
  dashboardID: string
  navLinks: NavLink[]
  addDashboard: () => void
  deleteDashboard: () => void
  ableToDeleteDashboard: boolean
  ableToOpen: boolean
}

export function NavSidebar({ dictionary, dashboardID, navLinks, addDashboard, deleteDashboard, ableToDeleteDashboard, ableToOpen }: NavSidebarProps) {
  const [open, setOpen] = React.useState(false)

  function onOpenChange(open: boolean) {
    if (!ableToOpen) {
      setOpen(false)
    }
    else {
      setOpen(open)
    }
  }

  const characterTypes = mapNavLinks(navLinks, dictionary);

  return (
    <div>
      <div className="flex items-center pl-4">
        <Sheet open={open} onOpenChange={onOpenChange} >
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={cn(ableToOpen ? "cursor-pointer" : "cursor-auto")}>
              <Menu className={cn("h-7 w-7", ableToOpen ? "text-text" : "text-gray-700")} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-screen sm:w-[400px] max-w-screen overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto py-8">
                <nav className="space-y-2 text-lg">
                  <ul className="space-y-1 px-2 pb-4">
                    <li className="border-b-2 border-gray-600 pb-8">
                      <div className="mr-9">
                        <Button variant="ghost" className="w-full justify-start h-9 px-2 font-normal" asChild>
                          <Link href='/campaigns'>
                            <ChevronLeft className="h-6 w-6 mr-2" />
                            <SheetTitle className="text-xl font-semibold">{dictionary.general.campaigns}</SheetTitle>
                          </Link>
                        </Button>
                      </div>
                    </li>
                  </ul>

                  <ul className="space-y-1">
                    {/* Map through character types to create collapsible sections */}
                    {characterTypes.map((type) => (
                      <CollapsibleSection
                        dashboardID={dashboardID}
                        key={type.title}
                        title={type.title}
                        icon={type.icon}
                        dashboards={type.dashboards}
                        defaultOpen={type.defaultOpen}
                      />
                    ))}
                  </ul>

                  <ul className="space-y-2 px-2 pt-4">
                    <li className="border-t-2 border-gray-600 pt-8">
                      <Button
                        variant="ghost"
                        onClick={addDashboard}
                        className="w-full justify-start h-9 px-2 font-normal text-primary text-md"
                      >
                        <PlusCircle className="h-6 w-6 mr-3" />
                        <span>{dictionary.dashboard.navigation.newDashboard}</span>
                      </Button>
                    </li>
                    {ableToDeleteDashboard &&
                      <li>
                        <Button
                          variant="ghost"
                          onClick={deleteDashboard}
                          className="w-full justify-start h-9 px-2 font-normal text-destructive text-md"
                        >
                          <Trash2 className="h-6 w-6 mr-3" />
                          <span>{dictionary.dashboard.navigation.deleteDashboard}</span>
                        </Button>
                      </li>
                    }
                  </ul>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

