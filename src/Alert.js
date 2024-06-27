import React from 'react';

const Alert = ({ className, children }) => {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Alert;
