// Copyright (c) 2024. Sendanor <info@sendanor.fi>. All rights reserved.

import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LogLevel } from "../../../core/types/LogLevel";
import { AppServiceImpl } from "../../services/AppServiceImpl";
import {
    HyperView,
    HyperViewProps,
} from './HyperView';

jest.mock('react-helmet-async', () => {
    return {
        Helmet: jest.fn(),
    };
});

describe('HyperView Component', () => {
    const defaultProps: HyperViewProps = {
        name: 'ViewName',
        publicUrl: 'https://example.com',
        routePath: '/test',
        language: 'en',
    };

    beforeAll(() => {
        AppServiceImpl.setLogLevel(LogLevel.NONE);
        HyperView.setLogLevel(LogLevel.NONE);
    });

    it('renders without crashing', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/test']}>
                <HyperView {...defaultProps} />
            </MemoryRouter>
        );

        expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    });
});