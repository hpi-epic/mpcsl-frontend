# MPCI UI

[![CircleCI](https://circleci.com/gh/hpi-epic/mpci-frontend/tree/master.svg?style=svg&circle-token=29ae717f575398c83c5ad5b652124e2c41ea31fe)](https://circleci.com/gh/hpi-epic/mpci-frontend/tree/master)

### Getting started

#### Requirements

- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

#### Module Installation

`yarn`

#### Start Development Server (with hot reloading)

`yarn start`

Will start a development server on `localhost:3000` if available.
API requests will be proxied to `localhost:5000`.

#### Run Tests

`yarn test`

#### Run Linter

`yarn lint`

#### Create a Production Build

`yarn build`

### Project Structure and Implementation Notes

- `src/components`: React components, nested to represent their usage.
  - `/GraphExplorer`: D3 rendering of force graph layout and UI to modify the rendering.
  - `/ObservationMatrixView`: Card list view of available datasets.
  - `/ExperimentsView`: Card list view of available experiments for a dataset.
  - `/ExperimentsDetails`: Experiment details and job list for an experiment.
  - `/ExperimentsComparison`: Comparison view for experiments.
  - `/Header`: Different headers for views.
- `src/restAPI`:
  - `apiEndpoints.ts`: Backend endpoints are defined here.
  - `apiRequests.ts`: API request functions and caching mechanisms are defined here.
- `src/types`:
  - `graphTypes.ts`: Holding types for two different graphs:
    - API Graph: The graph structure that is returned by the API.
    - ID3Graph: The graph structure that is used by D3.
  - `types.ts`: Types used across the project.
- `src/errorHandling`:
  - `errorHandler.ts`: Listener for backend error messages.
- `src/graph`:
  - `graph.ts`: The graph (inherits from ID3Graph) which consists of the following logic:
    - Handles conversions from API Graph to ID3Graph (marked with **api**).
    - Add unique edges and nodes to context and focus.
    - Deletion of nodes from focus.
    - Holds graph data for d3 rendering
    - Emits graph changes to components
    - Singleton instance

### Additional Notes

#### Linter

This project uses `eslint`. Please consider the use of a linter extension in your IDE. (e.g. [Visual Studio Code ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint))

The configuration is placed in `.eslintrc.json`.

Consider to use a formatting extensions like [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to format the files automatically.
