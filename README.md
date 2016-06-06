# Falcon Social Assignment

## Getting started

Install the Node dependencies and run the server:

```bash
$ npm install
$ node app.js
```

Then visit [localhost:3000/app/](http://localhost:3000/app/) on your browser to see the client app.

## Future work

+ Use a proper database, not in-memory storage
+ Restructure Reach API to have only one timestamp per object
+ Add `id` field to reach elements to be able to read/update/delete in a better way (as opposed to the current
  index implementation), as well as keep DELETE operations idempotent
+ Add PATCH support for partial updates
+ Add testing to both backend and frontend
+ Add support for HTML5 routing
+ Separate JS code into modules and controllers, etc., then add Gulp workflow to concatenate all files
+ Display notifications in a better way
+ Standardize API naming convention (`snake_case` vs `camelCase`)
+ Add a proper way to handle comma-separated tags like Select2
+ Optimize processing Reach items to avoid doing several passes to retrieve graph domains
+ Add a tooltip to Reach graph, as well as a proper legend
