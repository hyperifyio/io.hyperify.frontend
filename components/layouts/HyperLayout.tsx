// Copyright (c) 2021-2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode, useState } from "react";
import { Theme } from "../../../core/types/Theme";
import { HYPER_LAYOUT_CLASS_NAME } from "../../../core/constants/classNames";
import "./HyperLayout.scss";

export interface HyperLayoutProps {
    readonly children: ReactNode;
    readonly className?: string;
    readonly theme?: Theme;
    readonly setThemeDark?: boolean;
}

export function HyperLayout (props: HyperLayoutProps) {
    const children = props?.children;
    const [ theme, _setTheme ] = useState<Theme>(props?.theme ?? Theme.LIGHT);
    const isThemeDark = theme === Theme.DARK;
    return (
        <div
            className={HYPER_LAYOUT_CLASS_NAME}
            data-theme={isThemeDark ? "dark" : "light"}
        >{children}</div>
    );
}
