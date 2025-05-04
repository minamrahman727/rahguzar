"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { AlertTriangle, Info, X, ChevronDown, MapPin, Clock, ExternalLink, Calendar, Shield, List } from 'lucide-react';

type NotificationVariant = 'warning' | 'info' | 'error' | 'success';
type NotificationPosition = 'top' | 'bottom' | 'inline';

interface BannedRoad {
    id: number;
    name: string;
    details: string;
    isExpanded?: boolean;
}

interface NotificationBannerProps {
    className?: string;
    onClose?: () => void;
    showCloseButton?: boolean;
    persistent?: boolean;
    variant?: NotificationVariant;
    expandable?: boolean;
    pulseEffect?: boolean;
    position?: NotificationPosition;
    highlightWords?: boolean;
    animated?: boolean;
    showLocationPin?: boolean;
    glassmorphism?: boolean;
}

const BANNED_ROADS: BannedRoad[] = [
    { id: 1, name: "Shahrah-e-Faisal", details: "From Avari Light Signal to Madam Apartments" },
    { id: 2, name: "I.I. Chundrigar Road", details: "From Tower to Shaheen Complex" },
    { id: 3, name: "Shahrah-e-Quaideen", details: "From Numaish to Shahrah-e-Faisal Nursery" },
    { id: 4, name: "Sher Shah Suri Road", details: "From Matric Board Office to Nagan Chowrangi" },
    { id: 5, name: "Shaheed-e-Millat Road", details: "From Jail Chowrangi to Shaheed-e-Millat Expressway" },
    { id: 6, name: "Abdullah Haroon Road", details: "From Do Talwar to Hashoo Centre via Hoshang and Khayaban-e-Iqbal" },
    { id: 7, name: "Do Talwar to Shahrah-e-Firdous and Abdullah Shah Ghazi Mazar", details: "Complete ban" },
    { id: 8, name: "Stadium Road", details: "From Millennium Mall to New Town Police Station" },
    { id: 9, name: "Sir Shah Suleman Road", details: "From Sir Habib Ibrahim Rehmatullah Road to Hasan Square and Karsaz" },
    { id: 10, name: "Rashid Minhas Road", details: "From Drigh Road to Sohrab Goth" },
    { id: 11, name: "Mauripur Road", details: "From Gulbai to ICI Bridge" }
];

const ENFORCEMENT_DETAILS = {
    duration: "April 15 to June 14, 2025",
    legalBasis: "Section 144 CrPC; violations subject to action under Section 188 PPC",
    enforcement: "All Station House Officers (SHOs) have been directed to ensure strict compliance with the ban"
};

function NotificationBanner({
    className = '',
    onClose,
    showCloseButton = true,
    persistent = true,
    variant = 'warning',
    expandable = true,
    pulseEffect = true,
    position = 'inline',
    highlightWords = false,
    animated = true,
    showLocationPin = true,
    glassmorphism = true,
}: NotificationBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [expandedRoads, setExpandedRoads] = useState<Record<number, boolean>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRoads, setFilteredRoads] = useState<BannedRoad[]>(BANNED_ROADS);
    const bannerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const x = useMotionValue(0);
    const dragX = useMotionValue(0);
    const opacity = useTransform(dragX, [-100, 0], [0, 1]);

    const variantStyles = {
        warning: {
            bg: glassmorphism ? 'bg-amber-100/95 backdrop-blur-md' : 'bg-gradient-to-r from-amber-200 to-amber-100',
            border: 'border-l-8 border-amber-700',
            text: 'text-amber-900',
            icon: <AlertTriangle className="h-6 w-6 text-amber-700" />,
            pulse: 'bg-amber-600',
            accent: 'bg-amber-700',
            highlight: 'bg-amber-300 text-amber-900 px-1 rounded font-bold',
            shadow: 'shadow-2xl shadow-amber-300/40',
            button: 'bg-amber-700 hover:bg-amber-800 text-white'
        },
        info: {
            bg: glassmorphism ? 'bg-blue-100/95 backdrop-blur-md' : 'bg-gradient-to-r from-blue-200 to-blue-100',
            border: 'border-l-8 border-blue-700',
            text: 'text-blue-900',
            icon: <Info className="h-6 w-6 text-blue-700" />,
            pulse: 'bg-blue-600',
            accent: 'bg-blue-700',
            highlight: 'bg-blue-300 text-blue-900 px-1 rounded font-bold',
            shadow: 'shadow-2xl shadow-blue-300/40',
            button: 'bg-blue-700 hover:bg-blue-800 text-white'
        },
        error: {
            bg: glassmorphism ? 'bg-red-100/95 backdrop-blur-md' : 'bg-gradient-to-r from-red-200 to-red-100',
            border: 'border-l-8 border-red-700',
            text: 'text-red-900',
            icon: <AlertTriangle className="h-6 w-6 text-red-700" />,
            pulse: 'bg-red-600',
            accent: 'bg-red-700',
            highlight: 'bg-red-300 text-red-900 px-1 rounded font-bold',
            shadow: 'shadow-2xl shadow-red-300/40',
            button: 'bg-red-700 hover:bg-red-800 text-white'
        },
        success: {
            bg: glassmorphism ? 'bg-emerald-100/95 backdrop-blur-md' : 'bg-gradient-to-r from-emerald-200 to-emerald-100',
            border: 'border-l-8 border-emerald-700',
            text: 'text-emerald-900',
            icon: <Info className="h-6 w-6 text-emerald-700" />,
            pulse: 'bg-emerald-600',
            accent: 'bg-emerald-700',
            highlight: 'bg-emerald-300 text-emerald-900 px-1 rounded font-bold',
            shadow: 'shadow-2xl shadow-emerald-300/40',
            button: 'bg-emerald-700 hover:bg-emerald-800 text-white'
        }
    };

    const positionStyles = {
        top: 'fixed top-0 left-0 right-0 z-50 mx-4 mt-4 md:mx-auto md:max-w-2xl',
        bottom: 'fixed bottom-0 left-0 right-0 z-50 mx-4 mb-4 md:mx-auto md:max-w-2xl',
        inline: ''
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredRoads(BANNED_ROADS);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = BANNED_ROADS.filter(
                road => road.name.toLowerCase().includes(query) || 
                                road.details.toLowerCase().includes(query)
            );
            setFilteredRoads(filtered);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (!persistent) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [persistent, onClose]);

    useEffect(() => {
        if (!expandable || !isExpanded) return;
        function handleClickOutside(event: MouseEvent) {
            if (bannerRef.current && !bannerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isExpanded, expandable]);

    useEffect(() => {
        if (animated) {
            const sequence = async () => {
                await controls.start({
                    x: [-2, 2, -2, 2, 0],
                    transition: { duration: 0.5 }
                });
            };
            sequence();
        }
    }, [controls, animated]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleRoadExpand = (id: number) => {
        setExpandedRoads(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const style = variantStyles[variant];
    const posStyle = positionStyles[position];

    const containerVariants = {
        hidden: { opacity: 0, y: position === 'bottom' ? 50 : -50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0, 
            y: position === 'bottom' ? 20 : -20,
            transition: { duration: 0.3, ease: "easeOut" },
        }
    };

    const getHighlightedText = (text: string) => {
        if (!highlightWords) {
            return text;
        }
        const wordsToHighlight = ["banned", "restricted"];
        const regex = new RegExp(`\\b(${wordsToHighlight.join('|')})\\b`, 'gi');
        return text.split(regex).map((part, index) => {
            if (wordsToHighlight.some(word => part.toLowerCase() === word.toLowerCase())) {
                return <span key={index} className={style.highlight}>{part}</span>;
            }
            return part;
        });
    };

    const expandVariants = {
        collapsed: { height: 0, opacity: 0 },
        expanded: { 
            height: "auto", 
            opacity: 1,
            transition: {
                height: {
                    duration: 0.5,
                    ease: [0.04, 0.62, 0.23, 0.98]
                },
                opacity: {
                    duration: 0.25,
                    delay: 0.2
                },
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const onDragEnd = () => {
        if (dragX.get() < -80) {
            setIsVisible(false);
            if (onClose) onClose();
        } else {
            dragX.set(0);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                ref={bannerRef}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ x, opacity }}
                drag={showCloseButton ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                dragDirectionLock
                onDrag={(_, info) => {
                    if (info.offset.x < 0) {
                        dragX.set(info.offset.x);
                    }
                }}
                className={`${style.bg} ${style.border} ${style.text} p-5 rounded-xl ${style.shadow} relative overflow-hidden ${posStyle} ${className} focus:outline-none focus:ring-4 focus:ring-black/30`}
                role="alert"
                aria-live="assertive"
                tabIndex={0}
            >
                {pulseEffect && (
                    <motion.div 
                        className={`absolute -top-12 -right-12 rounded-full w-32 h-32 ${style.pulse} opacity-40`}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    />
                )}
                {showLocationPin && (
                    <motion.div 
                        className={`absolute top-2 left-2 ${style.text} opacity-20`}
                        animate={{
                            rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                    >
                        <MapPin className="h-20 w-20" />
                    </motion.div>
                )}
                {glassmorphism && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md -z-10" />
                )}
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center flex-1">
                        <motion.div 
                            className="mr-4 flex-shrink-0"
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            {style.icon}
                        </motion.div>
                        <div className="flex-1">
                            <div className="text-base md:text-lg font-extrabold flex items-center">
                                {getHighlightedText("Three wheelers banned throughout Karachi on 11 roads")}
                                {expandable && (
                                    <motion.button 
                                        onClick={toggleExpand} 
                                        className={`ml-2 p-2 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors`}
                                        whileHover={{ scale: 1.1, rotate: isExpanded ? -180 : 0 }}
                                        whileTap={{ scale: 0.9 }}
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        aria-expanded={isExpanded}
                                        aria-label={isExpanded ? "Show less information" : "Show more information"}
                                    >
                                        <ChevronDown className={`h-5 w-5 ${style.text}`} />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                    {showCloseButton && (
                        <motion.button 
                            onClick={handleClose}
                            className={`ml-3 p-2 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors flex-shrink-0`}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Close notification"
                        >
                            <X className={`h-5 w-5 ${style.text}`} />
                        </motion.button>
                    )}
                </div>
                {expandable && (
                    <motion.div
                        variants={expandVariants}
                        initial="collapsed"
                        animate={isExpanded ? "expanded" : "collapsed"}
                        className="overflow-hidden"
                    >
                        <motion.div 
                            className="mt-4 pt-4 border-t border-opacity-30"
                            style={{ borderColor: style.accent }}
                            variants={itemVariants}
                        >
                            <div className="flex space-x-2 mb-4 flex-wrap">
                                <motion.button
                                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors mb-2 focus:outline-none focus:ring-2 focus:ring-black/30 ${activeTab === 0 ? style.button : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                    onClick={() => setActiveTab(0)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Show banned roads"
                                >
                                    <div className="flex items-center">
                                        <List className="h-4 w-4 mr-2" />
                                        <span>Banned Roads</span>
                                    </div>
                                </motion.button>
                                <motion.button
                                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors mb-2 focus:outline-none focus:ring-2 focus:ring-black/30 ${activeTab === 1 ? style.button : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                    onClick={() => setActiveTab(1)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Show enforcement details"
                                >
                                    <div className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2" />
                                        <span>Enforcement</span>
                                    </div>
                                </motion.button>
                                <motion.button
                                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors mb-2 focus:outline-none focus:ring-2 focus:ring-black/30 ${activeTab === 2 ? style.button : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                    onClick={() => setActiveTab(2)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Show timeline"
                                >
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Timeline</span>
                                    </div>
                                </motion.button>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 0 && (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search roads..."
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    className="w-full px-4 py-2 bg-white bg-opacity-90 rounded-md border border-gray-300 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/30"
                                                    style={{ borderColor: 'rgba(0,0,0,0.15)' }}
                                                    aria-label="Search roads"
                                                />
                                                {searchQuery && (
                                                    <button
                                                        onClick={() => setSearchQuery('')}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                        aria-label="Clear search"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-64 overflow-y-auto pr-1 space-y-3">
                                                {filteredRoads.length > 0 ? (
                                                    filteredRoads.map((road) => (
                                                        <motion.div 
                                                            key={road.id}
                                                            className="bg-white bg-opacity-90 p-3 rounded-md shadow border border-gray-200"
                                                            whileHover={{ x: 3 }}
                                                            variants={itemVariants}
                                                            layout
                                                        >
                                                            <div 
                                                                className="flex justify-between items-center cursor-pointer"
                                                                onClick={() => toggleRoadExpand(road.id)}
                                                                tabIndex={0}
                                                                aria-expanded={!!expandedRoads[road.id]}
                                                                aria-label={`Expand details for ${road.name}`}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter' || e.key === ' ') toggleRoadExpand(road.id);
                                                                }}
                                                            >
                                                                <span className={`font-semibold text-base flex-1 ${style.text}`}>{road.id}. {road.name}</span>
                                                                <motion.button
                                                                    animate={{ rotate: expandedRoads[road.id] ? 180 : 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="ml-2 p-1 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors"
                                                                    aria-label={expandedRoads[road.id] ? "Collapse details" : "Expand details"}
                                                                >
                                                                    <ChevronDown className={`h-4 w-4 ${style.text}`} />
                                                                </motion.button>
                                                            </div>
                                                            <AnimatePresence>
                                                                {expandedRoads[road.id] && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-700">
                                                                            {road.details}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-sm text-gray-500 py-4">
                                                        No roads found matching &quot;{searchQuery}&quot;
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-sm text-center opacity-70">
                                                Showing {filteredRoads.length} of {BANNED_ROADS.length} roads
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 1 && (
                                        <div className="space-y-4">
                                            <motion.div 
                                                className="bg-white bg-opacity-90 p-4 rounded-md"
                                                variants={itemVariants}
                                            >
                                                <div className="mb-3">
                                                    <div className="flex items-center mb-1">
                                                        <Calendar className={`h-5 w-5 mr-2 ${style.text}`} />
                                                        <span className={`font-semibold text-base ${style.text}`}>Duration</span>
                                                    </div>
                                                    <p className="text-sm ml-7">{ENFORCEMENT_DETAILS.duration}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="flex items-center mb-1">
                                                        <Shield className={`h-5 w-5 mr-2 ${style.text}`} />
                                                        <span className={`font-semibold text-base ${style.text}`}>Legal Basis</span>
                                                    </div>
                                                    <p className="text-sm ml-7">{ENFORCEMENT_DETAILS.legalBasis}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <AlertTriangle className={`h-5 w-5 mr-2 ${style.text}`} />
                                                        <span className={`font-semibold text-base ${style.text}`}>Enforcement</span>
                                                    </div>
                                                    <p className="text-sm ml-7">{ENFORCEMENT_DETAILS.enforcement}</p>
                                                </div>
                                            </motion.div>
                                            <motion.div 
                                                className={`${style.bg.replace('/95', '')} p-3 rounded-md flex items-center text-sm ${style.text}`}
                                                variants={itemVariants}
                                            >
                                                <Info className={`h-5 w-5 mr-2 flex-shrink-0 ${style.text}`} />
                                                <span>Violations are subject to legal action under Section 188 of Pakistan Penal Code</span>
                                            </motion.div>
                                        </div>
                                    )}
                                    {activeTab === 2 && (
                                        <div className="space-y-4">
                                            <div className={`ml-2 border-l-4 border-dashed border-opacity-70 pl-6 space-y-4`}
                                                     style={{ borderColor: variantStyles[variant].accent }}>
                                                <motion.div 
                                                    variants={itemVariants}
                                                    className="relative"
                                                >
                                                    <div className="absolute -left-7 w-4 h-4 rounded-full bg-opacity-100 mt-1" style={{ backgroundColor: variantStyles[variant].accent }} />
                                                    <p className={`font-semibold text-base ${style.text}`}>April 15, 2025</p>
                                                    <p className="text-sm opacity-80">Ban goes into effect</p>
                                                </motion.div>
                                                <motion.div 
                                                    variants={itemVariants}
                                                    className="relative"
                                                >
                                                    <div className="absolute -left-7 w-4 h-4 rounded-full bg-opacity-70 mt-1" style={{ backgroundColor: variantStyles[variant].accent }} />
                                                    <p className={`font-semibold text-base ${style.text}`}>May 15, 2025</p>
                                                    <p className="text-sm opacity-80">Mid-term review of ban implementation</p>
                                                </motion.div>
                                                <motion.div 
                                                    variants={itemVariants}
                                                    className="relative"
                                                >
                                                    <div className="absolute -left-7 w-4 h-4 rounded-full bg-opacity-40 mt-1" style={{ backgroundColor: variantStyles[variant].accent }} />
                                                    <p className={`font-semibold text-base ${style.text}`}>June 14, 2025</p>
                                                    <p className="text-sm opacity-80">Ban scheduled to end (subject to review)</p>
                                                </motion.div>
                                                <motion.div 
                                                    variants={itemVariants}
                                                    className="relative"
                                                >
                                                    <div className="absolute -left-7 w-4 h-4 rounded-full bg-opacity-40 mt-1" style={{ backgroundColor: variantStyles[variant].accent }} />
                                                    <p className={`font-semibold text-base ${style.text}`}>June 15, 2025</p>
                                                    <p className="text-sm opacity-80">Ban scheduled to be imposed parmanently</p>
                                                </motion.div>
                                                <motion.div 
                                                    variants={itemVariants}
                                                    className="relative mt-4"
                                                >
                                                    <div className="text-sm italic flex items-center opacity-80">
                                                        <Clock className={`h-4 w-4 mr-2 ${style.text}`} />
                                                        <span>Timeline subject to change by authorities</span>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            <motion.div 
                                className="mt-6 pt-3 border-t border-gray-300 border-opacity-50 text-sm flex justify-between items-center opacity-80"
                                variants={itemVariants}
                            >
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>Last updated: 11:40 AM 4/5/2025</span>
                                </div>
                                <div>
                                    <motion.button
                                        className={`text-sm flex items-center opacity-80 hover:opacity-100 ${style.text} focus:outline-none focus:ring-2 focus:ring-black/30`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="Official news link"
                                    >
                                        <span className="underline">
                                           <Link href="https://arynews.tv/karachi-enforces-rickshaw-ban-on-11-busy-roads/">Official News</Link> 
                                        </span>
                                        <ExternalLink className="h-3 w-3 ml-2" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: dragX.get() < 0 ? Math.min(Math.abs(dragX.get()) / 100, 1) : 0 }}
                >
                    <motion.div 
                        className="h-full"
                        style={{ 
                            width: `${Math.min(Math.abs(dragX.get()) / 100 * 100, 100)}%`,
                            backgroundColor: variantStyles[variant].accent
                        }}
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default NotificationBanner;
