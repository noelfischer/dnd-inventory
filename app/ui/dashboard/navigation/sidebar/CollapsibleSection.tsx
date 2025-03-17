"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Dashboard {
  id: string
  name: string
}

interface CollapsibleSectionProps {
  dashboardID: string
  title: string
  icon: React.ElementType
  dashboards: Dashboard[]
  defaultOpen?: boolean
}

export function CollapsibleSection({ dashboardID, title, icon: Icon, dashboards, defaultOpen = false }: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <li className="px-2 py-2">
        <CollapsibleTrigger className="w-full" asChild>
          <Button variant="ghost" className="w-full justify-between h-9 px-2 font-normal text-md">
            <div className="flex items-center">
              <Icon className="h-6 w-6 mr-3" />
              <span>{title}</span>
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <ul className="ml-4 pl-2 border-l-2 border-gray-600">
            {dashboards.map((dashboard) => (
              <li key={dashboard.id} className="mt-2">
                {dashboard.id === dashboardID ?
                  <Button variant="ghost" className="h-8 w-full justify-start px-2 font-normal text-md" disabled>
                    {dashboard.name}
                  </Button>
                  :
                  <Button variant="ghost" asChild className="h-8 w-full justify-start px-2 font-normal text-md">
                    <Link href={"/dashboard/" + dashboard.id}>
                      <span>{dashboard.name}</span>
                    </Link>
                  </Button>
                }
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </li>
    </Collapsible>
  )
}

