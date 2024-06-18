import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const Spin = () => {
    return (
        <TailSpin
            visible={true}
            height={10}
            width={10}
            color="#fff"
            ariaLabel="tail-spin-loading"
            radius={0.5}
            wrapperStyle={{
                width: 'auto',
                height: 'auto',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            wrapperClass=""
        />
    );
}

export default Spin;
