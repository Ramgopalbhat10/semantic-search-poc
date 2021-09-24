import React, { useContext } from "react";
import { Input, Select } from "antd";

import { StateContext, DispatchContext } from "../constants";

const { Search } = Input;
const { Option } = Select;
const filters = ["All", "Pulse", "People", "Community"];

const SearchInput = () => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const onSearch = (input) => {
    dispatch({
      type: "INPUT_SEARCH",
      payload: {
        input,
      },
    });
  };

  const onFilterChange = (filters) => {
    dispatch({
      type: "FILTER_SELECT",
      payload: {
        filters,
      },
    });
  };

  return (
    <div>
      <h2>Search for Pulse content</h2>
      <div className="flex">
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          enterButton
          style={{ width: "60%" }}
        />
        <div className="flex">
          <p style={{ margin: "5px 10px 5px 20px" }}>Content: </p>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            defaultValue={state.filters}
            // value={filter}
            onChange={onFilterChange}
          >
            {filters.map((filter) => (
              <Option key={filter} value={filter}>
                {filter}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
