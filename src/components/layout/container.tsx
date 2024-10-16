import React from 'react';

type Props = {
    children: React.ReactNode;
}

const Container = ({ children }: Props) => {
    return (
        <main className={'max-w-4xl w-full mx-auto py-20 px-4 md:px-10'}>
            {children}
        </main>
    );
};

export default Container;
