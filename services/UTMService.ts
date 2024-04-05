// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { IS_DEVELOPMENT } from "../../core/constants/environment";
import { filter } from "../../core/functions/filter";
import { find } from "../../core/functions/find";
import { parseJson } from "../../core/Json";
import { LogService } from "../../core/LogService";
import { isArray } from "../../core/types/Array";
import { LocalStorageService } from "./LocalStorageService";
import {
    createUTMParams,
    isUTMParams,
    isEqualUTMParams,
    UTMParams,
} from "./types/UTMParams";

const LOG = LogService.createLogger( 'UTMService' );

const UTM_LOCAL_STORAGE_KEY = "utm_service";
const UTM_EXPIRATION_TIME : number = 1000*60*60*24*30*6; // 6 months

export class UTMService {

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
        const storedString : string | null = LocalStorageService.getItem(UTM_LOCAL_STORAGE_KEY);
        if (storedString) {
            const storedRaw = parseJson(storedString);
            if (!isArray(storedRaw)) return [];
            return filter(
                storedRaw,
                ( item : unknown ) : boolean => isUTMParams( item ) && !this._isExpired(item.time, UTM_EXPIRATION_TIME)
            ) as unknown as UTMParams[];
        }
        return [];
    }

    private static _saveUTMParams (data : UTMParams) : void {
        const original = this._loadUTMParams();
        LOG.debug(`_saveUTMParams = data =`, data, original);
        if ( find(original, (item) => isEqualUTMParams(item, data)) === undefined ) {
            original.push(data);
            LocalStorageService.setItem(UTM_LOCAL_STORAGE_KEY, JSON.stringify(original));
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

    private static _isExpired (timeString: string, seconds: number) : boolean {
        const now : number = Date.now();
        if (!timeString) {
            return true;
        }
        const time : number = new Date(timeString).getTime();
        const duration : number = now - time;
        return duration >= seconds;
    }

}

if (IS_DEVELOPMENT) {
    (window as any).UTMService = UTMService;
}
