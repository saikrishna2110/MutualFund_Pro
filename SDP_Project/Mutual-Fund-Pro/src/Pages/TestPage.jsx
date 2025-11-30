import React from 'react';

const TestPage = () => {
  console.log('🧪 TestPage component is rendering!');

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '10px',
      margin: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: 'green' }}>✅ React is Working!</h1>
      <p>This page proves that React rendering is functional.</p>
      <p>Current timestamp: {new Date().toLocaleString()}</p>
      <p>If you can see this, the blank page issue is resolved!</p>
    </div>
  );
};

export default TestPage;
