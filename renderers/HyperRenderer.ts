// Copyright (c) 2023-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { ReactNode } from "react";
import { ComponentDTOContent } from "../../core/entities/component/ComponentContent";
import { ComponentDTO } from "../../core/entities/component/ComponentDTO";
import { AppDTO } from "../../core/entities/app/AppDTO";
import { RouteDTO } from "../../core/entities/route/RouteDTO";
import { ViewDTO } from "../../core/entities/view/ViewDTO";
import { HyperRoute } from "../components/types/HyperRoute";

export interface HyperAppRenderer {
    (
        definitions : AppDTO,
    ) : ReactNode;
}

export interface HyperViewRenderer {
    (
        view        : ViewDTO,
        routePath   : string,
        definitions : AppDTO,
    ) : ReactNode;
}

export interface HyperContentRenderer {
    (
        content     : undefined | ComponentDTOContent,
        definitions : AppDTO,
    ) : ReactNode;
}

export interface HyperComponentRenderer {
    (
        component   : ComponentDTO,
        definitions : AppDTO,
    ) : ReactNode;
}

export interface HyperRouteRenderer {
    (
        item        : RouteDTO,
        definitions : AppDTO,
        publicUrl   : string,
    ) : HyperRoute;
}

export interface HyperRenderer {

    /**
     * Returns an unique base id for this renderer instance.
     */
    getFragmentId() : number;

    /**
     * Returns the default public URL
     */
    getPublicUrl () : string;

    /**
     * Attach custom app renderer.
     * @param f
     */
    attachAppRenderer (f : HyperAppRenderer) : void;

    /**
     *
     * @param definitions
     */
    renderApp (
        definitions : AppDTO,
    ) : ReactNode;

    /**
     *
     * @param f
     */
    attachRouteRenderer (f : HyperRouteRenderer) : void;

    /**
     *
     * @param item
     * @param definitions
     */
    renderRoute (
        item        : RouteDTO,
        definitions : AppDTO,
    ) : HyperRoute;

    /**
     *
     * @param definitions
     */
    renderRouteList (
        definitions : AppDTO,
    ) : readonly HyperRoute[];

    /**
     *
     * @param viewName
     * @param routePath
     * @param definitions
     */
    renderView (
        viewName    : string,
        routePath   : string,
        definitions : AppDTO,
    ) : ReactNode;

    /**
     *
     * @param content
     * @param definitions
     */
    renderContent (
        content     : undefined | ComponentDTOContent,
        definitions : AppDTO,
    ) : ReactNode;

}
