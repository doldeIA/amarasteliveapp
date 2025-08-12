import React, { useState } from 'react';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import InstagramIcon from './icons/InstagramIcon';
import SoundCloudIcon from './icons/SoundCloudIcon';
import SpotifyIcon from './icons/SpotifyIcon';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const menuItems = [
        { name: 'Início', href: '#' },
        { name: 'Produtos', href: '#' },
        { name: 'Contato', href: '#' },
    ];

    const socialLinks = [
        { name: 'Instagram', href: 'https://instagram.com/amarastelive', icon: InstagramIcon },
        { name: 'SoundCloud', href: 'https://soundcloud.com/amarastelive', icon: SoundCloudIcon },
        { name: 'Spotify', href: 'https://open.spotify.com/intl-pt/artist/3407XfslidAhQKTIaFW24m', icon: SpotifyIcon },
    ];

    const hoverClass = "transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_5px_theme(colors.accent)]";

    return (
        <header className="bg-white fixed top-0 left-0 right-0 z-20 border-b border-gray-200 shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end h-24">
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center">
                        <div className="flex items-center gap-4">
                            {menuItems.map(item => (
                                <a href={item.href} key={item.name} className={`text-primary font-semibold px-3 py-2 rounded-md ${hoverClass}`}>
                                    {item.name}
                                </a>
                            ))}
                            <div className="w-px h-6 bg-gray-300 mx-2"></div>
                            {socialLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-primary ${hoverClass}`}
                                    aria-label={item.name}
                                >
                                    <item.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none text-primary ${hoverClass}`}
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
                        {menuItems.map(item => (
                             <a href={item.href} key={item.name} className={`text-primary block w-full text-center font-semibold px-3 py-4 text-lg rounded-md ${hoverClass}`}>
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="py-4 border-t border-gray-200">
                        <div className="flex justify-center items-center gap-6">
                             {socialLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-primary ${hoverClass}`}
                                    aria-label={item.name}
                                >
                                    <item.icon className="h-8 w-8" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
