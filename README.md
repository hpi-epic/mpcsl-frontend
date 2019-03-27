# MPCI UI

There are 3 different views:

- **Observation Matrices Management View**: Create/Delete/View observation matrices/datasets needed for experiment creation.
- **Experiment Management View**: Create/Delete/View/Start experiments with specific parameters and observation matrices. An experiment run is called job. The jobs and the status can be viewed in this view, explored in the result exploration view.
- **Result Exploration**:
  - **Graph Selection**: A subgraph can be selected. The visible graph is defined by the selection of focus nodes and their neighbors (context nodes).
  - **Graph Exploration and Validation**: Node data distributions can be viewed here by clicking on a node.
  - **Causal Inference View**: Interventions and (in the future) causal effects can be explored here.

## Implementation

### Available Scripts

In the project directory, you can run (you could also use `npm` instead of `yarn`):

#### Installation

`yarn install`

#### Start Development Server (with hot reloading)

`yarn start`

Will start a development server on port `:3000`.

#### Run Tests

`yarn test`

#### Run Linter

`yarn run lint`

#### Create a Production Build

`yarn run build`

### Project Structure and Implementation Notes

The project structure is based on [Redux's recommended code structure](https://redux.js.org/faq/code-structure)

- `src/actions`:
  - `apiRequests.ts`: API requests
  - `graphExplorer.ts`: Redux actions
- `src/components`: React components that are unaware of Redux and any other logic like API requests.
- `src/containers`: React components that are connected to Redux, React-Router, or communicate with the backend.
  - `GraphRenderer`: D3 rendering of force graph layout. Connected to the Redux state. Will render changes on `selectedGraph` in Redux state.
- `src/reducers`: Define state on different Redux actions.
- `src/constants`:
  - `api.ts`: Backend endpoints are defined here.
  - `routes.ts`: Routes for React-Router are defined here.
- `src/types`:
  - `graphTypes`: We implemented two types of graphs:
    - API Graph: The graph structure that is returned by the API.
    - ID3Graph: The graph structure that is needed by D3.
- `src/utils`:
  - `graph.ts`: The graph (inherits from ID3Graph) that is stored in redux state which consists of the following logic:
    - Handles conversions from API Graph to ID3Graph (marked with **api**).
    - Add unique edges and nodes to context and focus.
    - Deletion of nodes from focus.

### Additional Notes

#### Linter

This project uses `tslint`. Please consider the use of a linter extension in your IDE. (e.g. [Visual Studio Code Tslint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint))

The configuration is placed in `tslint.json`.

Consider to use a formatting extensions like [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to format the files automatically. To format the files using the tslint-configuration in the project directory set `prettier.tslintIntegration` to `true`. You need to install (globally) [prettier-tslint](https://github.com/azz/prettier-tslint).

#### Redux

The project can be used with [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) in Chrome.

## Future Work

- Annotations and prior knowledge
- Causal Effect
