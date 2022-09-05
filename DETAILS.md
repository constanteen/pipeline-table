# How does it work

We are fetching random user data from an API and populating the table with the data returned from the API call. 

When the HTML has been completely parsed, we call the startApp function. The function:
1. Makes an API call to fetch the table data from the website provided.
2. Adds event listeners to the buttons.
3. If we have a successful API call, the data received is transformed and populated in the table body. If the call wasn't successful, the table informs the user.

I created a few functions that handle specific actions in the app.ts.
1. fetchData makes the API calls and handles api call failure effectively.
2. getNextPage triggers the fetchData function to get the next page.
3. getPreviousPage triggers the fetchData function to get the previous page.
4. showLoader shows a loader when an API call is being made.
