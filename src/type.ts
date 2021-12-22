/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CookieSerializeOptions } from 'cookie';
import { BrowserStorageDriver } from './constants';

export interface BrowserStorageAdapterOptions {
    /**
     * Specify a key prefix.
     * e.g.
     *  namespace: auth
     *  key: token
     *  keyWithNamespace: auth_token
     */
    namespace?: string,
    /**
     * Enable or disable some of the available drivers.
     */
    driver?: {
        localStorage?: boolean,
        sessionStorage?: boolean,
        cookie?: boolean | CookieSerializeOptions
    },
    /**
     * Check if the application is
     * server rendered.
     */
    isServer?: () => boolean,

    /**
     * Append serialized cookie.
     * @param value
     */
    setServerCookie?: (value: string) => void,
    /**
     * Ger serialized cookie(s).
     */
    getServerCookies?: () => string
}

export type BrowserStorageDriverType = `${BrowserStorageDriver}`;
