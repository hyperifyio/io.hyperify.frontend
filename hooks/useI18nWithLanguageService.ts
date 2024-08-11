// Copyright (c) 2021-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageService } from "../../core/LanguageService";
import { LogService } from "../../core/LogService";
import { TranslationUtils } from "../../core/TranslationUtils";

const LOG = LogService.createLogger( 'useCurrentLanguageChangedEvent' );

/** Detect when language in our service changes and propagate it to i18n */
export function useI18nWithLanguageService () {
    const { i18n } = useTranslation();
    useEffect(
        () => {
            return LanguageService.on(
                LanguageService.Event.CURRENT_LANGUAGE_CHANGED,
                () => {
                    const l = LanguageService.getCurrentLanguage();
                    const ls = TranslationUtils.getLanguageStringForI18n(l);
                    if (!ls) {
                        LOG.error(`Changing language: Could not parse language: ${l}`);
                    } else if (i18n.language !== ls) {
                        i18n.changeLanguage( ls ).catch(err => {
                            LOG.error(`Changing language: Could not change language to "${ls}" (${l}": `, err);
                        });
                    } else {
                        LOG.debug(`The language was already ${ls}`);
                    }
                }
            );
        },
        [
            i18n
        ]
    );
}
