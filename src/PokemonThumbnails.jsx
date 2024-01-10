import React from 'react';

const PokemonThumbnails = ({ id, name, jpName, image, type, jpType, iconImage }) => {
    return (
        <div className="thumb-container grass">
            <div className="number">
                <small>#0{id}</small>
            </div>
            <img src={image} alt={name} />
            <img src={iconImage} alt={name} className='icon-image' />
            <div className="detail-wrapper">
                <h4>{jpName}</h4>
                <h3>{jpType}</h3>
            </div>
        </div>
    );
};

export default PokemonThumbnails;