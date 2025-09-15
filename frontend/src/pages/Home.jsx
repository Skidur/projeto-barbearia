import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import aboutImage from '../assets/historia.jpg';
import haircutImage from '../assets/corte.jpg';
import beardImage from '../assets/barba.jpg';
import comboImage from '../assets/combo.jpg';
import barber1Image from '../assets/barbeiro1.jpg';
import barber2Image from '../assets/barbeiro2.jpg';
import barber3Image from '../assets/barbeiro3.jpg';
import { ImageCarousel } from '../components/common/ImageCarousel';

export const Home = () => {
    const [isLoggedIn, _setIsLoggedIn] = useState(false);
    
    return (
        <>
            <section className='hero-section'>
                <div className='container'>
                    <div className='hero-text'>
                        <h2>A melhor experiência de barbearia da cidade</h2>
                        <p>Estilo, conforto e precisão. Agende seu horário com os melhores.</p>
                        <button className='cta-button'>Agende seu Horário</button>
                    </div>
                </div>
            </section>

            <section id="sobre" className='about-section'>
            <div className='container'>
                <div className='about-image'>
                    <img src={aboutImage} alt="Interior da barbearia" />
                </div>
                <div className='about-text'>
                    <h3>Nossa História</h3>
                    <p>
                        Fundada em [Ano], a BarberFlow nasceu da paixão por criar um espaço
                        onde a tradição da barbearia clássica encontra o estilo moderno. 
                        Nossa missão é mais do que apenas cortar cabelo; é oferecer uma 
                        experiência única de cuidado e bem-estar para o homem contemporâneo.
                    </p>
                </div>
            </div>
        </section>

            <section id='servicos' className='services-section'>
                <div className='container'>
                    <h3 className='section-title'>Nossos Serviços</h3>
                    <div className='services-grid'>

                        <Link to={isLoggedIn ? "/booking" : "/login"} className="service-card">
                            <img src={haircutImage} alt="Corte de Cabelo" className="service-card-image" />
                            <div className="service-card-content">
                                <h4>Corte de Cabelo</h4>
                                <p>Máquina e tesoura, finalizado com os melhores produtos.</p>
                                <span className='service-price'>R$ 50,00</span>
                            </div>
                        </Link>

                        <Link to={isLoggedIn ? "/booking" : "/login"} className="service-card">
                            <img src={beardImage} alt="Barba Terapia" className="service-card-image" />
                            <div className="service-card-content">
                                <h4>Barba Terapia</h4>
                                <p>Navalha, toalha quente e produtos especiais para a pele.</p>
                                <span className='service-price'>R$ 40,00</span>
                            </div>
                        </Link>

                        <Link to={isLoggedIn ? "/booking" : "/login"} className="service-card">
                            <img src={comboImage} alt="Combo Cabelo e Barba" className="service-card-image" />
                            <div className="service-card-content">
                                <h4>Combo (Cabelo + Barba)</h4>
                                <p>O pacote completo para um visual impecável.</p>
                                <span className='service-price'>R$ 80,00</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section id="equipe" className="team-section">
                <div className="container">
                    <h3 className="section-title">Conheça Nossa Equipe</h3>
                    <div className="team-grid">

                        <div className="team-member-card">
                            <img src={barber1Image} alt="Foto do Barbeiro João" className="team-member-photo" />
                            <h4 className="team-member-name">João Silva</h4>
                            <p className="team-member-specialty">Especialista em Cortes Modernos</p>
                            <p className="team-member-bio">Com mais de 10 anos de experiência, João transforma seu estilo com precisão e criatividade.</p>
                        </div>

                        <div className="team-member-card">
                            <img src={barber2Image} alt="Foto do Barbeiro Carlos" className="team-member-photo" />
                            <h4 className="team-member-name">Carlos Pereira</h4>
                            <p className="team-member-specialty">Mestre da Barba Terapia</p>
                            <p className="team-member-bio">Carlos cuida da sua barba com técnicas clássicas de toalha quente e os melhores produtos do mercado.</p>
                        </div>

                        <div className="team-member-card">
                            <img src={barber3Image} alt="Foto do Barbeiro Miguel" className="team-member-photo" />
                            <h4 className="team-member-name">Miguel Santos</h4>
                            <p className="team-member-specialty">Visagismo e Estilo</p>
                            <p className="team-member-bio">Miguel é especialista em encontrar o corte e o estilo que melhor combinam com o seu rosto.</p>
                        </div>

                    </div>
                </div>
            </section>

            <section className='gallery-section'>
                <div className='container'>
                    <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Nossa Barbearia</h3>
                    <ImageCarousel />
                </div>
            </section>
        </>
    );
};