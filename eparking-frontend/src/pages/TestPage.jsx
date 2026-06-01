import React from 'react';

const TestPage = () => {
    console.log('TestPage rendered!');
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1 style={{ color: 'blue', fontSize: '48px' }}>TEST PAGE</h1>
            <p style={{ fontSize: '24px' }}>If you can see this, React is working!</p>
            <p style={{ fontSize: '18px', color: 'gray' }}>
                Current URL: {window.location.href}
            </p>
        </div>
    );
};

export default TestPage;
