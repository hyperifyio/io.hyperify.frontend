// Copyright (c) 2022-2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode, useState } from "react";
import {
    explainViewDTO,
    isViewDTO,
} from "../../../core/entities/view/ViewEntity";
import { startsWith } from "../../../core/functions/startsWith";
import { HttpService } from "../../../core/HttpService";
import { ReadonlyJsonObject } from "../../../core/Json";
import { LogService } from "../../../core/LogService";
import { AppDTO } from "../../../core/entities/app/AppDTO";
import { StyleDTO } from "../../../core/entities/style/StyleDTO";
import { ViewDTO } from "../../../core/entities/view/ViewDTO";
import { PropsWithClassName } from "../types/PropsWithClassName";
import { HyperView } from "./HyperView";
import "./RemoteHyperView.scss";

const LOG = LogService.createLogger( 'RemoteHyperView' );

export interface RemoteHyperViewProps
    extends
        PropsWithClassName
{
    readonly children       ?: ReactNode;
    readonly className      ?: string;
    readonly publicUrl      ?: string;
    readonly routePath       : string,
    readonly view            : ViewDTO;
    readonly definitions     : AppDTO,

}

export function RemoteHyperView (props: RemoteHyperViewProps) {
    const className = props?.className;
    const origView : ViewDTO = props.view;
    const routePath : string = props.routePath;
    const definitions : AppDTO = props.definitions;
    const children = props?.children ?? null;
    const publicUrl : string = props?.publicUrl ?? origView?.publicUrl ?? definitions.publicUrl ?? '';

    const [view, setView] = useState<ViewDTO>(origView);

    let viewName : string = view.name;
    if (startsWith(viewName, '/')) {
        viewName = `${publicUrl}${viewName}`;
    }

    if (startsWith(viewName, 'http://') || startsWith(viewName, 'https://')) {
        HttpService.getJson(viewName).then((result) => {
            if (isViewDTO(result)) {
                setView(result);
            } else {
                LOG.debug(`RemoteHyperView: result = `, result);
                LOG.error(`RemoteHyperView: Invalid result from "${viewName}": ${explainViewDTO(result)}`);
            }
        }).catch((err) => {
            LOG.error(`RemoteHyperView: Failed to fetch resource "${viewName}": `, err);
        });
    }

    const language  : string             = view?.language  ?? definitions.language  ?? 'en';
    const style     : StyleDTO      = view?.style     ?? {};
    const meta      : ReadonlyJsonObject = view?.meta      ?? {};
    return (
        <HyperView
            className={className}
            name={viewName}
            language={language}
            publicUrl={publicUrl}
            routePath={routePath}
            style={style}
            meta={meta}
        >{children}</HyperView>
    );
}
