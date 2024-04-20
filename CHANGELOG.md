# Changelog

## 1.3.1

Added logger support
Display logs for when there is a cache hit/miss

## 1.4.0

Added Redis support

```
1000 read calls:
┌───────────────┬─────────────┐
│ (index)       │ time /s     │
├───────────────┼─────────────┤
│ Without cache │ 33.40269425 │
│ LruMap cache  │ 0.526350459 │
│ Memcached     │ 0.754067375 │
│ Redis cache   │ 0.73430575  │
└───────────────┴─────────────┘
1000 read and write calls:
┌───────────────┬───────────────┐
│ (index)       │ time /s       │
├───────────────┼───────────────┤
│ Without cache │ 165.2826605   │
│ LruMap cache  │ 167.263781167 │
│ Memcached     │ 168.440738    │
│ Redis cache   │ 168.158786125 │
└───────────────┴───────────────┘
```
