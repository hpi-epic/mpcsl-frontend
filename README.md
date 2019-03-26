# MPCI UI

## Available Scripts

In the project directory, you can run (you can use `npm` instead of `yarn`):

### Installation

`yarn install`

### Start Development Server (with hot reloading)

`yarn start`

### Run Tests

`yarn test`

### Run Linter

`yarn run lint`

### Create a Production Build

`yarn run build`

## Project Structure and Implementation Notes

The project structure is based on [Redux's recommended code structure](https://redux.js.org/faq/code-structure)

- `src/actions`: API requests and redux actions are placed here.
- `src/components`: React components that are unaware of Redux and any other logic like API requests.
- `src/containers`: React components that are connected to Redux, React-Router, or communicate with the backend.
  - `GraphRenderer`: D3 rendering of force graph layout. Connected to the Redux state. Will render changes on `selectedGraph` in Redux state.
- `src/reducers`: Define state on different Redux actions.
- `src/constants`:
  - `api.ts`: All backend endpoints are defined here
  - `routes.ts`: All routes for React-Router are defined here.
- `src/types`:
  - `graphTypes`: We have two types of graphs:
    - API Graph: The graph structure that is returned by the API
    - ID3Graph: The graph structure that is needed by D3.
- `src/utils`:
  - `graph.ts`: The graph that is stored in redux state which consists of the following logic:
    - Handles conversions from API Graph to ID3Graph (marked with **api**).
    - Add unique edges and nodes to context and focus.
    - Deletion of nodes from focus.

## Additional Notes

### Linter

This project uses `tslint`. Please consider the use of a linter extension in your IDE. (e.g. [Visual Studio Code Tslint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint))

The configuration is placed in `tslint.json`.

Consider to use a formatting extensions like [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to format the files automatically. To format the files using the tslint-configuration in the project directory set `prettier.tslintIntegration` to `true`. You need to install (globally) [prettier-tslint](https://github.com/azz/prettier-tslint).

### Redux

The project can be used with [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) in Chrome.
