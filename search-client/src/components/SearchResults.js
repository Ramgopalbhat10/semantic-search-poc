import React, { useContext, useEffect, useState } from "react";
import { Card, Spin, Pagination, Avatar, Divider } from "antd";

import { StateContext, people, communities } from "../constants";

const { Meta } = Card;

const SearchResults = () => {
  const { searchInput, filters } = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState({});
  const [peopleData, setPeopleData] = useState([]);
  const [communityData, setCommunityData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRecords({});
    setPeopleData([]);
    setCommunityData([]);
    // setPage(1);

    if (filters.length === 0) {
      setIsLoading(false);
      setRecords({});
      setPeopleData([]);
      setCommunityData([]);
      return;
    }
    setIsLoading(true);

    const fetchPulseData = async () => {
      const res = await fetch(
        `/get_search?page=${(page - 1) * 10}&query=${searchInput}`,
        {
          method: "POST",
        }
      );
      const searchData = await res.json();
      setRecords(searchData);
      setIsLoading(false);
    };
    const fetchPeopleData = () => {
      setPeopleData(people);
      setIsLoading(false);
    };
    const fetchCommunityData = () => {
      setCommunityData(communities);
      setIsLoading(false);
    };

    console.log(filters);
    if (filters.includes("All")) {
      fetchPulseData();
      fetchPeopleData();
      fetchCommunityData();
    } else {
      filters.forEach((filter) => {
        if (filter === "Pulse") {
          fetchPulseData();
        }
        if (filter === "People") {
          fetchPeopleData();
        }
        if (filter === "Community") {
          fetchCommunityData();
        }
      });
    }
  }, [page, searchInput, filters]);

  const onPageChange = (value) => {
    console.log("Page selected: ", value);
    setPage(value);
  };

  return (
    <div>
      {/* <p style={{ marginBottom: "10px" }}>
        Total records: {records.data["total_records"]}
      </p> */}
      {isLoading ? (
        <>
          <Divider />
          <Spin />
        </>
      ) : (
        <>
          <div className="people">
            {Boolean(peopleData.length) && (
              <>
                <Divider />
                <h3>People</h3>
              </>
            )}
            <div className="people-results">
              {peopleData.length > 0 &&
                peopleData.map((pdata, index) => (
                  <Card
                    key={index}
                    style={{ width: 200, marginTop: 8, marginRight: 10 }}
                    size="small"
                    hoverable
                  >
                    <Meta
                      avatar={
                        <Avatar
                          style={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {pdata.name[0]}
                        </Avatar>
                      }
                      title={pdata.name}
                      description={pdata.role}
                    />
                  </Card>
                ))}
            </div>
          </div>
          <div className="pulse">
            {Object.keys(records).length > 0 && (
              <>
                <Divider />
                <h3>Pulse</h3>
              </>
            )}
            <div className="pulse-results">
              {Object.keys(records).length > 0 &&
                records.data.data.map((record, index) => (
                  <Card size="small" key={index} hoverable>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Title: </span>{" "}
                      {record.title}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Link: </span>{" "}
                      {record.link}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Description: </span>
                      {record.body.substring(0, 100).concat("...")}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Score: </span>{" "}
                      {record.score}
                    </p>
                  </Card>
                ))}
            </div>
          </div>
          <div className="community">
            {Boolean(communityData.length) && (
              <>
                <Divider />
                <h3>Community</h3>
              </>
            )}
            <div className="community-results">
              {communityData.length > 0 &&
                communityData.map((record, index) => (
                  <Card size="small" key={index} hoverable>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Title: </span>{" "}
                      {record.name}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Link: </span>{" "}
                      {record.link}
                    </p>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Description: </span>
                      {record.description}
                    </p>
                  </Card>
                ))}
            </div>
          </div>
          <Divider />
        </>
      )}
      {Object.keys(records).length === 0 ? (
        <></>
      ) : (
        <div>
          <Pagination
            style={{ marginBottom: 20 }}
            size="small"
            total={records.data["total_records"]}
            showTotal={(total) => `Total ${total} items`}
            onChange={onPageChange}
            defaultCurrent={page}
          />
          <Divider />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
