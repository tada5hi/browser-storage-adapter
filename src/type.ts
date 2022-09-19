/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CookieSerializeOptions } from 'cookie';
import { Driver } from './constants';

export interface AdapterOptions {
    /**
     * Specify a key prefix.
     * e.g.
     *  namespace: auth
     *  key: token
     *  keyWithNamespace: auth_token
     */
    namespace?: string,
    /**
     * Enable or disable some available drivers.
     */
    driver?: {
        localStorage?: boolean,
        sessionStorage?: boolean,
        cookie?: boolean | CookieSerializeOptions
    },
    /**
     * Check if the application is server rendered.
     */
    isServer?: () => boolean,

    /**
     * Set cookie.
     *
     * @param key
     * @param value
     */
    setCookie?: (key: string, value: unknown) => void,

    /**
     * Get cookie.
     *
     * @param key
     */
    getCookie?: (key: string) => unknown,

    /**
     * Append serialized cookie.
     *
     * @param value
     */
    setServerCookie?: (value: string) => void,
    /**
     * Ger serialized cookie(s).
     */
    getServerCookies?: () => string
}

export type DriverType = `${Driver}`;
