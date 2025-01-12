'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}M people</p>
      <p class="country__row"><span>🗣️</span>${
        Object.entries(data.languages)[0][1]
      }</p>
      <p class="country__row"><span>💰</span>${
        Object.entries(data.currencies)[0][1].name
      }</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderErr = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};
countriesContainer.style.opacity = 1;

// Helper function
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};
/*
///////////////////////////////////////
// First AJAX Call: XMLHttpRequest

const getCountryData = function (country) {
  const req = new XMLHttpRequest();
  req.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  req.send();

  req.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
        <article class="country">
          <img class="country__img" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${
              Object.entries(data.languages)[0][1]
            }</p>
            <p class="country__row"><span>💰</span>${
              Object.entries(data.currencies)[0][1].name
            }</p>
          </div>
        </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('Kenya');
getCountryData('Denmark');
getCountryData('Sweden');
getCountryData('Germany');
getCountryData('portugal');
getCountryData('usa');

const getCountryAndNeighbour = function (country) {
  // AJAX Call country 1
  const req = new XMLHttpRequest();
  req.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  req.send();

  req.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country (1) (HTML)
    renderCountry(data);

    // Get neighbor country (2)
    const neighbour = data.borders;

    if (!neighbour) return;

    // AJAX Call country 2
    neighbour.forEach(neighbour => {
      const req2 = new XMLHttpRequest();
      req2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
      req2.send();

      req2.addEventListener('load', function () {
        const [data2] = JSON.parse(this.responseText);
        console.log(data2);

        renderCountry(data2, 'neighbour');
      });
    });
  });
};

// getCountryAndNeighbour('Denmark');
getCountryAndNeighbour('Germany');

// Callback hell
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 seconds passed');
    setTimeout(() => {
      console.log('3 seconds passed');
      setTimeout(() => {
        console.log('4 seconds passed');
        setTimeout(() => {
          console.log('5 seconds passed');
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

// const getCountryData = function (country) {
//   const req = new XMLHttpRequest();
//   req.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   req.send();

// const req = fetch('https://restcountries.com/v3.1/name/denmark');
// console.log(req);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (reponse) {
//       console.log(reponse);
//       return reponse.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };



// Refactored / Simplified fetch API from above

// Helper function
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};


const getCountryData = function (country) {
  // Country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      // console.log(response);

      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders;
      if (!neighbour) return;
      // Country 2
      return neighbour.forEach(neighbour => {
        fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
          .then(response => response.json())
          .then(data => renderCountry(data[0], 'neighbour'));
      });
    })
    .catch(err => {
      console.log(`${err}`);
      renderErr(`Something went wrong... ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('Germany');
});

// getCountryData('asdfqwer');


// Coding challenge #1
const whereAmI = function (lat, lng) {
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=117390623271015225203x25338`
  )
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.message})`);
      return res.json();
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => console.error(`${err.message}`));
};

whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);



// Testing that prioritization between call stack, callback queue and Microtask Queue.
// First it looks up in the call stack for execution but afterwards
// it will always prioritize Microtask queue over callback queue

console.log('Test start');
setTimeout(() => console.log('0 seconds passed'), 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res));

Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 100000; i++) {}
  console.log(res);
});

console.log('Test end');


const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You won!');
    } else {
      reject(new Error('You lost your money :('));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));


// Promisifying setTimeout
//
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seoconds');
    return wait(1);
  })
  .then(() => {
    console.log('I waited for 3 second');
    return wait(1);
  })
  .then(() => console.log('I waited for 4 second'));



// Promisifying the Geolocation API
//
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(pos => console.log(pos));


// Coding challenge 2
//
const imgContainer = document.querySelector('.images');

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

let currentImg;

createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 found');
    return wait(1);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 found');
    return wait(1);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 3 found');
    return wait(1);
  })
  .then(() => {
    currentImg.style.display = 'none';
  })
  .then(() => (currentImg.style.display = 'none'))
  .catch(err => console.error(err));

  
  const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};


// async await (ES 2017)
const whereAmI = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    
    // Reverse geocoding
    const geo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=117390623271015225203x25338`
    );
    if (!geo.ok) throw new Error('Problem getting location data');
    const dataGeo = await geo.json();
    
    // Country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error('Problem getting country ');
    // console.log(res);
    const data = await res.json();
    renderCountry(data[0]);
    
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(`${err}!!!`);
    renderErr(`${err.message}`);
    
    // Reject promise returned from async function
    throw err;
  }
};

console.log('1: Will get location');
// const city = whereAmI();
// console.log(city);


// whereAmI()
//   .then(city => console.log(`2: ${city}`))
//   .catch(err => console.error(`2: ${err.message}`))
//   .finally(() => console.log('3: Finished getting location'));
// console.log('FIRST');

// whereAmI function converted to --
// Immediately Inviked Function Expression (IIFE)
(async function () {
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err.message}`);
  }
  console.log('3: Finished getting location');
})();


// try {
  //   let y = 1;
  //   const x = 2;
  //   x = 3;
  // } catch (err) {
    //   alert(err.message);
    // }


const get3Countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    // console.log(data1.capital, data2.capital, data3.capita l);

    // Running promises parallel (loading at same time)
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};

get3Countries('portugal', 'denmark', 'france');



// Promise Combinrators ('race', 'allSettled' and 'any')
// 1: Promise.race
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/denmark`),
    getJSON(`https://restcountries.com/v3.1/name/sweden`),
  ]);
  console.log(res[0]);
})();

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('request took too long'));
    }, s * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/norway`),
  timeout(3),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

// Promise.allSettled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res));

Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

// Promise.any [ES2021]
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

*/

// Coding challenge 3

const imgContainer = document.querySelector('.images');

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;

    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

let currentImg;

// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     console.log('Image 1 found');
//     return wait(1);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log('Image 2 found');
//     return wait(1);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-3.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log('Image 3 found');
//     return wait(1);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   })
//   .then(() => (currentImg.style.display = 'none'))
//   .catch(err => console.error(err));

const loadNPause = async function () {
  try {
    // Load image 1
    let img = await createImage('img/img-1.jpg');
    console.log('Image 1 found');
    await wait(2);
    img.style.display = 'none';

    // Load image 2
    img = await createImage('img/img-2.jpg');
    console.log('Image 2 found');
    await wait(2);
    img.style.display = 'none';
  } catch (err) {
    console.error(err);
  }
};

// loadNPause();

const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage(img));
    // console.log(imgs);

    const imgsEl = await Promise.all(imgs);
    console.log(imgsEl);
    imgsEl.forEach(img => img.classList.add('parallel'));
  } catch (err) {
    console.log(err);
  }
};

loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);
