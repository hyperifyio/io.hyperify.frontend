// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    useCallback,
    useState,
} from "react";
import {
    CookieConsentService,
    CookieConsentServiceEvent,
} from "../services/CookieConsentService";
import { CookieConsent } from "../types/CookieConsent";
import { useServiceEvent } from "./useServiceEvent";

export interface ChangeCookieConsentCallback {
    (value: CookieConsent) : void;
}

export function useCookieConsent () : [CookieConsent, ChangeCookieConsentCallback] {

    function getCookieConsent() : CookieConsent {
        return CookieConsentService.getCookieConsent();
    }

    const [cookieConsent, setCookieConsent] = useState<CookieConsent>( getCookieConsent );

    const changeCookieConsent = useCallback((value : CookieConsent) => {
        CookieConsentService.setCookieConsent(value);
    },[
    ]);

    const updateCookieConsentCallback = useCallback(
        () => {
            setCookieConsent( getCookieConsent );
        }, [
            setCookieConsent
        ],
    )

    // When cookie consent in our service changes
    useServiceEvent(
        CookieConsentService,
        CookieConsentServiceEvent.VALUE_UPDATED,
        updateCookieConsentCallback,
    );

    return [ cookieConsent, changeCookieConsent ];
}
