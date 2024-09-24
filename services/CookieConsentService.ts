// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO } from "../../core/auth/email/types/EmailTokenDTO";
import { JsonAny } from "../../core/Json";
import { LogService } from "../../core/LogService";
import {
    Observer,
    ObserverCallback,
    ObserverDestructor,
} from "../../core/Observer";
import {
    CookieConsent,
    isCookieConsent,
} from "../types/CookieConsent";
import { JsonLocalStorageService } from "./JsonLocalStorageService";

const LOG = LogService.createLogger( 'CookieConsentService' );

export enum CookieConsentServiceEvent {
    VALUE_UPDATED     = "CookieConsentService:valueUpdated",
}

export type CookieConsentServiceDestructor = ObserverDestructor;

/**
 * Saves cookie consent to localStorage.
 */
export class CookieConsentService {

    private static _localStorageKey : string = "fi.hg.cookieConsent";
    private static _value : CookieConsent = this._getFromLocalStorage();
    private static _observer: Observer<CookieConsentServiceEvent> = new Observer<CookieConsentServiceEvent>("CookieConsentService");

    public static Event = CookieConsentServiceEvent;

    public static on (
        name: CookieConsentServiceEvent,
        callback: ObserverCallback<CookieConsentServiceEvent>
    ): CookieConsentServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    public static setLocalStorageKey (key: string) {
        CookieConsentService._localStorageKey = key;
    }

    public static getCookieConsent () : CookieConsent {
        return this._value;
    }

    public static setCookieConsent (value : CookieConsent) {
        this._value = value;
        const storageKey : string = CookieConsentService._localStorageKey;
        JsonLocalStorageService.setItem(storageKey, value as unknown as JsonAny);
        this._observer.triggerEvent(CookieConsentServiceEvent.VALUE_UPDATED);
    }

    private static _getFromLocalStorage () : CookieConsent {
        try {
            const storageKey : string = CookieConsentService._localStorageKey;
            const token : any = JsonLocalStorageService.getItem(storageKey) || undefined;
            return isCookieConsent(token) ? token : CookieConsent.UNDEFINED;
        } catch (err) {
            LOG.error(`Could not parse localstorage token: `, err);
            return CookieConsent.UNDEFINED;
        }
    }

}
