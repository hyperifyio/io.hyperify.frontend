// Copyright (c) 2023. Sendanor <info@sendanor.fi>. All rights reserved.

import { ObserverCallback, ObserverDestructor } from "../../core/Observer";
import { Disposable } from "../../core/types/Disposable";

export enum AppServiceEvent {

    /**
     * Triggered when app's definitions URL have been changed
     */
    APP_URL_UPDATED = "HyperService:appUrlUpdated",

    /**
     * Triggered when app's definitions have been changed
     */
    APP_DEFINITIONS_UPDATED = "HyperService:appDefinitionsUpdated",

    /**
     * Can be triggered to update the app's state
     */
    UPDATE_APP = "HyperService:updateApp",

    /**
     * Can be triggered to update a view's state
     */
    UPDATE_VIEW = "HyperService:updateView",

    /**
     * Triggered when the view is activated
     */
    ACTIVATE_VIEW = "HyperService:activateView",

    /**
     * Triggered when the view is deactivated
     */
    DEACTIVATE_VIEW = "HyperService:deactivateView",

}

export type AppServiceDestructor = ObserverDestructor;

/**
 * Service which keeps track of state of the Hyper frontend components on the
 * frontend side.
 *
 * This interface describes the static public interface for the `HyperServiceImpl`.
 */
export interface AppServiceType extends Disposable {

    /**
     *
     */
    Event : AppServiceEvent;

    /**
     *
     * @param name
     * @param callback
     */
    on (
        name: AppServiceEvent,
        callback: ObserverCallback<AppServiceEvent>
    ): AppServiceDestructor;

    /**
     *
     * @param name
     */
    updateApp (name : string) : void;

    /**
     *
     * @param name
     */
    updateView (name : string) : void;

    /**
     *
     * @param name
     */
    activateView (name : string) : void;

    /**
     *
     * @param name
     */
    deactivateView (name : string) : void;

    /**
     * Returns `true` if the view by name is active.
     *
     * @param name
     */
    isViewActive (name : string) : boolean;

    setUrl (url: string) : void;
    getUrl () : string | undefined;
    unsetUrl () : void;

}
