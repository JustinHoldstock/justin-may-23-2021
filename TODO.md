# Orderbook TODO
- Service for websocket interaction
  - connect
  - close
  - retry
- Store for data
  - [price, size][]

  - handle errors gracefully
    - connection error
    - update error
  - empty entry means delete entry
    - size of 0
    - otherwise you can safely overwrite the state of that price level with new data returned by that delta.
  - remember, this is deltas
- Display
    - price
    - size
    - total
- +/- buttons for grouping orders by price

Notes:
- Don't mention the name
- README on how to run
- Tests
- responsive
- Questions.MD for technical Qs
- pause stream on tab navigation
- only update total is previous has changed
