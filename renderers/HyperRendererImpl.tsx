// Copyright (c) 2023-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    ReactNode,
    Fragment,
} from "react";
import { Link } from "react-router-dom";
import { isActionDTOOrStringOrUndefined } from "../../core/entities/action/ActionEntity";
import {
    ComponentDTOContent,
} from "../../core/entities/component/ComponentContent";
import { isComponentDTO } from "../../core/entities/component/ComponentEntity";
import { kebabCase } from "../../core/functions/kebabCase";
import { map } from "../../core/functions/map";
import { ReadonlyJsonObject } from "../../core/Json";
import { LogService } from "../../core/LogService";
import { isArray } from "../../core/types/Array";
import { LogLevel } from "../../core/types/LogLevel";
import { isString } from "../../core/types/String";
import { Button } from "../components/button/Button";
import { ActionDTO } from "../../core/entities/action/ActionDTO";
import { ComponentDTO } from "../../core/entities/component/ComponentDTO";
import { AppDTO } from "../../core/entities/app/AppDTO";
import { RouteDTO } from "../../core/entities/route/RouteDTO";
import { StyleDTO } from "../../core/entities/style/StyleDTO";
import { ViewDTO } from "../../core/entities/view/ViewDTO";
import { HyperComponent } from "../../core/entities/types/HyperComponent";
import { StyleEntity } from "../../core/entities/style/StyleEntity";
import { findAndPopulateViewDTO } from "../../core/utils/views/findAndPopulateViewDTO";
import { populateComponentDTO } from "../../core/utils/components/populateComponentDTO";
import { HyperActionButton } from "../components/actionButton/HyperActionButton";
import { HyperApp } from "../components/apps/HyperApp";
import { HyperArticle } from "../components/article/HyperArticle";
import {
    createHyperRoute,
    HyperRoute,
} from "../components/types/HyperRoute";
import { LazyHyperView } from "../components/views/LazyHyperView";
import {
    HyperAppRenderer,
    HyperContentRenderer,
    HyperRenderer,
    HyperRouteRenderer,
    HyperViewRenderer,
} from "./HyperRenderer";

const LOG = LogService.createLogger( 'HyperRendererImpl' );

export class HyperRendererImpl implements HyperRenderer {

    public static setLogLevel ( level : LogLevel ) : void {
        LOG.setLogLevel( level );
    }

    private static _fragmentIdIndex : number = 0;
    private readonly _myFragmentBaseId : number = 0;

    private readonly _contentRenderer : HyperContentRenderer;
    private readonly _viewRenderer : HyperViewRenderer;
    private _appRenderer : HyperAppRenderer;
    private _routeRenderer : HyperRouteRenderer;
    private readonly _publicUrl : string;

    private static _getNextFragmentId () : number {
        HyperRendererImpl._fragmentIdIndex += 1;
        return HyperRendererImpl._fragmentIdIndex;
    }

    private constructor (
        publicUrl : string,
    ) {
        this._publicUrl = publicUrl;
        this._myFragmentBaseId = HyperRendererImpl._getNextFragmentId();
        this._appRenderer = HyperRendererImpl.defaultRenderApp.bind( undefined, this );
        this._routeRenderer = HyperRendererImpl.defaultRenderRoute.bind( undefined, this );
        this._viewRenderer = HyperRendererImpl.defaultRenderView.bind( undefined, this );
        this._contentRenderer = HyperRendererImpl.defaultRenderContent.bind( undefined, this );
    }

    public getFragmentId () : number {
        return this._myFragmentBaseId;
    }

    public getPublicUrl () : string {
        return this._publicUrl;
    }

    public static create (
        publicUrl : string,
    ) : HyperRendererImpl {
        return new HyperRendererImpl( publicUrl );
    }

    /**
     * @inheritDoc
     */
    public attachAppRenderer ( f : HyperAppRenderer ) : void {
        this._appRenderer = f;
    }

    /**
     * @inheritDoc
     */
    public attachRouteRenderer ( f : HyperRouteRenderer ) : void {
        this._routeRenderer = f;
    }

    /**
     * @inheritDoc
     */
    public renderRoute (
        item : RouteDTO,
        definitions : AppDTO,
    ) : HyperRoute {
        const publicUrl = definitions?.publicUrl ?? this._publicUrl;
        return this._routeRenderer(
            item,
            definitions,
            publicUrl,
        );
    }

    /**
     * @inheritDoc
     */
    public renderRouteList (
        definitions : AppDTO,
    ) : readonly HyperRoute[] {
        return map(
            definitions.routes,
            ( item : RouteDTO ) : HyperRoute => this.renderRoute(
                item,
                definitions,
            ),
        );
    }

    /**
     * @inheritDoc
     */
    public renderApp (
        definitions : AppDTO,
    ) : ReactNode {
        return this._appRenderer( definitions );
    }

    /**
     * @inheritDoc
     */
    public renderView (
        viewName : string,
        routePath : string,
        definitions : AppDTO,
    ) : ReactNode {
        const view : ViewDTO = findAndPopulateViewDTO(
            viewName,
            definitions.views,
            definitions.publicUrl ?? this._publicUrl,
        );
        return this._viewRenderer( view, routePath, definitions );
    }

    /**
     * @inheritDoc
     */
    public renderContent (
        content : undefined | ComponentDTOContent,
        definitions : AppDTO,
    ) : ReactNode {
        return this._contentRenderer( content, definitions );
    }

    /**
     * Default render implementation for apps
     *
     * @param definitions
     * @param renderer
     */
    public static defaultRenderApp (
        renderer : HyperRenderer,
        definitions : AppDTO,
    ) : ReactNode {
        const publicUrl : string | undefined = definitions.publicUrl ?? renderer.getPublicUrl();
        const language : string | undefined = definitions.language ?? 'en';
        return (
            <HyperApp
                publicUrl={ publicUrl }
                language={ language }
                routeList={ renderer.renderRouteList( definitions ) }
            />
        );
    }

    /**
     *
     * @param renderer
     * @param item
     * @param definitions
     */
    public static defaultRenderRoute (
        renderer : HyperRenderer,
        item : RouteDTO,
        definitions : AppDTO,
    ) : HyperRoute {

        if ( item.redirect ) {
            return createHyperRoute(
                item.path,
                item.language,
                item.publicUrl,
                item.redirect,
                undefined,
            );
        }

        if ( !item.view ) throw new TypeError( `No view defined for route: ${ item.name }` );

        return createHyperRoute(
            item.path,
            item.language,
            item.publicUrl,
            undefined,
            renderer.renderView(
                item.view,
                item.path,
                definitions,
            ),
        );

    }

    /**
     *
     * @param renderer
     * @param view
     * @param routePath
     * @param definitions
     */
    public static defaultRenderView (
        renderer : HyperRenderer,
        view : ViewDTO,
        routePath : string,
        definitions : AppDTO,
    ) : ReactNode {
        const viewName : string = view.name;
        const language : string = view.language ?? definitions.language ?? 'en';
        const publicUrl : string = view.publicUrl ?? definitions.publicUrl ?? '';
        const style : StyleDTO = view.style ?? {};
        const meta : ReadonlyJsonObject = view.meta ?? {};
        LOG.debug( `Initializing view: `, viewName );
        return (
            <LazyHyperView
                name={ viewName }
                language={ language }
                publicUrl={ publicUrl }
                routePath={ routePath }
                style={ style }
                meta={ meta }
            >{ renderer.renderContent( view.content, definitions ) }</LazyHyperView>
        );
    }

    /**
     *
     * @param renderer
     * @param content
     * @param definitions
     */
    public static defaultRenderComponent (
        renderer : HyperRenderer,
        content : ComponentDTO,
        definitions : AppDTO,
    ) : ReactNode {

        const populatedComponent : ComponentDTO = populateComponentDTO( content, definitions.components );

        if ( populatedComponent.name === HyperComponent.Article ) {
            return <HyperArticle>{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</HyperArticle>;
        }

        return <>{ JSON.stringify( content ) }</>;
    }

    /**
     *
     * @param renderer
     * @param content
     * @param definitions
     */
    public static defaultRenderContent (
        renderer : HyperRenderer,
        content : undefined | ComponentDTOContent | string | ComponentDTO,
        definitions : AppDTO,
    ) : ReactNode {

        const internalRoutePaths : readonly string[] = map(
            definitions?.routes,
            ( route : RouteDTO ) : string => route.path,
        );

        if ( isArray( content ) ) {
            const fragmentId : number = HyperRendererImpl._getNextFragmentId();
            return <>{ map(
                content,
                ( item : string | ComponentDTO, index : number ) : ReactNode => {
                    return (
                        <Fragment key={ `content-${ fragmentId }-index-${ index }` }>{
                            HyperRendererImpl.defaultRenderContent( renderer, item, definitions )
                        }</Fragment>
                    );
                },
            ) }</>;
        }

        if ( isComponentDTO( content ) ) {

            const originalName : string = content?.name;

            const populatedComponent : ComponentDTO = populateComponentDTO( content, definitions.components );

            if ( populatedComponent.name === HyperComponent.ActionButton ) {

                const meta = content?.meta ?? {};

                // FIXME: This should default to the current route
                const hrefData = meta?.href;
                const href : string | undefined = isString( hrefData ) ? hrefData : undefined;

                const methodData = meta?.method;
                const method : string | undefined = isString( methodData ) ? methodData : undefined;

                // FIXME: This should default to the current route
                const successRedirectData = meta?.successRedirect;
                const successRedirect : string | ActionDTO | undefined = isActionDTOOrStringOrUndefined( successRedirectData ) ? successRedirectData : undefined;

                // FIXME: This should default to the current route
                const failureRedirectData = meta?.failureRedirect;
                const failureRedirect : string | ActionDTO | undefined = isActionDTOOrStringOrUndefined( failureRedirectData ) ? failureRedirectData : undefined;

                const body = meta?.body;

                return (
                    <HyperActionButton
                        originalName={ originalName }
                        target={ href }
                        method={ method }
                        successRedirect={ successRedirect }
                        failureRedirect={ failureRedirect }
                        body={ body }
                        css={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</HyperActionButton>

                );
            }

            if ( populatedComponent.name === HyperComponent.Article ) {
                return (
                    <article
                        className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</article>
                );
            }

            if ( populatedComponent.name === HyperComponent.Table ) {
                return (
                    <table
                        className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</table>
                );
            }

            if ( populatedComponent.name === HyperComponent.TableRow ) {
                return (
                    <tr
                        className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</tr>
                );
            }

            if ( populatedComponent.name === HyperComponent.TableColumn ) {
                return (
                    <td
                        className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</td>
                );
            }

            if ( populatedComponent.name === HyperComponent.Button ) {
                return (
                    <Button
                        className={ 'app-' + kebabCase( originalName ) }
                        css={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</Button>
                );
            }

            if ( populatedComponent.name === HyperComponent.LinkButton ) {
                const hrefData = populatedComponent.meta?.href;
                const href : string = isString( hrefData ) ? hrefData : '#';
                if ( internalRoutePaths.includes( href ) ) {

                    return (
                        <Link
                            style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                            className={ 'hg-button app-' + kebabCase( originalName ) }
                            to={ href }
                        >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</Link>
                    );
                }
                return (
                    <a
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                        className={ 'hg-button app-' + kebabCase( originalName ) }
                        href={ href }
                    >{ HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions ) }</a>
                );
            }

            if ( populatedComponent.name === HyperComponent.Link ) {
                const hrefData = populatedComponent.meta?.href;
                const href : string = isString( hrefData ) ? hrefData : '#';
                if ( internalRoutePaths.includes( href ) ) {
                    return (
                        <Link
                            to={ href }
                            className={ 'app-' + kebabCase( originalName ) }
                            style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                        >{
                            HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                        }</Link>
                    );
                }
                return (
                    <a
                        className={ 'app-' + kebabCase( originalName ) }
                        href={ href }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</a>
                );
            }

            if ( populatedComponent.name === HyperComponent.Div ) {
                return (
                    <div
                        className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</div>
                );
            }

            if ( populatedComponent.name === HyperComponent.Span ) {
                return (
                    <span
                        className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</span>
                );
            }

            if ( populatedComponent.name === HyperComponent.H1 ) {
                return (
                    <h1 className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</h1>
                );
            }

            if ( populatedComponent.name === HyperComponent.H2 ) {
                return (
                    <h2 className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</h2>
                );
            }

            if ( populatedComponent.name === HyperComponent.H3 ) {
                return (
                    <h3 className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</h3>
                );
            }

            if ( populatedComponent.name === HyperComponent.H4 ) {
                return (
                    <h4 className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }>{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</h4>
                );
            }

            if ( populatedComponent.name === HyperComponent.H5 ) {
                return (
                    <h5 className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }>{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</h5>
                );
            }

            if ( populatedComponent.name === HyperComponent.H6 ) {
                return (
                    <h6 className={ 'app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }>{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</h6>
                );
            }

            if ( populatedComponent.name === HyperComponent.Paragraph ) {
                return (
                    <p className={ 'app-' + kebabCase( originalName ) }
                       style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }>{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</p>
                );
            }

            if ( populatedComponent.name === HyperComponent.Image ) {
                return (
                    <img
                        className={ 'app-' + kebabCase( originalName ) }
                        src={ isString( populatedComponent.meta?.source ) ? populatedComponent.meta?.source : '#' }
                        alt={ isString( populatedComponent.meta?.alt ) ? populatedComponent.meta?.alt : '' }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    />
                );
            }

            if ( populatedComponent.name === HyperComponent.Card ) {
                return (
                    <div
                        className={ 'hyper-card app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</div>
                );
            }

            if ( populatedComponent.name === HyperComponent.Accordion ) {
                return (
                    <div
                        className={ 'hyper-accordion app-' + kebabCase( originalName ) }
                        style={ populatedComponent.style ? StyleEntity.createFromDTO( populatedComponent.style ).getCssStyles() : {} }
                    >{
                        HyperRendererImpl.defaultRenderContent( renderer, content.content, definitions )
                    }</div>
                );
            }

        }

        if ( isString( content ) ) {
            return <>{ content }</>;
        }

        return <>{ JSON.stringify( content ) }</>;
    }

}
