import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";

import useFetch from "../../../hooks/useFetch";

import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { fetchDataFromApi } from "../../../utils/api";
import MovieCard from "../../../components/movieCard/MovieCard";

function createDebounce(func, delay) {
  let timeout = null;
  return (...args) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { url } = useSelector(state => state.home);
  const [pageNum, setPageNum] = useState(1);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const { data, loading } = useFetch("/movie/upcoming");

  const resultsRef = useRef(null);

  const fetchResults = (pageNum, query, append = true) => {
    setSearching(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      res => {
        console.log("HELLO", res);
        if (append) {
          setResults(prev => {
            let update = JSON.parse(JSON.stringify(prev));
            const results = update?.results
              ? [...update?.results, ...res.results]
              : res.results;
            return {
              ...update,
              results,
            };
          });
        } else {
          setResults(res);
        }
        setPageNum(prev => prev + 1);
        setSearching(false);
      }
    );
  };

  const [debouncedFetchResults] = useState(() =>
    createDebounce(fetchResults, 500)
  );

  useEffect(() => {
    if (url && data) {
      const len = data?.results?.length - 1;
      const bg =
        url.backdrop +
        data?.results?.[Math.floor(Math.random() * len)]?.backdrop_path;
      setBackground(bg);
    }
  }, [data, url]);

  useEffect(() => {
    // Handler to check clicks outside the heroBannerContent
    const handleClickOutside = event => {
      if (bannerRef.current && !bannerRef.current.contains(event.target)) {
        setShowResults(false); // Hide search results
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchQueryHandler = event => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const handleScroll = () => {
    if (resultsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = resultsRef.current;
      if (scrollTop + clientHeight >= scrollHeight && !searching) {
        fetchResults(pageNum, query);
      }
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
              onChange={e => {
                console.log(e);
                setQuery(e.target.value);
                debouncedFetchResults(1, e.target.value, false);
              }}
              onKeyUp={searchQueryHandler}
            />
            <button>Search</button>
          </form>
          {results && results?.results && results?.results.length > 0 && (
            <div
              className="searchResults"
              ref={resultsRef}
              // onScroll={handleScroll}
            >
              {results?.results &&
                results?.results?.map((item, idx) => {
                  return <MovieCard data={item} fromSearch key={item?.id} />;
                })}
              {searching && <p>Loading...</p>}
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
