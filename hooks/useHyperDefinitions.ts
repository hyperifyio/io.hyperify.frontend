// Copyright (c) 2023. Sendanor <info@sendanor.fi>. All rights reserved.

import { useCallback } from "react";
import { HttpService } from "../../core/HttpService";
import { ReadonlyJsonAny } from "../../core/Json";
import { LogService } from "../../core/LogService";
import { isString } from "../../core/types/String";
import { RefreshCallback, useAsyncResource } from "../../../hg/frontend/hooks/useAsyncResource";
import { explainAppDTO, AppDTO, isAppDTO } from "../../core/dto/AppDTO";
import { populateAppDTO } from "../../core/utils/populateAppDTO";

const LOG = LogService.createLogger( 'useHyperDefinitions' );

/**
 *
 * @param definitions
 * @deprecated Use HyperServiceImpl directly.
 */
export function useHyperDefinitions (
    definitions : AppDTO | string
) : [AppDTO | null | undefined, RefreshCallback] {
    const callback = useCallback( async () : Promise<AppDTO> => {

        if (!isString(definitions)) {
            LOG.debug(`Refreshing DTO object:`, definitions);
            return await populateAppDTO(definitions);
        }

        LOG.debug(`Fetching definition from URL:`, definitions);
        const result : ReadonlyJsonAny | undefined = await HttpService.getJson(definitions);
        if (!isAppDTO(result)) {
            throw new TypeError(`The response was not HyperDTO: ${explainAppDTO(result)}`)
        }

        LOG.debug(`Refreshing received DTO object:`, result);
        return await populateAppDTO(result, result?.publicUrl ?? definitions);

    }, [
        definitions
    ]);
    return useAsyncResource<AppDTO>( callback );
}
