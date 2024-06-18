import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

function SuccessSnackbar({ successMessages, onclearSuccess }) {
    const [isMessageShown, setIsMessageShown] = useState(false);

    useEffect(() => {
        if (successMessages.length > 0 && !isMessageShown) {
            const successMessage = successMessages[0]; 
            Swal.fire({
                title: successMessage.message,
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                timer: 1000, 
             }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    onclearSuccess(successMessage.id);
                    setIsMessageShown(false); // Reset the state to allow showing new messages
                }
            });
            setIsMessageShown(true); 
        }
    }, [successMessages, onclearSuccess, isMessageShown]);

    return null; 
}

export default SuccessSnackbar;
