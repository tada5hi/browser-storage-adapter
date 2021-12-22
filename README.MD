[![npm version](https://badge.fury.io/js/browser-storage-adapter.svg)](https://badge.fury.io/js/browser-storage-adapter)
[![CI](https://github.com/tada5hi/browser-storage-adapter/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/browser-storage-adapter/actions/workflows/main.yml)

# Browser Storage Adapter 💾
This is a library to save key-value pairs to one or multiple storages (e.g. SessionStorage, LocalStorage, Cookie, ...).

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)

## Installation

```bash
npm install browser-storage-adapter --save
```

## Usage

Create an instance of the BrowserStorageAdapter and specify the `driver`s,
which should be enabled. By default, all drivers are disabled, expect of the in-memory driver, which is always enabled.

Besides, it is also possible to specify a custom `namespace`, so different instances of the BrowserStorageAdapter don't interfere with each other, when they use the same key.

```typescript
import {BrowserStorageAdapter} from "./module";

const warehouse = new BrowserStorageAdapter({
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

---
**Important NOTE**

The `Readme.md` is still under construction ☂ at the moment. So please stay patient, till it is fully available ⭐.

---
