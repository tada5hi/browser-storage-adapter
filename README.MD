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

---
**Important NOTE**

The `README.md` file is under construction ☂ at the moment. So please stay patient or contribute to it, till it covers all parts ⭐.

---

## Usage

Create an instance of the `Adapter` and specify the `driver`s,
which should be enabled. By default, all drivers are disabled, expect of the in-memory driver, which is always enabled.

Besides, it is also possible to specify a custom `namespace`, so different instances of the Adapter don't interfere with each other, when they use the same key.

```typescript
import {
    Adapter,
    AdapterOptions
} from "browser-storage-adapter";

const options: AdapterOptions = {
    driver: {
        cookie: {
            path: '/',
        },
        localStorage: true,
        sessionStorage: true,
    },
    namespace: 'auth'
};

const warehouse = new Adapter(options);

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
