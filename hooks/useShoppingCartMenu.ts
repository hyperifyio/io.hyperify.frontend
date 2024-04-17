// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState, RefObject } from "react";
import { StoreCartService } from "../../core/StoreCartService";
import { LogService } from "../../core/LogService";
import { useWindowSizeChange } from "./useWindowSizeChange";
import { useLocationChange } from "./useLocationChange";
import { useScrollTopChange } from "./useScrollTopChange";
import { VoidCallback } from "../../core/interfaces/callbacks";

const LOG = LogService.createLogger('useShoppingCartMenu');

export function useShoppingCartMenu (
    context: string,
    cartRef: RefObject<HTMLElement> // Add this parameter
): [ boolean, VoidCallback, VoidCallback ] {

    const [ isMenuOpen, setMenuOpen ] = useState<boolean>(StoreCartService.isCartMenuOpen());

    const closeMenuCallback = useCallback(
        () => {
            LOG.debug(`${context}: Closing cart menu`);
            StoreCartService.closeCartMenu();
        },
        [context]
    );

    const toggleMenuCallback = useCallback(
        () => {
            StoreCartService.toggleCartMenu();
        },
        []
    );

    // Existing functionality
    useWindowSizeChange(`${context}.useShoppingCartMenu`, closeMenuCallback);
    useLocationChange(`${context}.useShoppingCartMenu`, closeMenuCallback);
    useScrollTopChange(`${context}.useShoppingCartMenu`, closeMenuCallback);

    useEffect(() => {
        // Detect when state in StoreCartService changes
        const unsub = StoreCartService.on(
            StoreCartService.Event.CART_MENU_UPDATED,
            () => setMenuOpen(StoreCartService.isCartMenuOpen())
        );
        return unsub;
    }, []);

    // Handle clicks outside the cart
    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (cartRef.current && !cartRef.current.contains(event.target as Node) && isMenuOpen) {
                closeMenuCallback();
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => document.removeEventListener('mousedown', handleDocumentClick);
    }, [isMenuOpen, closeMenuCallback, cartRef]);

    return [ isMenuOpen, toggleMenuCallback, closeMenuCallback ];
}
