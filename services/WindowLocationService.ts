// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { WindowObjectService } from "../../core/WindowObjectService";

export class WindowLocationService {

    public static getReferrer () : string {
        const window : any = WindowObjectService.getWindow();
        const document = _getDocument();
        return (
            (window?.location !== window?.parent?.location)
                ? document.referrer
                : document.location.href
        );
    }

}

function _getDocument () : any | undefined {
    if ( typeof document === "undefined" ) return undefined;
    return document;
}
