#  MyFlix API
This is a REST API, deployed using Heroku, that provides access and functionality to a database hosted using MongoDB, which allows for viewing information related to movies, genres, and directors, and allows users on the client side of this API to register their own accounts, login and manage said accounts, and add or remove movies from their list of favorite movies.

## Using this API
This API is hosted through Heroku; any API endpoint calls are made through the following URL generated by Heroku:
* https://cinedata-05d7865bba09.herokuapp.com/

This API's endpoints are relatively straight forward: for example, appending `movies` to the end of the above URL will retrieve a full list of movies from the database. 
Appending a title to to the `movies` endpoint will retrieve information from a single movie. This same logic applies for the API's various other endpoints, such as `genres`, `directors`, and `users`. 
However, in order to use any of these endpoints, the user must first be authorized to do so, otherwise the user will only ever encounter the `401` 'Unauthorized' error code. 
Authorization can be attained by making an account through the `users` endpoint, and then logging in with the registered account. 
The simplest way of achieving this is creating an account through one of the client-side apps made for interfacing with this API.

## Links
* [Raw API Endpoint](https://cinedata-05d7865bba09.herokuapp.com/)
* [Client-side Application A - Cinedata](https://cinedata.netlify.app/)
* [Client-side Application B - Angular App](https://justin-yin-ly.github.io/myFlix-angular-client/)

## Dependencies
* CORS
* Express
* Mongoose
* Morgan
* Passport

A complete list of dependencies can be found in package-lock.json, found [here](https://github.com/justin-yin-ly/myFlix-api/blob/master/package-lock.json).
