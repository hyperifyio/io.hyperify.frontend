// Copyright (c) 2023. Sendanor <info@sendanor.fi>. All rights reserved.

import { render } from '@testing-library/react';
import { HyperActionButton } from './HyperActionButton';

describe('HyperActionButton', () => {
    it('renders without crashing', () => {
        const { container } = render(<HyperActionButton />);
        expect(container.firstChild).toBeInstanceOf(HTMLElement);
    });
});
