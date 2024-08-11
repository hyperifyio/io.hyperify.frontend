// Copyright (c) 2021-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { useEffect } from "react";
import { LanguageService } from "../../core/LanguageService";
import { parseLanguage } from "../../core/types/Language";

/** Setup default language in to the LanguageService.
 *
 * @param defaultLanguage
 */
export function useDefaultLanguage (
    defaultLanguage: string | undefined,
) : void {
    useEffect(
        () => {
            const l = parseLanguage(defaultLanguage) ?? LanguageService.getDefaultLanguage();
            LanguageService.setCurrentLanguage(l);
        }, [
            defaultLanguage,
        ]
    );
}
