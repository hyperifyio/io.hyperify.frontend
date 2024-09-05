// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { sortBy } from "../../core/functions/sortBy";
import { StoreProductService } from "../../core/StoreProductService";
import { Product } from "../../core/store/types/product/Product";
import { ProductType } from "../../core/store/types/product/ProductType";

export function useStoreProductList (
    type ?: ProductType,
    sortByKey ?: string,
) : Product[] {
    const [ sellerMap, setSendanorProductList ] = useState<Product[]>(type ? StoreProductService.getProductsByType(type) : StoreProductService.getAllProducts() );
    // When session service changes data
    useEffect(() => {
        if (!StoreProductService.isInitialized() && !StoreProductService.isLoading() ) {
            StoreProductService.refreshProducts();
        }
        return StoreProductService.on(
            StoreProductService.Event.UPDATED,
            () => {
                let list = type ? StoreProductService.getProductsByType(type) : StoreProductService.getAllProducts();
                if (sortByKey) {
                    list = sortBy(list, [sortByKey])
                    setSendanorProductList( list );
                } else {
                    setSendanorProductList( list );
                }
            }
        );
    });
    return sellerMap;
}
