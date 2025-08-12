import React, { useState, useEffect, useRef } from 'react';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import InstagramIcon from './icons/InstagramIcon';
import SoundCloudIcon from './icons/SoundCloudIcon';
import SpotifyIcon from './icons/SpotifyIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import PaperPlaneIcon from './icons/PaperPlaneIcon';
import PhoneIcon from './icons/PhoneIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import { Screen } from '../App';

interface HeaderProps {
    activeScreen: Screen;
    onNavigateDownloads: () => void;
    onNavigateHome: () => void;
    onNavigateToPage: (page: Screen) => void;
    onOpenSignUpModal: () => void;
}

type MenuItem = {
    name: string;
    href: string;
    type: 'modal' | 'download' | 'home' | 'external' | 'page';
    specialClass?: string;
    pageKey?: Screen;
};

const Header: React.FC<HeaderProps> = ({ activeScreen, onNavigateDownloads, onNavigateHome, onNavigateToPage, onOpenSignUpModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [glowingIndex, setGlowingIndex] = useState(-1);
    const menuRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const menuItems: MenuItem[] = [
        { name: 'Início', href: '#', type: 'home' },
        { name: 'Cadastre-se', href: '#', type: 'modal' },
        { name: 'Booker', href: '#', type: 'page', pageKey: 'booker' },
        { name: 'Amarasté Tribus', href: 'https://chat.whatsapp.com/FDjQZNsS4GVKfhKQCY7Qok', type: 'external' },
        { name: 'Produtos', href: '#', type: 'page', pageKey: 'produtosLogin', specialClass: 'm-2 backdrop-blur bg-white/20 rounded-xl shadow-lg' },
        { name: 'Filosofia', href: 'https://chat.whatsapp.com/FDjQZNsS4GVKfhKQCY7Qok', type: 'external' },
        { name: 'Ecossistema', href: 'https://chat.whatsapp.com/FDjQZNsS4GVKfhKQCY7Qok', type: 'external' },
    ];
    
    const downloadsItem: MenuItem = { name: 'Downloads', href: '#', type: 'download', specialClass: 'downloads-button-glow' };

    const socialLinks = [
        { name: 'Instagram', href: 'https://instagram.com/amarastelive', icon: InstagramIcon },
        { name: 'SoundCloud', href: 'https://soundcloud.com/amarastelive', icon: SoundCloudIcon },
        { name: 'Spotify', href: 'https://open.spotify.com/intl-pt/artist/3407XfslidAhQKTIaFW24m', icon: SpotifyIcon },
        { name: 'YouTube', href: 'https://www.youtube.com/amarastelive', icon: YouTubeIcon },
    ];

    const handleMenuItemClick = (e: React.MouseEvent, item: MenuItem) => {
        e.preventDefault();
        setIsOpen(false);
        switch (item.type) {
            case 'home':
                onNavigateHome();
                break;
            case 'download':
                onNavigateDownloads();
                break;
            case 'page':
                if (item.pageKey) {
                    onNavigateToPage(item.pageKey);
                }
                break;
            case 'modal':
                if (item.name === 'Cadastre-se') {
                    onOpenSignUpModal();
                } else {
                    setIsUpdateModalOpen(true);
                }
                break;
            case 'external':
                window.open(item.href, '_blank', 'noopener,noreferrer');
                break;
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (!isOpen) {
            setGlowingIndex(-1);
            return;
        }
        const interval = setInterval(() => {
            setGlowingIndex(prevIndex => (prevIndex + 1) % menuItems.length);
        }, 100); // 0.1 seconds per button
        return () => clearInterval(interval);
    }, [isOpen, menuItems.length]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);
    
    const isBookerTheme = activeScreen === 'booker';
    
    const headerBaseClasses = "fixed top-0 left-0 right-0 z-30 border-b shadow-sm transition-colors duration-300";
    const bookerHeaderClasses = "bg-black border-gray-800";
    const defaultHeaderClasses = scrolled ? 'bg-white/50 backdrop-blur-sm border-gray-200/50' : 'bg-white border-gray-200/50';

    const menuIconColorClass = isBookerTheme ? 'text-white' : 'text-primary';

    return (
        <>
            <header className={`${headerBaseClasses} ${isBookerTheme ? bookerHeaderClasses : defaultHeaderClasses}`}>
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between h-24">
                        
                        {/* Left Side */}
                        <div>
                            {isBookerTheme && (
                                <button onClick={onNavigateHome} className="text-white font-semibold text-lg px-3 py-2 rounded-md transition-colors hover:bg-white/10 active:scale-95">
                                    Home
                                </button>
                            )}
                        </div>

                        {/* Center (Default Theme) */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            {!isBookerTheme && (
                              <div className="flex items-center gap-6">
                                  {socialLinks.map((item) => (
                                      <a
                                          key={item.name}
                                          href={item.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`text-coke-red transition-all duration-200 neon-blink-red hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] active:scale-110`}
                                          aria-label={item.name}
                                      >
                                          <item.icon className="h-10 w-10" />
                                      </a>
                                  ))}
                              </div>
                            )}
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4" ref={menuRef}>
                            {isBookerTheme && (
                               <>
                                   <a href="https://instagram.com/amarastelive" target="_blank" rel="noopener noreferrer" className="text-white p-2 rounded-full transition-all duration-200 hover:bg-white/20 active:scale-95 hover:ring-1 hover:ring-white/50" aria-label="Instagram">
                                       <InstagramIcon className="h-6 w-6" />
                                   </a>
                                   <a href="https://wa.me/5575933002386" target="_blank" rel="noopener noreferrer" className="text-white p-2 rounded-full transition-all duration-200 hover:bg-white/20 active:scale-95 hover:ring-1 hover:ring-white/50" aria-label="Contato por WhatsApp">
                                       <PhoneIcon className="h-6 w-6" />
                                   </a>
                                   <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-white p-2 rounded-full transition-all duration-200 hover:bg-white/20 active:scale-95 hover:ring-1 hover:ring-white/50" aria-label="LinkedIn">
                                       <LinkedInIcon className="h-6 w-6" />
                                   </a>
                                   <a href="https://chat.whatsapp.com/FDjQZNsS4GVKfhKQCY7Qok" target="_blank" rel="noopener noreferrer" className="text-white p-2 rounded-full transition-all duration-200 hover:bg-white/20 active:scale-95 hover:ring-1 hover:ring-white/50" aria-label="Grupo de Membros">
                                       <UserGroupIcon className="h-6 w-6" />
                                   </a>
                               </>
                            )}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${menuIconColorClass} transition-all duration-300 hover:text-accent hover:drop-shadow-[0_0_5px_theme(colors.accent)]`}
                                aria-controls="dropdown-menu"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {isOpen && (
                <div
                    className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        ref={dropdownRef}
                        id="dropdown-menu"
                        onClick={(e) => e.stopPropagation()}
                        className="w-[90%] max-w-lg bg-white/30 backdrop-blur-md rounded-lg shadow-lg ring-1 ring-white/20 focus:outline-none animate-swoop-in"
                    >
                        <div className="flex flex-col py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {[...menuItems, downloadsItem].map((item, index) => (
                                <a
                                    href={item.href}
                                    key={item.name}
                                    target={item.type === 'external' ? '_blank' : undefined}
                                    rel={item.type === 'external' ? 'noopener noreferrer' : undefined}
                                    className={`text-white text-center font-semibold px-4 py-2 text-md transition-all duration-300 ease-out hover:bg-white/20 active:scale-105 block w-full border-t border-white/20 first:border-t-0
                                        ${item.type !== 'download' && index === glowingIndex ? 'neon-white-text-glow' : ''}
                                        ${item.specialClass || ''}`
                                    }
                                    role="menuitem"
                                    onClick={(e) => handleMenuItemClick(e, item)}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/50 backdrop-blur-md animate-swoop-in">
                    <div className="w-[90%] max-w-sm bg-blue-800/20 backdrop-blur-lg rounded-lg shadow-2xl ring-1 ring-white/20 p-8 flex flex-col items-center gap-6">
                        <p className="text-white text-xl text-center font-semibold">Estamos nesse momento atualizando o app…</p>
                        <button
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="text-white font-semibold px-8 py-3 rounded-md transition-all duration-200 hover:bg-white/10 ring-1 ring-white/30"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;