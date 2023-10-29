'use strict';

// prettier-ignore

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//to get the current position we use geolocation api
class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  //set the description
  _setDescription() {
    // prettier-ignore

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);

    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return `${Math.round(this.pace)}`;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);

    this.elevationGain = elevationGain;

    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    //Km/h
    this.speed = (this.distance * 60) / this.duration;

    return this.speed;
  }
}

// Debugging stuffs

// const run = new Running([16.695, 74.2], 5.2, 24, 178);
// const cycle = new Cycling([16.695, 74.2], 50.2, 120, 523);

// console.log(run, cycle);

class App {
  #map;
  #mapEvent;
  #workout = [];
  constructor() {
    //Get user position
    this._getPosition();

    //fetch the data from local storage

    this._getLocalStorage();

    //Attach event handler
    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);

    containerWorkouts.addEventListener('click', this._moveToPopUp.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // when _loadMap is called as a regular func which causes this keyword to be undefined not as class method so we need to bind this keyword to it using bind method
        function () {
          alert('Could not get your position');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    // console.log(
    //   `https://www.google.com/maps/@${latitude},${longitude},7z?entry=ttu`
    // );
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //Handling click on map

    this.#map.on('click', this._showForm.bind(this));

    this.#workout.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapEvents) {
    this.#mapEvent = mapEvents;
    form.classList.remove('hidden');

    inputDistance.focus();
    // console.log(mapEvent);
  }
  _hideForm() {
    // Hide form + input field
    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        ' ';

    form.style.display = 'none';
    form.classList.add('hidden');

    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _toggleElevationField() {
    //closet is close parent to the child class

    //We can also use parentNode
    //   inputElevation.parentNode.classList.toggle('form__row--hidden');

    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(input => Number.isFinite(input));

    const allPositive = (...inputs) => inputs.every(input => input > 0);
    e.preventDefault();

    //1) Get the data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      //2) Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert('Input are not positive');
      }
      //3) If workout is running , create running object
      workout = new Running({ lat, lng }, distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      //2) Check if data is valid
      if (
        !validInputs(distance, duration) ||
        !allPositive(distance, duration)
      ) {
        return alert('Input are not positive');
      }

      //4) If workout is cycling , create cycling object

      workout = new Cycling({ lat, lng }, distance, duration, elevation);
    }

    //6) Render workout on list

    this.#workout.push(workout);
    // console.log(workout);

    //5) Render workout on map

    this._renderWorkoutMarker(workout);

    //6) Render workout on list
    this._renderWorkOut(workout);

    //hide form and clear input field
    this._hideForm();

    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    const coOrdinate = workout.coords;

    L.marker(coOrdinate, {
      riseOnHover: true,
    })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkOut(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    if (workout.type === 'running') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === 'cycling') {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">m</span>
      </div>
    </li> 
      `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopUp(e) {
    const workoutElement = e.target.closest('.workout');
    // console.log(workoutElement);
    let workout;
    if (!workoutElement) return;

    workout = this.#workout.find(work => work.id === workoutElement.dataset.id);

    // console.log(workout);

    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    //using the public interface
    // workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workout));
    //Use for small amount of data
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    // console.log(data);

    if (!data) return;

    this.#workout = data;

    this.#workout.forEach(work => {
      this._renderWorkOut(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();

//Form manipulation

//inputType
