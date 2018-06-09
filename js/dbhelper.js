//import * as idb from '../node_modules/idb';
/**
 * Common database helper functions.
 */

class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */

  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }
  // db for review
  static get DATABASE_URL_reviews() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/reviews`;
  }

  // using indexed db
  static initIndexedDB() {
    this.dbPromise = idb.open('restaurant-db', 1, function (upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
        case 1:
        case 2:
          const restaurantStore = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id',
            autoIncrement: true
          });
          restaurantStore.createIndex('photographs', 'photograph');
      }
    });
  }

  //Fetch restaurants from indexed database
  static fetchRestaurantsFromIndexedDb() {
    return this.dbPromise.then(function (db) {
      var tx = db.transaction(['restaurants']);
      var restaurantsStore = tx.objectStore('restaurants');
      return restaurantsStore.getAll();
    })
  }
  // Fetch all restaurants.
  static fetchRestaurants(callback) {
    var self = this;
    DBHelper.fetchRestaurantsFromIndexedDb().then((restaurants) => {
      //console.log(restaurants);
      callback(null, restaurants);
    });

    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        var restaurants = JSON.parse(xhr.responseText);

        restaurants.map(function (restaurant) {
          let xhr_rev = new XMLHttpRequest();
          xhr_rev.open(
            'GET', DBHelper.DATABASE_URL_reviews+'/?restaurant_id='+restaurant.id);
          xhr_rev.onload = () => {
            const reviews = JSON.parse(xhr_rev.responseText);
            restaurant.reviews = reviews;
            self.dbPromise.then(function (db) {
              var tx = db.transaction(['restaurants'], 'readwrite');
              var restaurantStore = tx.objectStore('restaurants');
              //console.log(restaurant);
              return restaurantStore.put(restaurant);
            });
          }
          xhr_rev.send();
          return restaurant;
        });
        callback(null, restaurants);
      } else {
        // Oops!. Got an error from server.
        this.dbPromise.then(() => {
          return DBHelper.fetchRestaurantsFromIndexedDb();
        }).then(function (restaurants) {
          callback(null, restaurants);
        }).catch(function () {
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        });
      }
    };
    xhr.onerror = function () {
      DBHelper.fetchRestaurantsFromIndexedDb().then((restaurants) => {
        callback(null, restaurants);
      });
    }
    xhr.send();
  }

  // Fetch restaurant by Id from indecedDB
  static fetchRestaurantFromIndexedDb(id) {
    return this.dbPromise.then(function (db) {
      var tx = db.transaction(['restaurants'], 'readwrite');
      var restaurantsStore = tx.objectStore('restaurants');
      return restaurantsStore.get(parseInt(id));
    })
  }

  // update restaurant to be favorite
  static update_fav_true(id) {
    var data = {};
    data.is_favorite = true;
    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", DBHelper.DATABASE_URL + '/' + id);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
      var restaurant = JSON.parse(xhr.responseText);
      console.log(restaurant);
    }
    xhr.send(json);
  }

  // update restaurant to be not favorite
  static update_fav_false(id) {
    var data = {};
    data.is_favorite = false;
    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", DBHelper.DATABASE_URL + '/' + id);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
      var restaurant = JSON.parse(xhr.responseText);
      console.log(restaurant);
    }
    xhr.send(json);   
  }

  static kkk(Json_data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", DBHelper.DATABASE_URL_reviews, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(Json_data);
  }

  //add new review
  static addNewReview(name, res_id, rate, comment) {
    var self = this;
    var data = {};
    data.restaurant_id = res_id;
    data.name = name;
    data.rating = rate;
    data.comments = comment;
    var json = JSON.stringify(data);
    console.log(self.Json_data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", DBHelper.DATABASE_URL_reviews, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
      if (xhr.status === 200) { // Got a success response from server!
        var review = JSON.parse(xhr.responseText);
      } else { // Oops!. Got an error from server.
        self.dbPromise.then(() => {
          return DBHelper.fetchRestaurantFromIndexedDb(res_id)
        }).then(function (restaurant) {
          console.log(restaurant);
          restaurant.reviews.push(json);
          console.log(restaurant.reviews);
          self.dbPromise.then(function (db) {
            var tx = db.transaction(['restaurants'], 'readwrite');
            var restaurantStore = tx.objectStore('restaurants');
            return restaurantStore.put(restaurant);
          });
        });
      }
    };

    xhr.onerror = function () {
      DBHelper.fetchRestaurantFromIndexedDb(res_id).then((restaurant) => {
        restaurant.reviews.push(data);
        self.dbPromise.then(function (db) {
          var tx = db.transaction(['restaurants'], 'readwrite');
          var restaurantStore = tx.objectStore('restaurants');
          return restaurantStore.put(restaurant);
        }).then(() => {
          alert("You are Working offline");
        }).then(() => {
          DBHelper.kkk(json);
        });
      });
    }
    xhr.send(json);
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    var self = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL + '/?id=' + id);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        var restaurant = JSON.parse(xhr.responseText);
        let xhr_rev = new XMLHttpRequest();
        xhr_rev.open(
          'GET', DBHelper.DATABASE_URL_reviews+'/?restaurant_id='+restaurant.id);
        xhr_rev.onload = () => {
          const Reviews = JSON.parse(xhr_rev.responseText);
          restaurant.reviews = Reviews;
          self.dbPromise.then(function (db) {
            var tx = db.transaction(['restaurants'], 'readwrite');
            var restaurantStore = tx.objectStore('restaurants');
            //console.log(restaurant);
            return restaurantStore.put(restaurant);
          });
          callback(null, restaurant);
        }
        xhr_rev.send();
      } else {
        // Oops!. Got an error from server.
        this.dbPromise.then(() => {
          return DBHelper.fetchRestaurantFromIndexedDb(id)
        }).then(function (restaurant) {
          callback(null, restaurant);
        }).catch(function () {
          const error = (`Request failed. Returned status of ${xhr.status}`);
          callback(error, null);
        });
      }
    };

    xhr.onerror = function () {
      DBHelper.fetchRestaurantFromIndexedDb(id).then(function (restaurant) {
        callback(null, restaurant);
      });
    }
    xhr.send();
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * add review page URL.
   */
  static urlForAddReview() {
    return (`./addReview.html`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    if(restaurant.photograph === undefined) {
      return (`/img/1.webp`);
    }
    return (`/img/${restaurant.photograph}.webp`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }
}

