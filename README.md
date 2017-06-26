# when

```
>> node index.js API_KEY '1730 Minor Ave' '1101 Dexter Ave N'
{ destination_addresses: [ '1101 Dexter Ave N, Seattle, WA 98109, USA' ],
  origin_addresses: [ '1730 Minor Ave, Seattle, WA 98101, USA' ],
  rows:
   [ { elements:
        [ { distance: { text: '2.3 km', value: 2295 },
            duration: { text: '8 mins', value: 451 },
            duration_in_traffic: { text: '8 mins', value: 473 },
            status: 'OK' } ] } ],
  status: 'OK' }
```
