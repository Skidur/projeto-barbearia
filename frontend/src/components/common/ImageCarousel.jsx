import React from 'react';
import Slider from 'react-slick';

import slideImage1 from '../../assets/barber-hero.jpg';
import slideImage2 from '../../assets/barber-hero2.jpg';
import slideImage3 from '../../assets/barber-hero3.jpg';

export const ImageCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Slider {...settings}>
            <div>
                <img src={slideImage1} alt="Slide 1" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>
            <div>
                <img src={slideImage2} alt="Slide 2" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>
            <div>
                <img src={slideImage3} alt="Slide 3" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>
        </Slider>
    );
};