// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    explainEnum,
    isEnum,
    parseEnum,
    stringifyEnum,
} from "../../core/types/Enum";
import {
    explainNot,
    explainOk,
    explainOr,
} from "../../core/types/explain";
import { isUndefined } from "../../core/types/undefined";

export enum CookieConsent {
    ACCEPT_ALL = "ACCEPT_ALL",
    ACCEPT_MANDATORY = "ACCEPT_MANDATORY",
    UNDEFINED = "UNDEFINED",
}

export function isCookieConsent (value: unknown) : value is CookieConsent {
    return isEnum(CookieConsent, value);
}

export function explainCookieConsent (value : unknown) : string {
    return explainEnum("CookieConsent", CookieConsent, isCookieConsent, value);
}

export function stringifyCookieConsent (value : CookieConsent) : string {
    return stringifyEnum(CookieConsent, value);
}

export function parseCookieConsent (value: any) : CookieConsent | undefined {
    return parseEnum(CookieConsent, value) as CookieConsent | undefined;
}

export function isCookieConsentOrUndefined (value: unknown): value is CookieConsent | undefined {
    return isUndefined(value) || isCookieConsent(value);
}

export function explainCookieConsentOrUndefined (value: unknown): string {
    return isCookieConsentOrUndefined(value) ? explainOk() : explainNot(explainOr(['CookieConsent', 'undefined']));
}
