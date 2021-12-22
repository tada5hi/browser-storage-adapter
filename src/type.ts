/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CookieSerializeOptions } from 'cookie';
import { BrowserStorageDriver } from './constants';

export interface BrowserStorageAdapterOptions {
    namespace?: string,
    driver: {
        localStorage?: boolean,
        sessionStorage?: boolean,
        cookie?: boolean | CookieSerializeOptions
    },
    isServer: () => boolean,

    /**
     * Append serialized cookie.
     * @param value
     */
    setServerCookie?: (value: string) => void,
    getServerCookie?: (key: string) => any,
    /**
     * Ger serialized cookie(s).
     */
    getServerCookies?: () => string
}

export type BrowserStorageDriverType = `${BrowserStorageDriver}`;
