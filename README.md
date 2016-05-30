# Falcon Social Assignment

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
