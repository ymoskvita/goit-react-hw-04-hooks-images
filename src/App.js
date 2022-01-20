import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Searchbar from './Components/Searchbar';
import ImageGallery from './Components/ImageGallery';
import Button from './Components/Button';
import Modal from './Components/Modal';
import imagesApi from './services/images-api'
import { Container, StyledLoader } from './Components/ImagesFinder.styled';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setPage(1);
    setStatus('pending');

    imagesApi
      .fetchImages(searchQuery, page)
      .then(images => {
        if (!images.hits.length) {
          setStatus('idle');
          setImages(null);
          return toast.error(`No matches found`)
        }
        setImages(images.hits);
        setStatus('resolved');
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      })
  }, [searchQuery]);

  const handleImageClick = link => {
    setShowModal((prevState) => !prevState)
    setSelectedImage(link);
  };

  const handleLoadMoreBnt = () => {
    setPage(page => page + 1);

    imagesApi
      .fetchImages(searchQuery, page + 1)
      .then(images => {
        setImages(prevState => [...prevState, ...images.hits],);
      })
    }

  return (
      <Container>
        <Toaster />
        <Searchbar onSubmit={setSearchQuery} />
        {status === 'idle' && <div></div>}
        {status === 'pending' &&
          <StyledLoader
            type="BallTriangle"
            color="#000"
            height={50}
            width={50} />
        }
        {status === 'rejected' && <h2>{error.message}</h2>}
        {status === 'resolved' &&
          <ImageGallery
            images={images}
            onImageClick={handleImageClick} />
        }
        {images && images.length > 11 && <Button onClick={handleLoadMoreBnt}/>}
        {showModal &&
          <Modal onClose={handleImageClick}>
            <img src={selectedImage} alt="" onClick={handleImageClick}/>
          </Modal>
        }
      </Container>
    );
}