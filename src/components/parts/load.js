import React from "react";
import { ThreeDots } from "react-loader-spinner"; // Importing ThreeDots loader

function Load() {
    return (
        <ThreeDots
            visible={true}
            height={80}
            width={80}
            color="#4475b7"
            radius={9}
            ariaLabel="three-dots-loading"
            wrapperStyle={{
                width: '80%',
                height: '80vh',
                display: 'flex',
                position: 'fixed',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            wrapperClass=""
        />

    );
}
export default Load;