'use client'

import { Component } from "@/app/[lang]/dashboard/[id]/(overview)/page";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import './styles.css';
import { NavigationWide, NavLink } from "./navigation/NavigationWide";
import { X } from "lucide-react";
import { keyValuePair } from "@/lib/utils";
import { useDictionary } from "@/app/[lang]/DictionaryProvider";

type Props = {
    dashboardID: string,
    initialLayout: Layouts,
    initialComponentList: Component[],
    updateLayout: Function,
    navLinks: NavLink[],
    newDashboard: Function,
    ableToDeleteDashboard: boolean,
    deleteDashboard: any,
    isPartyDashboard: boolean,
    characters: keyValuePair[],
    defaultCharacterId: string,
    addElementHandler: (formData: FormData) => Promise<string>
}

const DashboardGridLayout = ({ dashboardID, initialLayout, initialComponentList, updateLayout, navLinks, newDashboard, ableToDeleteDashboard, deleteDashboard, isPartyDashboard, characters, defaultCharacterId, addElementHandler }: Props) => {
    const dictionary = useDictionary();

    useEffect(() => {
        setLayouts(initialLayout);
        setComponentList(initialComponentList);
    }, [initialComponentList, initialLayout]);

    const [layouts, setLayouts] = useState<Layouts>(initialLayout);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteHover, setDeleteHover] = useState<boolean>(false);
    const [componentList, setComponentList] = useState<Component[]>(initialComponentList);

    const cols: { [key: string]: number } = { lg: 12, md: 10, sm: 5, xs: 3, xxs: 1 }

    const onLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
        const adjustedLayouts = adjustLayouts(allLayouts, cols);
        setLayouts(adjustedLayouts);
        console.log("adjustedLayouts", adjustedLayouts);
    };

    const onBreakpointChange = (breakpoint: string, cols: number) => {
        // Handle breakpoint change if needed
    };

    const adjustLayouts = (layouts: Layouts, cols: { [key: string]: number }): Layouts => {
        const adjusted: Layouts = {};
        for (const [breakpoint, layout] of Object.entries(layouts)) {
            const layout1: any = layout; //
            adjusted[breakpoint] = layout1.map((item: any) => {
                // Ensure x + w does not exceed the total number of columns
                if (item.x + item.w > cols[breakpoint]) {
                    item.x = Math.max(cols[breakpoint] - item.w, 0);
                }
                return item;
            });
        }
        return adjusted;
    };

    const removeElement = (i: string) => {
        const adjustedLayouts: Layouts = {};
        for (const [breakpoint, layout] of Object.entries(layouts)) {
            const layout1: any = layout; //
            const newLayout = layout1.filter((item: any) => item.i !== i);
            adjustedLayouts[breakpoint] = newLayout;
        }
        setLayouts(adjustedLayouts);
        setComponentList(componentList.filter((component) => component.i !== i));
    }

    return (
        <div>
            <NavigationWide
                dashboardID={dashboardID}
                editMode={editMode}
                setEditMode={setEditMode}
                layouts={layouts}
                initialLayouts={initialLayout}
                updateLayout={updateLayout}
                navLinks={navLinks}
                newDashboard={newDashboard}
                ableToDeleteDashboard={ableToDeleteDashboard}
                deleteDashboard={deleteDashboard}
                isPartyDashboard={isPartyDashboard}
                characters={characters}
                defaultCharacterId={defaultCharacterId}
                addElementHandler={addElementHandler}
            />
            <ResponsiveReactGridLayout
                className="layout -mx-2"
                layouts={layouts}
                cols={cols}
                onLayoutChange={onLayoutChange}
                onBreakpointChange={onBreakpointChange}
                rowHeight={42}
                isDraggable={editMode && !deleteHover}
                isResizable={editMode}
                measureBeforeMount={false}
                useCSSTransforms={true}
                compactType="vertical"
                preventCollision={false}
            >
                {componentList.map((component: Component) => (
                    <div key={component.i} className="border-2 border-black dark:border-black bg-bg dark:bg-dark-elevated-bg shadow-light dark:shadow-dark">
                        <div className={(editMode ? "edit-shown" : "edit-hidden")}>
                            <div className="remove" onClick={() => { removeElement(component.i) }} onTouchEnd={() => removeElement(component.i)} onMouseEnter={() => setDeleteHover(true)} onMouseLeave={() => setDeleteHover(false)}>
                                <X className="h-7 -mr-[3px] -mt-[5px]" strokeWidth={3} />
                            </div>
                            <div className="edit-item-desc edit-item-name">
                                {translateName(component.name)}
                            </div>
                            <div className="edit-item-desc edit-item-owner">
                                {component.owner}
                            </div>
                        </div>
                        <div>
                            {component.type}
                        </div>
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );


    function translateName(element: string) {
        switch (element) {
            case "name": return dictionary.general.name;
            case "health": return dictionary.dashboard.navigation.element.options.health;
            case "inventory": return dictionary.dashboard.navigation.element.options.inventory;
            case "currency": return dictionary.dashboard.navigation.element.options.currency;
            case "conditions": return dictionary.dashboard.navigation.element.options.conditions;
            case "levelup": return dictionary.dashboard.navigation.element.options.levelup;
            case "weight": return dictionary.dashboard.navigation.element.options.weight;
            case "notes": return dictionary.dashboard.navigation.element.options.notes;
            case "abilities": return dictionary.dashboard.navigation.element.options.abilities;
            case "spellslots": return dictionary.dashboard.navigation.element.options.spellslots;
            case "inspiration": return dictionary.dashboard.navigation.element.options.inspiration;
            case "longrest": return dictionary.dashboard.navigation.element.options.longrest;
            case "status": return dictionary.dashboard.navigation.element.options.status;
            default: return dictionary.general.name;
        }
    }
};

export default DashboardGridLayout;
