import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { BsSearch } from 'react-icons/bs';
import PropTypes from 'prop-types';
import { SearchbarStyled, SearchForm, SearchFormButton, SearchFormInput } from './ImagesFinder.styled';

export default function Searchbar({ onSubmit }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleQueryChange = event => {
        setSearchQuery(event.currentTarget.value.toLowerCase());
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (searchQuery.trim() === '') {
            toast.error(`Enter query`)
            return;
        }

        onSubmit(searchQuery);
        setSearchQuery('');
    };

    return (
        <SearchbarStyled>
            <SearchForm onSubmit={handleSubmit}>
                <SearchFormButton type="submit"><BsSearch /></SearchFormButton>
                <SearchFormInput
                    type="text"
                    name="searchQuery"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    value={searchQuery}
                    onChange={handleQueryChange}
                />
            </SearchForm>
        </SearchbarStyled>
    );
}

Searchbar.propTypes = {
    onSubmit: PropTypes.func,
}