'use client'

import { ComponentLayout } from "@/app/dashboard/[id]/(overview)/page";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import './styles.css';

const DashboardGridLayout = ({ componentLayout }: { componentLayout: ComponentLayout }) => {
    const initialLayout: Layouts = {
        lg: componentLayout.components.map((component) => ({
            i: component.i, x: component.x_lg, y: component.y_lg, w: component.w_lg, h: component.h_lg, static: false,
        }))
    };

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

    return (
        <div>
            <button onClick={() => setEditMode(!editMode)}>Toggle Edit Mode</button>
            <ResponsiveReactGridLayout
                className="layout border-2 border-zinc-500"
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
                {componentLayout.components.map((component) => (
                    <div key={component.i} className="border-2 border-zinc-500 bg-bg dark:bg-darkBg">
                        {component.type}
                    </div>
                ))}
            </ResponsiveReactGridLayout>
        </div>
    );
};

export default DashboardGridLayout;
