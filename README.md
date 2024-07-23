# Developer Portfolio Site

This project is a personal portfolio site built using React, showcasing various sections such as Home, Projects, AI Art, and a link to the SREF Vault.

## Overview

- **Home Section**: Provides an introduction and overview of the developer's skills and experience.
- **Projects Section**: Displays a collection of projects with descriptions, images, and links to GitHub repositories or live demos.
- **AI Art Section**: Showcases a timeline of AI-generated art with interactive carousels for each art piece.
- **SREF Vault**: A link to an external site that catalogs Midjourney v6 style references with image examples and tags.

## Technologies Used

- **React**: The main framework for building the user interface.
- **FontAwesome**: Used for icons in the navigation bar and project sections.
- **GSAP**: Employed for animations in the AI Art section.
- **Tailwind CSS**: Utilized for styling and layout.

## Project Structure

- **src/App.js**: The main application component that handles routing and state management for the active section and dark mode.
- **src/components**: Contains reusable components like `Card`, `Alert`, and `AlertDescription`.
- **src/sections**: Houses the main sections of the site: `HomeSection`, `Projects`, and `AIArtSection`.
- **src/index.js**: Entry point of the application that renders the `App` component.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
