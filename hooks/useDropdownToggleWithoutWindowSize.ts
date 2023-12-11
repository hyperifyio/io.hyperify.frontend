// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { LogService } from "../../core/LogService";
import { useScrollTop } from "./useScrollTop";
import { useScrollingElement } from "./useScrollingElement";

const LOG = LogService.createLogger('useDropdownToggleWithoutWindowSize');

export type SetProfileMenuOpenCallback = Dispatch<SetStateAction<boolean>>;

export function useDropdownToggleWithoutWindowSize(initialState: boolean = false): [boolean, SetProfileMenuOpenCallback] {
    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(initialState);
    const location = useLocation();
    const scrollingElement = useScrollingElement();
    const scrollTop = useScrollTop(scrollingElement);

    // When window size changes, close menu
    useEffect(
        () => {
            LOG.debug('Closing dropdown menu since window size changed');
            setDropdownOpen(false);
        },
        [
            //    windowSize,
            setDropdownOpen
        ]
    );

    // When location changes, close menu
    useEffect(
        () => {
            LOG.debug('Closing dropdown menu since location changed');
            setDropdownOpen(false);
        },
        [
            location,
            setDropdownOpen
        ]
    );

    // When scroll changes
    useEffect(
        () => {
            LOG.debug('Closing dropdown menu since location changed');
            setDropdownOpen(false);
        },
        [
            scrollTop,
            setDropdownOpen
        ]
    );

    return [isDropdownOpen, setDropdownOpen];
}
