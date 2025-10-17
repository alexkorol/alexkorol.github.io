import React from 'react';

const Card = ({ title, content, className = '' }) => {
  const renderContent = () => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }

    return content;
  };

  return (
    <div className={`card ${className}`}>
      <h2 className="card-title text-xl font-semibold mb-3">{title}</h2>
      <div className="card-content text-base leading-relaxed">
        {renderContent()}
      </div>
    </div>
  );
};

export default Card;
