// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    explain,
    explainNot,
    explainOk,
    explainOr,
    explainProperty,
} from "../../../core/types/explain";
import {
    explainNoOtherKeysInDevelopment,
    hasNoOtherKeysInDevelopment,
} from "../../../core/types/OtherKeys";
import {
    explainRegularObject,
    isRegularObject,
} from "../../../core/types/RegularObject";
import {
    explainString,
    explainStringOrUndefined,
    isString,
    isStringOrUndefined,
} from "../../../core/types/String";
import { isUndefined } from "../../../core/types/undefined";

export interface UTMParams {
    readonly time : string;
    readonly source ?: string;
    readonly medium ?: string;
    readonly campaign ?: string;
    readonly term ?: string;
    readonly content ?: string;
}

export function createUTMParams () : UTMParams {
    const now = new Date();
    now.setMilliseconds(0);
    return {
        time: now.toISOString()
    };
}

export function isUTMParams (value: unknown) : value is UTMParams {
    return (
        isRegularObject(value)
        && hasNoOtherKeysInDevelopment(value, [
            'time',
            'source',
            'medium',
            'campaign',
            'term',
            'content',
        ])
        && isString(value?.time)
        && isStringOrUndefined(value?.source)
        && isStringOrUndefined(value?.medium)
        && isStringOrUndefined(value?.campaign)
        && isStringOrUndefined(value?.term)
        && isStringOrUndefined(value?.content)
    );
}

export function explainUTMParams (value: any) : string {
    return explain(
        [
            explainRegularObject(value),
            explainNoOtherKeysInDevelopment(value, [
                'time',
                'source',
                'medium',
                'campaign',
                'term',
                'content',
            ])
            , explainProperty("time", explainString(value?.time))
            , explainProperty("source", explainStringOrUndefined(value?.source))
            , explainProperty("medium", explainStringOrUndefined(value?.medium))
            , explainProperty("campaign", explainStringOrUndefined(value?.campaign))
            , explainProperty("term", explainStringOrUndefined(value?.term))
            , explainProperty("content", explainStringOrUndefined(value?.content))
        ]
    );
}

export function stringifyUTMParams (value : UTMParams) : string {
    return `UTMParams(${value})`;
}

export function parseUTMParams (value: unknown) : UTMParams | undefined {
    if (isUTMParams(value)) return value;
    return undefined;
}

export function isUTMParamsOrUndefined (value: unknown): value is UTMParams | undefined {
    return isUndefined(value) || isUTMParams(value);
}

export function explainUTMParamsOrUndefined (value: unknown): string {
    return isUTMParamsOrUndefined(value) ? explainOk() : explainNot(explainOr(['UTMParams', 'undefined']));
}

export function isEqualUTMParams( a : UTMParams, b : UTMParams) : boolean {
    return (
           a.time === b.time
        && a.source === b.source
        && a.medium === b.medium
        && a.campaign === b.campaign
        && a.term === b.term
        && a.content === b.content
    );
}