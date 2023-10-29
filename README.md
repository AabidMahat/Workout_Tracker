# Workout Tracker Web Application

This web application is a simple workout tracker that allows users to record and visualize their running and cycling activities. It leverages the Geolocation API to determine the user's current position and displays the workouts on an interactive map. The application is built using HTML, CSS, and JavaScript, and utilizes the Leaflet library for map functionality.

## Features

1. **Geolocation Integration**: The app utilizes the Geolocation API to obtain the user's current position and display it on an interactive map.

2. **Workout Recording**: Users can record both running and cycling workouts. When submitting a workout, they need to provide details such as type (running or cycling), distance (in kilometers), duration (in minutes), and additional metrics like cadence (for running) or elevation gain (for cycling).

3. **Map Integration**: The recorded workouts are displayed as markers on the map. Users can click on these markers to view more details about each workout.

4. **Local Storage**: The app stores workout data in the browser's local storage, allowing users to persist their data even after closing and reopening the app.

5. **Workout Details**: Workouts are displayed in a list format, showing the type, date, distance, duration, and relevant metrics based on the activity type.

6. **Reset Functionality**: Users have the option to reset the app, clearing all stored workouts from local storage and reloading the page.

## Usage

1. When you open the app, it will request permission to access your current location using the Geolocation API. Please grant permission for the app to work correctly.

2. To add a new workout, use the form provided on the left side of the screen. Select the type of workout (running or cycling), enter the distance, duration, and any additional metrics. Click the "✔️" button to submit the workout.

3. The workout will be displayed on the map as a marker. Click on the marker to see more details.

4. The workout details are also listed below the map.

5. To switch between running and cycling workouts, use the drop-down menu in the form.

6. To reset the app and clear all recorded workouts, click the "Reset" button at the bottom of the screen.

## Code Overview

The application consists of three main JavaScript classes: `Workout`, `Running`, and `Cycling`, which represent the workout data. The `App` class handles the application's core functionality, including geolocation, workout submission, map integration, and local storage management.

Additionally, the app uses the Leaflet library to create and manage the interactive map.

## Running the Application

To run the application locally, you need to set up a basic web server. You can use a tool like Live Server for this purpose. Make sure to have the necessary HTML, CSS, and JavaScript files in a project folder.

Here's how to set up the development environment:

1. Install the Live Server extension for your code editor or use your preferred method to set up a local web server.

2. Open the project folder in your code editor.

3. Open the main HTML file (e.g., `index.html`) and right-click or use the "Open with Live Server" option to start the local server.

4. The application should open in your default web browser. If not, you can access it by entering the server's address in your browser's URL bar.

5. Enjoy using the Workout Tracker web application.

## Additional Notes

- The app is built using modern JavaScript, HTML, and CSS, and it uses the Geolocation API for location-based functionality.
- Leaflet, an open-source JavaScript library, is used for the map integration.
- The application utilizes local storage for data persistence, so recorded workouts are saved and retrieved even after refreshing or closing the app.

