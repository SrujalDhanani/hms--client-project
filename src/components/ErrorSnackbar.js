// ErrorSnackbar.js
import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function ErrorSnackbar({ errorMessages, onClearErrors }) {
    const [isMessageShown, setIsMessageShown] = useState(false);

    useEffect(() => {
        if (errorMessages.length > 0 && !isMessageShown) {
            const errorMessage = errorMessages[0]; // Assuming only one message is shown at a time
            Swal.fire({
                title: errorMessage.message,
                icon: 'error',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                timer: 2000, // Auto close after 3 seconds
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    onClearErrors(errorMessage.id);
                    setIsMessageShown(false); // Reset the state to allow showing new messages
                }
            });
            setIsMessageShown(true); // Set the state to indicate that the message has been shown
        }
    }, [errorMessages, onClearErrors, isMessageShown]);

    return null; // Return null since we're not rendering anything directly
}

export default ErrorSnackbar;

