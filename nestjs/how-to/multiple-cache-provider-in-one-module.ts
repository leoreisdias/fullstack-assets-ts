/*
    This code demonstrates how to configure a cache module with multiple cache providers in a single module. 
    It uses cacheable to create in-memory stores with LRU and TTL support, and cache-manager to manage these stores. 
    Two providers are defined with different TTL and size configurations (KEY1_CACHE and KEY2_CACHE), 
    allowing the module to use distinct cache strategies as needed.
*/

import { createKeyv } from 'cacheable';
import { Cache, createCache } from 'cache-manager';

function makeCache(ttl: number, max: number): Cache {
  // cria um store em memória com LRU e TTL
  const keyvStore = createKeyv({ ttl, lruSize: max });
  return createCache({ stores: [keyvStore] });
}

const cacheProviders = [
  {
    provide: 'KEY1_CACHE',
    useFactory: () => makeCache(30_000, 500),
  },
  {
    provide: 'KEY2_CACHE',
    useFactory: () => makeCache(60_000, 200),
  },
];

@Module({
  providers: [
    ...cacheProviders,
  ],
  // ...
})
// ...