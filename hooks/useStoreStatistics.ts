// Copyright (c) 2024. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { ReadonlyJsonObject } from "../../core/Json";
import { StoreProductService } from "../../core/StoreProductService";

export function useStoreStatistics () : ReadonlyJsonObject {
    const [ statistics, setStatistics ] = useState<ReadonlyJsonObject>( StoreProductService.getStatistics() );
    // When session service changes data
    useEffect(() => {
        if (!StoreProductService.isInitialized() && !StoreProductService.isLoading() ) {
            StoreProductService.refreshProducts();
        }
        return StoreProductService.on(
            StoreProductService.Event.UPDATED,
            () => {
                setStatistics( StoreProductService.getStatistics() );
            }
        );
    });
    return statistics;
}
