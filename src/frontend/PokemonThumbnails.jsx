import React from 'react';

const PokemonThumbnails = ({ id, name, jpName, image, type1, type2, jpType1, jpType2, iconImage }) => {
    return (
        <div className="thumb-container grass">
            <div className="number">
                <small>No{id}</small>
            </div>
            <img src={image} alt={name} />
            <img src={iconImage} alt={name} className='icon-image' />
            <div className="detail-wrapper">
                <h4>{name}</h4>
                <h4>{jpName}</h4>
                <h3>{jpType2 ? `${jpType1}・${jpType2}` : jpType1}</h3>

            </div>
        </div>
    );
};

export default PokemonThumbnails;