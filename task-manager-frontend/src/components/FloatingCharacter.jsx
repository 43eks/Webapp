import React from 'react';
import './FloatingCharacter.css';

function FloatingCharacter({ imageUrl = '/uploads/character.png' }) {
  return (
    <div className="floating-character">
      <img src={imageUrl} alt="キャラクター" />
    </div>
  );
}

export default FloatingCharacter;