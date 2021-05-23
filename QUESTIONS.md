1. What would you add to your solution if you had more time? 

- Value bar to sit behind the totals. I was initially going to use a table layout, but I wanted to try 
using grid layout to try something new. After inspecting the example, I see you also used grid.
- Hover for rows.
- Loading state for when starting up/restarting socket connection
- Tab navigation pauses the socket stream
- Cypress tests and switch to use Jest (Using out of the box Jasmine... ew). Note that I didn't do any UI tests bc I wanted to avoid touching potentially flakey snapshot tests. Cypress should be used for testing ui.
-  Side note 2: Spent some time in the afternoon of day two to revisit, near the end I realized that when stacked, asks sort Descending. I'd like to do that to give the nice graph comparison.
- More unit tests. I got hung up and frustrated with some of the service ones. Jasmine wasn't behaving for a few of them.

2. What would you have done differently if you knew this page was going to get thousands of views per second vs per week? 

Assuming this is something that would go into production, I'd 
- put this page behind a login page. We can slow down extreme amounts of traffic by filtering out users that aren't real people with an account.
- probably make use of a service worker to cache some of the bundle. (Would want to know metrics on single visit users VS frequent, and app load times)
- put in a piece of UI that allows the user to control how often updates are applied (Right now we're buffering for 150ms between updates)
- Look at why dips down to 67fps occur, and how we can make these even more performant

3. What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it. 

- I haven't made use of it yet, but marking destructured variables as unused can sometimes be very useful when making sure that callback function signatures 
contain typing/more information about the parameters being passed, regardless of being used. Maintenance can be improved, through this, because future developers
will not have to look at the calling function to determine the params being passed, and can instead look at the callback param signature. 

Example:
```
// If the caller intends to not use the params, you usually see the following since TS will complain of unused variables if you do put them in.
// This makes it look like the stream never emits any useful data!
someObservable$.subscribe({
    next: () => foo()
})

// What we get here is something slightly more maintainable
// Now we can see that there is an object containing two params, a future developer can use them AND TS isn't going to complain at us
someObservable$.subscribe({
    next: ({_bar, _baz}) => foo()
})
```

4. How would you track down a performance issue in production? Have you ever had to do this?

- Run Chrome profiler against the page to determine where exactly slowdowns are occurring, letting run over a small period of time to collect profiling info (~2-3 minutes)

5. Can you describe common security concerns to consider for a frontend developer?

- Cross site scripting. Can anything be injected via the websocket to collect user info, or execute any code on the client?
- Tab hijacking (IIRC that's what it's called). Opening a new tab without making use of rel=noopener can allow for cross site attacks to occur.
Note: upon testing some of this right now, it might look like Chrome has done some work to prevent this.
- Are you making use of long lived (or worse, immortal) tokens that can be nabbed and used by others, or are they shortlived? Can the token be remotely expired? How are you store that?

6. How would you improve the Kraken API that you just used? 

- I like to work with named JSON props over tuples, but understandably we want a small payload, so tuples suffice.
- Timestamp. I'd like to know if there's any other buffering/stale checks we can put in place to not allow old data through.
