// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { IS_DEVELOPMENT } from "../../core/constants/environment";
import { find } from "../../core/functions/find";
import {
    parseJson,
    ReadonlyJsonAny,
} from "../../core/Json";
import { LogService } from "../../core/LogService";
import { LocalStorageService } from "./LocalStorageService";
import {
    createUTMParams,
    isEqualUTMParams,
    UTMParams,
    parseUTMParamsArray,
} from "../../core/types/UTMParams";

const LOG = LogService.createLogger( 'UTMService' );

const UTM_LOCAL_STORAGE_KEY = "utm_service";
const UTM_EXPIRATION_TIME : number = 1000*60*60*24*30*6; // 6 months

export class UTMService {

    private static _localStorageKey : string = UTM_LOCAL_STORAGE_KEY;
    private static _expirationTime : number = UTM_EXPIRATION_TIME;

    public static setLocalStorageKey (name : string) : void {
        this._localStorageKey = name;
    }

    public static setExpirationTime (time : number) : void {
        this._expirationTime = time;
    }

    public static initialize () : void {
        const utmParams = this._getUTMParameters();
        if (utmParams) {
            this._saveUTMParams(utmParams);
            this._removeUTMParamsFromURL();
        }
    }

    public static getUTMParams () : UTMParams[] {
        return this._loadUTMParams();
    }

    public static getUTMParamsAsJSON () : ReadonlyJsonAny {
        return this.getUTMParams() as unknown as ReadonlyJsonAny;
    }

    private static _getUTMParameters (): UTMParams | undefined {

        const search = window?.location?.search;
        if (!search) return undefined;

        const searchParams = new URLSearchParams(search);

        const source   : string | undefined = searchParams.get( 'utm_source' )   || undefined;
        const medium   : string | undefined = searchParams.get( 'utm_medium' )   || undefined;
        const campaign : string | undefined = searchParams.get( 'utm_campaign' ) || undefined;
        const term     : string | undefined = searchParams.get( 'utm_term' )     || undefined;
        const content  : string | undefined = searchParams.get( 'utm_content' )  || undefined;

        if ( source || medium || campaign || term || content ) {
            return {
                ...createUTMParams(),
                ...( source   ? { source   } : {} ),
                ...( medium   ? { medium   } : {} ),
                ...( campaign ? { campaign } : {} ),
                ...( term     ? { term     } : {} ),
                ...( content  ? { content  } : {} ),
            };
        } else {
            return undefined;
        }
    }

    private static _loadUTMParams () : UTMParams[] {
        const storedString : string | null = LocalStorageService.getItem(this._localStorageKey);
        if (storedString) {
            const storedRaw = parseJson(storedString);
            return parseUTMParamsArray(storedRaw, this._expirationTime) ?? [];
        }
        return [];
    }

    private static _saveUTMParams (data : UTMParams) : void {
        const original = this._loadUTMParams();
        LOG.debug(`_saveUTMParams = data =`, data, original);
        if ( find(original, (item) => isEqualUTMParams(item, data)) === undefined ) {
            original.push(data);
            LocalStorageService.setItem(this._localStorageKey, JSON.stringify(original));
            LOG.debug("_saveUTMParams: Saved UTM: ", data);
        } else {
            LOG.debug("_saveUTMParams: Already stored: ", data)
        }
    }

    private static _removeUTMParamsFromURL () : void {
        if (window.history) {
            const url = new URL(window.location.href);
            const utmParameters = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
            utmParameters.forEach(param => url.searchParams.delete(param));
            const newUrl = url.href;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    }

}

if (IS_DEVELOPMENT) {
    (window as any).UTMService = UTMService;
}
