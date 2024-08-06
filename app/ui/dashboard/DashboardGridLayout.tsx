'use client'

import { Component } from "@/app/dashboard/[id]/(overview)/page";
import { useState } from "react";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import './styles.css';
import { NavigationWide } from "./navigation/NavigationWide";

const DashboardGridLayout = ({ initialLayout, componentList, updateLayout }: {
    initialLayout: Layouts,
    componentList: Component[],
    updateLayout: Function
}) => {


    const [layouts, setLayouts] = useState<Layouts>(initialLayout);
    const [editMode, setEditMode] = useState<boolean>(false);

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

    const saveLayout = () => {
        if (editMode === false) {
            setEditMode(true);
            return
        };
        console.log("saveLayout", layouts);
        setEditMode(false);
    };

    return (
        <div>
            <NavigationWide editMode={editMode} setEditMode={saveLayout} layouts={layouts} updateLayout={updateLayout} />
            <ResponsiveReactGridLayout
                className="layout -mx-2"
                layouts={layouts}
                cols={cols}
                onLayoutChange={onLayoutChange}
                onBreakpointChange={onBreakpointChange}
                rowHeight={42}
                isDraggable={editMode}
                isResizable={editMode}
                measureBeforeMount={false}
                useCSSTransforms={true}
                compactType="vertical"
                preventCollision={false}
            >
                {componentList.map((component: Component) => (
                    <div key={component.i} className="border-2 border-black dark:border-black bg-bg dark:bg-darkElevatedBg shadow-light dark:shadow-dark">
                        <div>
                            {component.type}
                        </div>
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );
};

export default DashboardGridLayout;
