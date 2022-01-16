import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Searchbar from './Components/Searchbar';
import ImageGallery from './Components/ImageGallery';
import { Container } from './Components/ImagesFinder.styled';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // const handleFormSubmit = searchQuery => {
  //   setSearchQuery(searchQuery);
  // };

  return (
    <Container>
      <Toaster />
      <Searchbar onSubmit={setSearchQuery} />
      <ImageGallery searchQuery={searchQuery} />
    </Container>
  );
}