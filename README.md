# Restaurant Reviews Project Stage 3
## Project Overview: 

 For the **Restaurant Reviews** project, I convert a static webpage to a mobile-ready web application.
 
 I am take a static design that lacks accessibility and I convert the design to be responsive on different sized displays and accessible for screen reader use.
 I also add a service worker to begin the process of creating a seamless offline experience for your users.
 
 The website retrieves data about restaurants from a server.

 The restaurant's data contain rating information about restaurants.

 The data main structure and images of the website is persisted in `cache` using a `service worker` and the restaurant information/list is stored in `indexedDB` to achieve a good Offline first experience. Furthermore, the design is responsive, to adjust properly in most/all screen displays. And finally, optimizations have been done based on results from `lighthouse` to ensure high score of accessibility, Optimization and Progressive Web App.


### you can do the following in this project :-

* you can filter some resturants according to some features
* see the review each restaurant
* see the address of the resturant
* see the Work schedule in the restaurant weekly
* if you are blind no problem, you can access the website via google chrome extention chromeVox
* mark your favorite restaurants
* add your review on restaurant online or offline


### In this Project I used:-

* Service-Worker to make the website work offline
* Aria roles to get the website accessabile to blind people
* Google map application to mark all needed restaurants on it
* Indexed DataBase to store date retrived from the server

## Architecture
Local server
- Node.js
- Sails.js

## Install

you need to install :-

* python2 or python3 on your computer
* webbrowser on your pc

## Install NodeJs Server 

1- open project directory on terminal <br/>
2- install node modules by run this `npm i` <br/>
3- install sails global by run this `sudo npm i sails -g` <br/>

## How to run backend server

1- run your backend-server by run `node server` <br />

### You should now have access to your API server environment
debug: Environment : development
debug: Port        : 1337

#### Get all restaurants
```
http://localhost:1337/restaurants/
```

#### Get favorite restaurants
```
http://localhost:1337/restaurants/?is_favorite=true
```

#### Get a restaurant by id
```
http://localhost:1337/restaurants/<restaurant_id>
```

#### Get all reviews for a restaurant
```
http://localhost:1337/reviews/?restaurant_id=<restaurant_id>
```

#### Get all restaurant reviews
```
http://localhost:1337/reviews/
```

### Get a restaurant review by id
```
http://localhost:1337/reviews/<review_id>
```

### Get all reviews for a restaurant
```
http://localhost:1337/reviews/?restaurant_id=<restaurant_id>
```

#### Create a new restaurant review
```
http://localhost:1337/reviews/
```

###### Parameters
```
{
	"name": <reviewer_name>,
    "restaurant_id": <restaurant_id>,
    "rating": <rating>,
    "comments": <comment_text>
}
```

## How to run the project
1- open project directory on terminal <br/>
2- run your backend-server by run `node server` <br />
3- open another terminal on the same directory of project <br />
4- in the new terminal run client-side server `python3 -m http.server 8000` <br />
5- To see the project in the client-server open <http://localhost:8000>

