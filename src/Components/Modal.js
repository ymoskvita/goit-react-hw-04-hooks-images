import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Overlay, ModalStyled } from './ImagesFinder.styled';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ onClose, children }) {
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleKeyDown = event => {
        if (event.code === 'Escape') {
            onClose();
        }
    }

    const handleOverlayClick = event => {
        if (event.currentTarget === event.target) {
            onClose();
        }
    }

    return createPortal(
        <Overlay onClick={handleOverlayClick}>
            <ModalStyled>{children}</ModalStyled>
        </Overlay>,
        modalRoot,
    );
}

Modal.propTypes = {
    onClose: PropTypes.func,
    children: PropTypes.node,
}
