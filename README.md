# Falcon Social Assignment

## Getting started

Install the Node dependencies and run the server:

```bash
$ npm install
$ node app.js
```

Then visit [localhost:3000/app/](http://localhost:3000/app/) on your browser to see the client app.

If you modify the LESS files, please run this from the `client` directory to compile them:

```bash
$ gulp less
```

## Future work

+ Add testing to both backend and frontend

### Backend

+ Use a proper database, not in-memory storage
+ Restructure Reach API to have only one timestamp per object
+ Add `id` field to reach elements to be able to read/update/delete in a better way (as opposed to the current
  index implementation), as well as keep DELETE operations idempotent
+ Add PATCH support for partial updates
+ Standardize API naming convention (`snake_case` vs `camelCase`)
+ Modularize API server

### Frontend

+ Add support for HTML5 routing
+ Separate JS code into modules and controllers, etc., then add Gulp workflow to concatenate all files
+ Display notifications in a better way
+ Add a proper way to handle comma-separated tags like Select2
+ Optimize processing Reach items to avoid doing several passes to retrieve graph domains
+ Add a tooltip to Reach graph, as well as a proper legend
+ Add `input[type=date]` and `input[type=time]` directives for browsers that don't support native controls
+ Make views fully responsive
+ Remove Bootstrap classes from DOM, use `@extend`
+ Add watch task to Gulpfile to automatically compile LESS
+ Create directives to better handle transforming API models to compatible ng-model representations and back
+ Migrate to SASS
