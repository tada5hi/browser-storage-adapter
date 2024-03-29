# Browser Storage Adapter 💾

[![npm version](https://badge.fury.io/js/browser-storage-adapter.svg)](https://badge.fury.io/js/browser-storage-adapter)
[![CI](https://github.com/tada5hi/browser-storage-adapter/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/browser-storage-adapter/actions/workflows/main.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/Tada5hi/browser-storage-adapter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Tada5hi/browser-storage-adapter?targetFile=package.json)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)


This is a library to save key-value pairs to one or multiple storages (e.g. SessionStorage, LocalStorage, Cookie, ...).

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)

## Installation

```bash
npm install browser-storage-adapter --save
```

## Usage

Create an instance of the `Adapter` and specify the `driver`s,
which should be enabled. By default, all drivers are disabled, expect of the in-memory driver, which is always enabled.

Besides, it is also possible to specify a custom `namespace`, so different instances of the Adapter don't interfere with each other, when they use the same key.

```typescript
import { Adapter } from 'browser-storage-adapter';

const warehouse = new Adapter({
    driver: {
        cookie: {
            path: '/',
        },
        localStorage: true,
        sessionStorage: true,
    },
    namespace: 'auth'
});

// Set a key-value pair for the following drivers:
// cookie, localStorage & sessionStorage.
warehouse.set('token', 'xxx');

// Ensure that value is still the same for all drivers.
warehouse.sync('token', 'xxx');

// Get a key-value pair.
const token = warehouse.get('token');
console.log(token);
// xxx
```

## Options

The Adapter accepts an `OptionsInput` object as input parameter, to modify the default behaviour.

````typescript
import { CookieSerializeOptions } from 'cookie';

declare type OptionsInput = {
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
````
