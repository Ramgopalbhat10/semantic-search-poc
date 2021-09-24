import { useReducer } from "react";

import reducer from "./reducer";
import SearchInput from "./components/SearchInput";
import { StateContext, DispatchContext, initialState } from "./constants";
import SearchResults from "./components/SearchResults";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className="App">
          <SearchInput />
          {state.searchInput && <SearchResults />}
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
