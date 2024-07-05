import React from 'react';

const Card = ({ title, content }) => {
  return (
    <div className="card border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="card-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Card;
