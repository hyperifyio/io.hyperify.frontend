// Copyright (c) 2023-2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { HgTest } from "../../../core/HgTest";
import { HttpService } from "../../../core/HttpService";
import { LogLevel } from "../../../core/types/LogLevel";
import { HyperRenderer } from "../../renderers/HyperRenderer";
import { HyperRendererImpl } from "../../renderers/HyperRendererImpl";
import { AppServiceImpl } from "../../services/AppServiceImpl";
import { LazyHyperView } from "../views/LazyHyperView";
import { Hyper } from "./Hyper";

jest.mock('react-helmet-async', () => {
    return {
        Helmet: jest.fn(),
    };
});

describe('Hyper Component', () => {

    let mockRenderer : HyperRenderer;

    beforeAll( () => {
        LazyHyperView.setLogLevel(LogLevel.NONE);
        HyperRendererImpl.setLogLevel(LogLevel.NONE);
        HttpService.setLogLevel(LogLevel.NONE);
        AppServiceImpl.setLogLevel(LogLevel.NONE);
        Hyper.setLogLevel(LogLevel.NONE);
        HgTest.initialize();

        mockRenderer = {
            getFragmentId: jest.fn<any>(),
            getPublicUrl: jest.fn<any>(),
            attachAppRenderer: jest.fn<any>(),
            renderApp: jest.fn<any>(),
            attachRouteRenderer: jest.fn<any>(),
            renderRoute: jest.fn<any>(),
            renderRouteList: jest.fn<any>(),
            renderView: jest.fn<any>(),
            renderContent: jest.fn<any>(),
        };

    });

    describe('Hyper Component', () => {

        it('renders without crashing', () => {

            (mockRenderer.renderApp as ReturnType<typeof jest.fn<any>>).mockReturnValue(<div />);

            const { container } = render(
                <MemoryRouter>
                    <Hyper url={'https://localhost:3000/api/v1'} renderer={mockRenderer} />
                </MemoryRouter>
            );

            expect(mockRenderer.renderApp).toHaveBeenCalledWith(
                expect.objectContaining({
                    language : "en",
                    name : "LoadingApp",
                    publicUrl : "",
                    components: expect.arrayContaining([
                        expect.objectContaining({
                            "content" : [],
                            "extend" : "fi.nor.article",
                            "name" : "TextComponent",
                        }),
                    ]),
                    routes: expect.arrayContaining([
                        expect.objectContaining({
                            "name" : "LoadingRoute",
                            "path" : "/",
                            "view" : "LoadingView",
                        }),
                        expect.objectContaining({
                            "name" : "AnyRoute",
                            "path" : "*",
                            "redirect" : "LoadingRoute",
                        }),
                    ]),
                    views: expect.arrayContaining([
                        expect.objectContaining({
                            "name" : "DefaultView",
                            "style" : {
                                "background" : { "color" : { "value" : "#222222" } },
                                "textColor" : { "value" : "#ffffff" },
                            },
                        }),
                        expect.objectContaining({
                            "content" : expect.arrayContaining([
                                expect.objectContaining({
                                    "content" : [ "...loading..." ],
                                    "extend" : "TextComponent",
                                    "name" : "loadingText",
                                }),
                            ]),
                            "extend" : "DefaultView",
                            "name" : "LoadingView",
                        }),
                    ])
                })
            );

            expect(container.firstChild).toBeInstanceOf(HTMLElement);

        });
    });
});