// Copyright (c) 2021-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    JSXElementConstructor,
    ReactElement,
    ReactNode,
} from 'react';
import {
    Navigate,
    Outlet,
    useRoutes
} from "react-router-dom";
import { map } from "../../../core/functions/map";
import { useRouteServiceWithNavigate } from "../../hooks/useRouteServiceWithNavigate";

// NOTE! Order in which these imports are done is essential -- it declares the order of SCSS files!
// So, put components before layouts, and layouts before views. Otherwise layout's SCSS files will
// overwrite SCSS from views and make your life harder.

import { HyperRoute } from "../types/HyperRoute";
import { PropsWithClassName } from "../types/PropsWithClassName";
import { PropsWithLanguage } from "../types/PropsWithLanguage";
import { PropsWithPublicUrl } from "../types/PropsWithPublicUrl";
import { PropsWithRouteList } from "../types/PropsWithRouteList";
import { HyperView } from "../views/HyperView";

export interface HyperAppProps
    extends
        PropsWithPublicUrl,
        PropsWithLanguage,
        PropsWithClassName,
        PropsWithRouteList
{
    readonly publicUrl : string;
    readonly language  : string;
    readonly indexPath ?: string;
    readonly className ?: string;
    readonly routeList ?: readonly HyperRoute[];
}

/**
 * The name for this component is complete legacy.
 *
 * It should be something like "FiSendanorApp" now :)
 *
 * It is the app of sendanor.fi.
 *
 */
export function HyperApp (
    props : HyperAppProps
) {

    useRouteServiceWithNavigate();

    const publicUrl = props.publicUrl;
    const language = props.language;
    const routeList = props.routeList;
    const indexPath = props?.indexPath ?? '/';

    const mainRoutes = {
        path: indexPath,
        element: (
            <Outlet />
        ),
        children: map(
            routeList,
            (route : HyperRoute) => {

                const path : string = route.path;

                const redirect : string | undefined = route.redirect;
                if (redirect) {
                    return {
                        path: path,
                        element: <Navigate to={redirect} />
                    };
                }

                const view : ReactNode | undefined = route?.element;

                if ( view !== undefined ) {
                    return {
                        path: path,
                        element: view
                    };
                }

                return {
                    path: path,
                    element: (
                        <HyperView
                            name={'Hyper.NoContentView'}
                            language={language}
                            publicUrl={publicUrl}
                            routePath={path}
                        >
                            <p>No content for ${path}</p>
                        </HyperView>
                    )
                };
            }
        )
    };

    const routing :  ReactElement<any, string | JSXElementConstructor<any>> | null = useRoutes(
        [ mainRoutes ]
    );

    return <>{routing}</>;
}
