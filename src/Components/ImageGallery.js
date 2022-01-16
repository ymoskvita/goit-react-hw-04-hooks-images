import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import ImageGalleryItem from './ImageGalleryItem';
import imagesApi from '../services/images-api';
import Modal from './Modal';
import Button from './Button';
import { ImageGalleryList, StyledLoader } from './ImagesFinder.styled';

export default function ImageGallery({ searchQuery }) {
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
                    return toast.error(`No matches found`)
                }
                setImages(images.hits);
                setStatus('resolved');
                setPage(page => page + 1);
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
            .fetchImages(searchQuery, page)
            .then(images => {
                setImages(prevState =>
                    [...prevState, ...images.hits],
                );
            })
    }

    if (status === 'idle') {
            return <div></div>;
    }
    if (status === 'pending') {
        return (
            <StyledLoader
                type="BallTriangle"
                color="#000"
                height={50}
                width={50}
            />
        )
    }
    if (status === 'rejected') {
        return <h2>{error}</h2>;
    }
    if (status === 'resolved') {
        return (
            <div>
                <ImageGalleryList>
                    <ImageGalleryItem images={images} onClick={handleImageClick}/>
                </ImageGalleryList>
                {showModal &&
                    <Modal onClose={handleImageClick}>
                        <img src={selectedImage} alt="" onClick={handleImageClick}/>
                    </Modal>
                }
                {images.length > 11 && <Button onClick={handleLoadMoreBnt}/>}
            </div>
        );
    }

}
// export default class ImageGallery extends Component {
//     state = {
//         images: null,
//         loading: false,
//         error: null,
//         showModal: false,
//         selectedImage: null,
//         page: 1,
//         status: 'idle',
//     };

//     componentDidUpdate(prevProps, prevState) {
//         if (prevProps.searchQuery !== this.props.searchQuery) {
//             this.setState({ page: 1, status: 'pending' });

//             imagesApi
//                 .fetchImages(this.props.searchQuery, this.state.page)
//                 .then(images => {
//                     if (!images.hits.length) {
//                         this.setState({ status: 'idle'});
//                         return toast.error(`No matches found`)
//                     }
//                     this.setState({ images: images.hits, status: 'resolved', page: this.state.page + 1 })
//                 })
//                 .catch(error => this.setState({ error, status: 'rejected'}))
//         }
//     }

    // handleImageClick = link => {
    //     this.setState(({ showModal }) => ({
    //         showModal: !showModal
    //     }));
    //     this.setState({ selectedImage: link });
    // }

    // handleLoadMoreBnt = () => {
    //     this.setState({ page: this.state.page + 1 });

    //     imagesApi
    //         .fetchImages(this.props.searchQuery, this.state.page)
    //         .then(images => {
    //             this.setState(prevState => ({
    //                 images: [...prevState.images, ...images.hits],
    //             }));
    //         })
    // }

    // render() {
    //     const { images, error, status, showModal, selectedImage } = this.state;

    //     if (status === 'idle') {
    //         return <div></div>;
    //     }
    //     if (status === 'pending') {
    //         return (
    //             <StyledLoader
    //                 type="BallTriangle"
    //                 color="#000"
    //                 height={50}
    //                 width={50}
    //             />
    //         )
    //     }
    //     if (status === 'rejected') {
    //         return <h2>{error.message}</h2>;
    //     }
    //     if (status === 'resolved') {
    //         return (
    //             <div>
    //                 <ImageGalleryList>
    //                     <ImageGalleryItem images={images} onClick={this.handleImageClick}/>
    //                 </ImageGalleryList>
    //                 {showModal &&
    //                     <Modal onClose={this.handleImageClick}>
    //                         <img src={selectedImage} alt="" onClick={this.handleImageClick}/>
    //                     </Modal>
    //                 }
    //                 {images.length > 11 && <Button onClick={this.handleLoadMoreBnt}/>}
    //             </div>
    //         );
    //     }
    // }
// }

ImageGallery.propTypes = {
    searchQuery: PropTypes.string,
}