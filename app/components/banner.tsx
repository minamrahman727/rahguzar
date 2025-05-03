"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { AlertTriangle, Info, X, ChevronDown, MapPin, Clock, ExternalLink, Calendar, Shield, List } from 'lucide-react';

// Define the types for the notification banner
type NotificationVariant = 'warning' | 'info' | 'error' | 'success';
type NotificationPosition = 'top' | 'bottom' | 'inline';

// Interface for banned road data
interface BannedRoad {
    id: number;
    name: string;
    details: string;
    isExpanded?: boolean;
}

// Interface for the NotificationBanner props
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

// Banned roads data
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

// Enforcement details
const ENFORCEMENT_DETAILS = {
    duration: "April 15 to June 14, 2025",
    legalBasis: "Section 144 CrPC; violations subject to action under Section 188 PPC",
    enforcement: "All Station House Officers (SHOs) have been directed to ensure strict compliance with the ban"
};

// NotificationBanner component
export default function NotificationBanner({
    className = '',
    onClose,
    showCloseButton = true,
    persistent = true,
    variant = 'warning',
    expandable = true,
    pulseEffect = true,
    position = 'inline',
    animated = true,
    showLocationPin = true,
    glassmorphism = true,
}: NotificationBannerProps) {
    // State for controlling banner visibility
    const [isVisible, setIsVisible] = useState(true);
    // State for controlling the expanded state of the banner
    const [isExpanded, setIsExpanded] = useState(false);
    // State for managing the active tab in the expanded content
    const [activeTab, setActiveTab] = useState(0);
    // State to manage the expanded state of individual roads
    const [expandedRoads, setExpandedRoads] = useState<Record<number, boolean>>({});
    // State for the search query
    const [searchQuery, setSearchQuery] = useState('');
    // State for the filtered list of banned roads based on search query
    const [filteredRoads, setFilteredRoads] = useState<BannedRoad[]>(BANNED_ROADS);
    // Ref for the banner element to detect outside clicks
    const bannerRef = useRef<HTMLDivElement>(null);
    // Animation controls for Framer Motion
    const controls = useAnimation();
    // Motion value for horizontal movement
    const x = useMotionValue(0);
    // Motion value for drag gesture
    const dragX = useMotionValue(0);
    // Opacity based on dragX value
    const opacity = useTransform(dragX, [-100, 0], [0, 1]);

    // Refined variant-based styles with improved color harmonies
    const variantStyles = {
        warning: {
            bg: glassmorphism ? 'bg-amber-50/90 backdrop-blur-sm' : 'bg-gradient-to-r from-amber-50 to-amber-100',
            border: 'border-l-4 border-amber-600',
            text: 'text-amber-900',
            icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
            pulse: 'bg-amber-500',
            accent: 'bg-amber-600',
            highlight: 'bg-amber-200 text-amber-900 px-1 rounded',
            shadow: 'shadow-amber-200',
            button: 'bg-amber-600 hover:bg-amber-700 text-white'
        },
        info: {
            bg: glassmorphism ? 'bg-blue-50/90 backdrop-blur-sm' : 'bg-gradient-to-r from-blue-50 to-blue-100',
            border: 'border-l-4 border-blue-600',
            text: 'text-blue-900',
            icon: <Info className="h-5 w-5 text-blue-600" />,
            pulse: 'bg-blue-500',
            accent: 'bg-blue-600',
            highlight: 'bg-blue-200 text-blue-900 px-1 rounded',
            shadow: 'shadow-blue-200',
            button: 'bg-blue-600 hover:bg-blue-700 text-white'
        },
        error: {
            bg: glassmorphism ? 'bg-red-50/90 backdrop-blur-sm' : 'bg-gradient-to-r from-red-50 to-red-100',
            border: 'border-l-4 border-red-600',
            text: 'text-red-900',
            icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
            pulse: 'bg-red-500',
            accent: 'bg-red-600',
            highlight: 'bg-red-200 text-red-900 px-1 rounded',
            shadow: 'shadow-red-200',
            button: 'bg-red-600 hover:bg-red-700 text-white'
        },
        success: {
            bg: glassmorphism ? 'bg-emerald-50/90 backdrop-blur-sm' : 'bg-gradient-to-r from-emerald-50 to-emerald-100',
            border: 'border-l-4 border-emerald-600',
            text: 'text-emerald-900',
            icon: <Info className="h-5 w-5 text-emerald-600" />,
            pulse: 'bg-emerald-500',
            accent: 'bg-emerald-600',
            highlight: 'bg-emerald-200 text-emerald-900 px-1 rounded',
            shadow: 'shadow-emerald-200',
            button: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        }
    };

    // Position-based styles
    const positionStyles = {
        top: 'fixed top-0 left-0 right-0 z-50 mx-4 mt-4 md:mx-auto md:max-w-2xl',
        bottom: 'fixed bottom-0 left-0 right-0 z-50 mx-4 mb-4 md:mx-auto md:max-w-2xl',
        inline: ''
    };

    // Filter roads based on search query
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

    // Auto-dismiss timer
    useEffect(() => {
        if (!persistent) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [persistent, onClose]);

    // Click outside to collapse
    useEffect(() => {
        if (!expandable) return;
        
        const handleClickOutside = (event: MouseEvent) => {
            if (bannerRef.current && !bannerRef.current.contains(event.target as Node) && isExpanded) {
                setIsExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded, expandable]);

    // Attention-getting effect on initial render
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

    // Function to handle closing the banner
    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    // Function to toggle the expanded state of the banner
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Function to toggle the expanded state of a road
    const toggleRoadExpand = (id: number) => {
        setExpandedRoads(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Function to handle changes in the search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Get the styles based on the variant
    const style = variantStyles[variant];
    // Get the position styles
    const posStyle = positionStyles[position];

    // Animation variants
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
            transition: { duration: 0.3, ease: "easeOut" }
        }
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

    // Create highlighted text content
    
    // Swipe to dismiss
    const onDragEnd = () => {
        if (dragX.get() < -80) {
            setIsVisible(false);
            if (onClose) onClose();
        } else {
            dragX.set(0);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={bannerRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
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
                    className={`${style.bg} ${style.border} ${style.text} p-4 rounded-lg ${style.shadow} relative overflow-hidden ${posStyle} ${className}`}
                    role="alert"
                    aria-live="assertive"
                >
                    {/* Decorative elements */}
                    {pulseEffect && (
                        <motion.div 
                            className={`absolute -top-12 -right-12 rounded-full w-24 h-24 ${style.pulse} opacity-30`}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.6, 0.3]
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
                            className={`absolute top-1 left-1 ${style.text} opacity-10`}
                            animate={{
                                rotate: [0, 5, 0, -5, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <MapPin className="h-16 w-16" />
                        </motion.div>
                    )}
                    
                    {glassmorphism && (
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10" />
                    )}
                    
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center flex-1">
                            <motion.div 
                                className="mr-3 flex-shrink-0"
                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                {style.icon}
                            </motion.div>
                            <div className="flex-1">
                                <div className="text-sm md:text-base font-black flex items-center">
                                 
three wheelers banned on specefic roads
                                    
                                    {expandable && (
                                        <motion.button 
                                            onClick={toggleExpand} 
                                            className={`ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors`}
                                            whileHover={{ scale: 1.1, rotate: isExpanded ? -180 : 0 }}
                                            whileTap={{ scale: 0.9 }}
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            aria-expanded={isExpanded}
                                            aria-label={isExpanded ? "Show less information" : "Show more information"}
                                        >
                                            <ChevronDown className={`h-4 w-4 ${style.text}`} />
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {showCloseButton && (
                            <motion.button 
                                onClick={handleClose}
                                className={`ml-3 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors flex-shrink-0`}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close notification"
                            >
                                <X className={`h-4 w-4 ${style.text}`} />
                            </motion.button>
                        )}
                    </div>
                    
                    {/* Expandable content with tabs */}
                    {expandable && (
                        <motion.div
                            variants={expandVariants}
                            initial="collapsed"
                            animate={isExpanded ? "expanded" : "collapsed"}
                            className="overflow-hidden"
                        >
                            <motion.div 
                                className="mt-3 pt-3 border-t border-opacity-20"
                                style={{ borderColor: `rgba(var(--${variant}-600-rgb), 0.3)` }}
                                variants={itemVariants}
                            >
                                {/* Tabs */}
                                <div className="flex space-x-2 mb-3 flex-wrap">
                                    <motion.button
                                        className={`px-3 py-1  text-xs font-medium transition-colors mb-2 ${activeTab === 0 ? style.button : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                        onClick={() => setActiveTab(0)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="flex items-center">
                                            <List className="h-3 w-3 mr-1" />
                                            <span>Banned Roads</span>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors mb-2 ${activeTab === 1 ? style.button : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                        onClick={() => setActiveTab(1)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="flex items-center">
                                            <Shield className="h-3 w-3 mr-1" />
                                            <span>Enforcement</span>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors mb-2 ${activeTab === 2 ? style.button : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                        onClick={() => setActiveTab(2)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            <span>Timeline</span>
                                        </div>
                                    </motion.button>
                                </div>
                                
                                {/* Tab content */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeTab === 0 && (
                                            <div className="space-y-3">
                                                {/* Search input */}
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Search roads..."
                                                        value={searchQuery}
                                                        onChange={handleSearchChange}
                                                        className="w-full px-3 py-2 bg-white bg-opacity-70 rounded-md border border-gray-200 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                        style={{ 
                                                                borderColor: 'rgba(0,0,0,0.1)' 
                                                            }}
                                                    />
                                                    {searchQuery && (
                                                        <button
                                                            onClick={() => setSearchQuery('')}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {/* Roads list */}
                                                <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
                                                    {filteredRoads.length > 0 ? (
                                                        filteredRoads.map((road) => (
                                                            <motion.div 
                                                                key={road.id}
                                                                className="bg-white bg-opacity-60 p-2 rounded-md shadow-sm border border-gray-100"
                                                                whileHover={{ x: 3 }}
                                                                variants={itemVariants}
                                                                layout
                                                            >
                                                                <div 
                                                                    className="flex justify-between items-center cursor-pointer"
                                                                    onClick={() => toggleRoadExpand(road.id)}
                                                                >
                                                                    <span className={`font-medium text-sm flex-1 ${style.text}`}>{road.id}. {road.name}</span>
                                                                    <motion.button
                                                                        animate={{ rotate: expandedRoads[road.id] ? 180 : 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
                                                                    >
                                                                        <ChevronDown className={`h-3 w-3 ${style.text}`} />
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
                                                                            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                                                                                {road.details}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center text-xs text-gray-500 py-4">
                                                            No roads found matching &quot;{searchQuery}&quot;
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Count badge */}
                                                <div className="text-xs text-center opacity-60">
                                                    Showing {filteredRoads.length} of {BANNED_ROADS.length} roads
                                                </div>
                                            </div>
                                        )}
                                        
                                        {activeTab === 1 && (
                                            <div className="space-y-3">
                                                <motion.div 
                                                    className="bg-white bg-opacity-60 p-3 rounded-md"
                                                    variants={itemVariants}
                                                >
                                                    <div className="mb-2">
                                                        <div className="flex items-center mb-1">
                                                            <Calendar className={`h-4 w-4 mr-2 ${style.text}`} />
                                                            <span className={`font-medium text-sm ${style.text}`}>Duration</span>
                                                        </div>
                                                        <p className="text-xs ml-6">{ENFORCEMENT_DETAILS.duration}</p>
                                                    </div>
                                                    
                                                    <div className="mb-2">
                                                        <div className="flex items-center mb-1">
                                                            <Shield className={`h-4 w-4 mr-2 ${style.text}`} />
                                                            <span className={`font-medium text-sm ${style.text}`}>Legal Basis</span>
                                                        </div>
                                                        <p className="text-xs ml-6">{ENFORCEMENT_DETAILS.legalBasis}</p>
                                                    </div>
                                                    
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <AlertTriangle className={`h-4 w-4 mr-2 ${style.text}`} />
                                                            <span className={`font-medium text-sm ${style.text}`}>Enforcement</span>
                                                        </div>
                                                        <p className="text-xs ml-6">{ENFORCEMENT_DETAILS.enforcement}</p>
                                                    </div>
                                                </motion.div>
                                                
                                                <motion.div 
                                                    className={`${style.bg.replace('/90', '')} p-2 rounded-md flex items-center text-xs ${style.text}`}
                                                    variants={itemVariants}
                                                >
                                                    <Info className={`h-4 w-4 mr-2 flex-shrink-0 ${style.text}`} />
                                                    <span>Violations are subject to legal action under Section 188 of Pakistan Penal Code</span>
                                                </motion.div>
                                            </div>
                                        )}
                                        
                                        {activeTab === 2 && (
                                            <div className="space-y-3">
                                                <div className={`ml-2 border-l-2 border-dashed border-opacity-50 pl-4 space-y-3`}
                                                         style={{ borderColor: variantStyles[variant].accent }}>
                                                    <motion.div 
                                                        variants={itemVariants}
                                                        className="relative"
                                                    >
                                                        <div className="absolute -left-6 w-3 h-3 rounded-full bg-opacity-100 mt-1" style={{ backgroundColor: variantStyles[variant].accent }} />
                                                        <p className={`font-medium text-sm ${style.text}`}>April 15, 2025</p>
                                                        <p className="text-xs opacity-75">Ban goes into effect</p>
                                                    </motion.div>
                                                    
                                                    <motion.div 
                                                        variants={itemVariants}
                                                        className="relative"
                                                    >
                                                        <div className="absolute -left-6 w-3 h-3 rounded-full bg-opacity-70 mt-1" style={{ backgroundColor: variantStyles[variant].accent }} />
                                                        <p className={`font-medium text-sm ${style.text}`}>May 15, 2025</p>
                                                        <p className="text-xs opacity-75">Mid-term review of ban implementation</p>
                                                    </motion.div>
                                                    
                                                    <motion.div 
                                                        variants={itemVariants}
                                                        className="relative"
                                                    >
                                                        <div className="absolute -left-6 w-3 h-3 rounded-full bg-opacity-40 mt-1" style={{ backgroundColor: variantStyles[variant].accent }} />
                                                        <p className={`font-medium text-sm ${style.text}`}>June 14, 2025</p>
                                                        <p className="text-xs opacity-75">Ban scheduled to end (subject to review)</p>
                                                    </motion.div>
                                                    
                                                    <motion.div 
                                                        variants={itemVariants}
                                                        className="relative mt-4"
                                                    >
                                                        <div className="text-xs italic flex items-center opacity-75">
                                                            <Clock className={`h-3 w-3 mr-1 ${style.text}`} />
                                                            <span>Timeline subject to change by authorities</span>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                                
                                {/* Footer with quick info */}
                                <motion.div 
                                    className="mt-4 pt-2 border-t border-gray-200 border-opacity-30 text-xs flex justify-between items-center opacity-70"
                                    variants={itemVariants}
                                >
                                    <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>Last updated: 1:45 AM 4/5/2025</span>
                                    </div>
                                    <div>
                                        <motion.button
                                            className={`text-xs flex items-center opacity-70 hover:opacity-100 ${style.text}`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="underline">
                                               <Link href="https://arynews.tv/karachi-enforces-rickshaw-ban-on-11-busy-roads/">Official Notice</Link> 
                                                </span>
                                            <ExternalLink className="h-2 w-2 ml-1" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Swipe indicator */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"
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
            )}
        </AnimatePresence>
    );
}