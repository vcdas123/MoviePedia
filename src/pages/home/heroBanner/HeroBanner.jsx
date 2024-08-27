import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";

import useFetch from "../../../hooks/useFetch";

import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { url } = useSelector(state => state.home);
  const { data, loading } = useFetch("/movie/upcoming");

  console.log("DATA", data);

  useEffect(() => {
    if (url && data) {
      const len = data?.results?.length - 1;
      const bg =
        url.backdrop +
        data?.results?.[Math.floor(Math.random() * len)]?.backdrop_path;
      console.log("DATA", bg);
      setBackground(bg);
    }
  }, [data, url]);

  const searchQueryHandler = event => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}

      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome.</span>
          <span className="subTitle">
            Discover millions of movies, TV shows, and personalities. Start
            exploring today.
          </span>
          <form
            className="searchInput"
            onSubmit={e => {
              e.preventDefault();
              if (query.length > 0) {
                navigate(`/search/${query}`);
              }
            }}
          >
            <input
              type="text"
              placeholder="Find your favorite movie or TV show..."
              onChange={e => setQuery(e.target.value)}
              onKeyUp={searchQueryHandler}
            />
            <button>Search</button>
          </form>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
