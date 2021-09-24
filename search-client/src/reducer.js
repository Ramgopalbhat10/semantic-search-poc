export default function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "INPUT_SEARCH": {
      return {
        ...state,
        searchInput: payload.input,
      };
    }
    case "INPUT_CLEAR": {
      return {
        ...state,
        searchInput: "",
      };
    }
    case "FILTER_SELECT": {
      return {
        ...state,
        filters: payload.filters,
      };
    }
    default:
      return state;
  }
}
