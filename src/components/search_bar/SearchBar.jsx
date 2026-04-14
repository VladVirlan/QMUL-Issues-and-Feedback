import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({
    placeholder = "Search...",
    onSearch,
    onChange,
    initialValue = "",
}) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(value);
    };

    return (
        <form className="SearchBar" onSubmit={handleSubmit}>
            <input
                className="SearchInput"
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
            />
            {/* Unnecessary for current purposes
            <button className="SearchButton" type="submit">
                Search
            </button>
            */}
        </form>
    );
};

export default SearchBar;
