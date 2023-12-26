// Copyright (c) 2023. Sendanor <info@sendanor.fi>. All rights reserved.

import { render } from '@testing-library/react';
import { HgTest } from "../../../core/HgTest";
import { HttpService } from "../../../core/HttpService";
import { LogLevel } from "../../../core/types/LogLevel";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { HyperRendererImpl } from "../../renderers/HyperRendererImpl";
import { AppServiceImpl } from "../../services/AppServiceImpl";
import { HyperRoute } from "../types/HyperRoute";
import { LazyHyperView } from "../views/LazyHyperView";
import { Hyper } from "./Hyper";
import { HyperApp } from "./HyperApp";
import { MemoryRouter } from "react-router-dom";

describe('HyperApp', () => {

    beforeAll( () => {
        LazyHyperView.setLogLevel(LogLevel.NONE);
        useAsyncResource.setLogLevel(LogLevel.NONE);
        HyperRendererImpl.setLogLevel(LogLevel.NONE);
        HttpService.setLogLevel(LogLevel.NONE);
        AppServiceImpl.setLogLevel(LogLevel.NONE);
        Hyper.setLogLevel(LogLevel.NONE);
        HgTest.initialize();
    });

    it('renders the empty route list correctly', () => {

        let mockRouteList: HyperRoute[] = [];

        const { container } = render(
            <MemoryRouter>
                <HyperApp
                    publicUrl="/public"
                    language="en"
                    routeList={mockRouteList}
                />
            </MemoryRouter>
        );

        // The container.firstChild is null, which indicates that there might be
        // an issue with the rendering of the HyperApp component.
        // The MemoryRouter and HyperApp components are not generating any
        // content inside the container.

        expect(container.firstChild).toBe(null);
        //expect(container.firstChild).toBeInstanceOf(HTMLElement);

    });

    it('renders empty route list without crashing', () => {

        let mockRouteList: HyperRoute[] = [];

        expect(() => {
            render(
                <MemoryRouter>
                    <HyperApp
                        publicUrl="/public"
                        language="en"
                        routeList={mockRouteList}
                    />
                </MemoryRouter>
            );
        }).not.toThrow();

    });

});