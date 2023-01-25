/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { CookieSerializeOptions, parse as parseCookie, serialize as serializeCookie } from 'cookie';
import { DriverType, Options, OptionsInput } from './type';
import {
    buildOptions,
    decodeValue,
    encodeValue,
    isSet,
    isUnset,
} from './utils';
import { Driver } from './constants';

export class Adapter {
    public readonly options: Options;

    protected state : Record<string, any> = {};

    constructor(options: OptionsInput) {
        this.options = buildOptions(options);

        this.initState();
    }

    // ------------------------------------

    getKeyWithNamespace(key: string) : string {
        let keyWithNamespace = '';

        if (typeof this.options.namespace !== 'undefined') {
            keyWithNamespace += `${this.options.namespace}_`;
        }

        return keyWithNamespace + key;
    }

    // ------------------------------------

    // ------------------------------------
    // Universal
    // ------------------------------------

    set(key: string, value: any) {
        // Unset null, undefined
        if (isUnset(value)) {
            return this.remove(key);
        }

        this.setState(key, value);

        this.setCookie(key, value);

        this.setLocalStorageItem(key, value);

        this.setSessionStorageItem(key, value);

        return value;
    }

    get(key: string) {
        let value : any = this.getState(key);

        // Cookies
        if (isUnset(value)) {
            value = this.getCookie(key);
        }

        // Local Storage
        if (isUnset(value)) {
            value = this.getLocalStorageItem(key);
        }

        // Session Storage
        if (isUnset(value)) {
            value = this.getSessionStorageItem(key);
        }

        if (isUnset(value)) {
            value = this.getState(key);
        }

        return value;
    }

    getAll() {
        let value : any = {};
        let storageValue : any;

        storageValue = this.getCookies();
        if (storageValue) {
            value = { ...value, ...storageValue };
        }

        storageValue = this.getLocalStorageItems();
        if (storageValue) {
            value = { ...value, ...storageValue };
        }

        storageValue = this.getSessionStorageItems();
        if (storageValue) {
            value = { ...value, ...storageValue };
        }

        return value;
    }

    sync(key: string, defaultValue?: any) {
        let value = this.get(key);

        if (isUnset(value) && isSet(defaultValue)) {
            value = defaultValue;
        }

        if (isSet(value)) {
            this.set(key, value);
        }

        return value;
    }

    remove(key: string) {
        this.removeState(key);
        this.removeSessionStorageItem(key);
        this.removeLocalStorageItem(key);
        this.removeCookie(key);
    }

    // ------------------------------------
    // State
    // ------------------------------------

    initState() {
        if (this.options.isServer()) {
            return;
        }

        this.state = {};
    }

    setState<T>(key: string, value: T) {
        if (this.options.isServer()) {
            return;
        }

        this.state[key] = value;
    }

    getState(key: string) {
        if (this.options.isServer()) {
            return undefined;
        }

        return this.state[key];
    }

    removeState(key: string) {
        this.setState(key, undefined);
    }

    // ------------------------------------
    // Browser Storage
    // ------------------------------------

    getBrowserStorageItems(type: DriverType) : Record<string, any> {
        let storage : any;
        switch (type) {
            case Driver.SESSION_STORAGE:
                storage = sessionStorage;
                break;
            case Driver.LOCAL_STORAGE:
                storage = localStorage;
                break;
        }

        if (
            typeof storage === 'undefined' ||
            !this.options.driver[type]
        ) {
            return {};
        }

        const items : Record<string, any> = {};
        const keys = Object.keys(storage);
        let i = keys.length;

        while (i--) {
            let key = keys[i];
            if (typeof this.options.namespace !== 'undefined') {
                if (key.slice(0, this.options.namespace.length) !== this.options.namespace) {
                    continue;
                }

                key = key.replace(`${this.options.namespace}_`, '');
            }

            items[key] = decodeValue(storage.getItem(keys[i]));
        }

        return items;
    }

    // ------------------------------------
    // Local storage
    // ------------------------------------

    setLocalStorageItem(key: string, value: any) : void {
        // Unset null, undefined
        if (isUnset(value)) {
            this.removeLocalStorageItem(key);
            return;
        }

        if (typeof localStorage === 'undefined' || !this.options.driver.localStorage) {
            return;
        }

        const keyFull = this.getKeyWithNamespace(key);

        localStorage.setItem(keyFull, encodeValue(value));
    }

    getLocalStorageItem(key: string) : any {
        if (
            typeof localStorage === 'undefined' ||
            !this.options.driver.localStorage
        ) {
            return undefined;
        }

        const keyFull = this.getKeyWithNamespace(key);

        const value = localStorage.getItem(keyFull);

        return decodeValue(value);
    }

    getLocalStorageItems() : any {
        return this.getBrowserStorageItems(Driver.LOCAL_STORAGE);
    }

    removeLocalStorageItem(key: string) {
        if (
            typeof localStorage === 'undefined' ||
            !this.options.driver.localStorage
        ) {
            return;
        }

        const keyWithNamespace = this.getKeyWithNamespace(key);
        localStorage.removeItem(keyWithNamespace);
    }

    // ------------------------------------
    // Session storage
    // ------------------------------------

    setSessionStorageItem(key: string, value: any) : any {
        // Unset null, undefined
        if (isUnset(value)) {
            this.removeSessionStorageItem(key);
            return;
        }

        if (
            typeof sessionStorage === 'undefined' ||
            !this.options.driver.sessionStorage
        ) {
            return;
        }

        const keyWithNamespace = this.getKeyWithNamespace(key);

        sessionStorage.setItem(keyWithNamespace, encodeValue(value));
    }

    getSessionStorageItem(key: string) {
        if (
            typeof sessionStorage === 'undefined' ||
            !this.options.driver.sessionStorage
        ) {
            return undefined;
        }

        const keyWithNamespace = this.getKeyWithNamespace(key);

        const value = sessionStorage.getItem(keyWithNamespace);

        return decodeValue(value);
    }

    getSessionStorageItems() : any {
        return this.getBrowserStorageItems(Driver.SESSION_STORAGE);
    }

    removeSessionStorageItem(key: string) {
        if (
            typeof sessionStorage === 'undefined' ||
            !this.options.driver.sessionStorage
        ) {
            return;
        }

        const keyWithNamespace = this.getKeyWithNamespace(key);
        sessionStorage.removeItem(keyWithNamespace);
    }

    // ------------------------------------
    // Cookies
    // ------------------------------------
    getCookies() {
        const isServer = this.options.isServer();

        const cookieStr = isServer ?
            (this.options.getServerCookies ? this.options.getServerCookies() : '') :
            document.cookie;

        const items : Record<string, any> = decodeValue(parseCookie(cookieStr || '') || {});
        const keys = Object.keys(items);
        for (let i = 0; i < keys.length; i++) {
            items[keys[i]] = decodeValue(decodeURIComponent(items[keys[i]]));
        }

        return items;
    }

    setCookie(key: string, value: any) {
        if (!this.options.driver.cookie) {
            return;
        }

        if (typeof this.options.setCookie === 'function') {
            this.options.setCookie(key, value);
            return;
        }

        const keyWithNamespace = this.getKeyWithNamespace(key);
        const options = <CookieSerializeOptions> ({
            ...(typeof this.options.driver.cookie === 'boolean' ? {} : this.options.driver.cookie),
        });

        const valueEncoded = encodeValue(value);

        // Unset null, undefined
        if (isUnset(value)) {
            options.maxAge = -1;
        }

        const serializedCookie = serializeCookie(keyWithNamespace, valueEncoded, options);

        const isServer = this.options.isServer();
        if (isServer) {
            if (typeof this.options.setServerCookie !== 'undefined') {
                this.options.setServerCookie(serializedCookie);
            }
        } else if (this.options.setServerCookie) {
            // Set in browser
            document.cookie = serializedCookie;
        }
    }

    getCookie(key: string) {
        if (
            !this.options.driver.cookie
        ) {
            return undefined;
        }

        if (typeof this.options.getCookie === 'function') {
            return this.options.getCookie(key);
        }

        const keyFull = this.getKeyWithNamespace(key);

        const cookies = this.getCookies();

        return cookies[keyFull] ?? undefined;
    }

    removeCookie(key: string) {
        this.setCookie(key, undefined);
    }
}
