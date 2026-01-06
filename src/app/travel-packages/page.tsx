"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plane, Hotel, Utensils, Camera, Car, FileText, Wine, Droplets, BookOpen, Building, Check, Phone, Mail, MapPin, X, Users, Wallet, Headset, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface TravelPackage {
    id: string;
    name: string;
    destination: string;
    duration: string;
    description: string;
    originalPrice: string;
    price: string;
    image: string;
    tag?: string;
    tagStyle?: "popular" | "special";
    inclusions: { icon: string; text: string }[];
    buttonStyle: "outline" | "filled";
}

const travelPackages: TravelPackage[] = [
    {
        id: "zanzibar",
        name: "Zanzibar Escape",
        destination: "Zanzibar",
        duration: "5 Days, 4 Nights | Stone Town & Beach",
        description: "Experience the beautiful beaches and rich culture of Zanzibar",
        originalPrice: "₦1.5M",
        price: "₦1,250,000",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "POPULAR",
        tagStyle: "popular",
        inclusions: [
            { icon: "plane", text: "Return Flights (Lagos)" },
            { icon: "hotel", text: "4-Star Beach Resort" },
            { icon: "utensils", text: "Breakfast & Dinner" },
            { icon: "passport", text: "Visa Assistance" },
        ],
        buttonStyle: "outline",
    },
    {
        id: "maldives",
        name: "Maldives Luxury",
        destination: "Maldives",
        duration: "6 Days | Overwater Villa Experience",
        description: "Ultimate luxury honeymoon in paradise",
        originalPrice: "₦3.2M",
        price: "₦2,850,000",
        image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "HONEYMOON SPECIAL",
        tagStyle: "special",
        inclusions: [
            { icon: "plane", text: "Qatar/Emirates Flights" },
            { icon: "water", text: "Speedboat Transfer" },
            { icon: "wine", text: "All-Inclusive Drinks" },
            { icon: "camera", text: "Free Photoshoot" },
        ],
        buttonStyle: "filled",
    },
    {
        id: "dubai",
        name: "Dubai Shopping",
        destination: "Dubai",
        duration: "5 Days | City & Desert Safari",
        description: "Shopping, luxury, and desert adventures",
        originalPrice: "₦900k",
        price: "₦750,000",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inclusions: [
            { icon: "plane", text: "Direct Flights" },
            { icon: "building", text: "4-Star Downtown Hotel" },
            { icon: "car", text: "Desert Safari & BBQ" },
            { icon: "file", text: "UAE Visa Included" },
        ],
        buttonStyle: "outline",
    },
    {
        id: "paris",
        name: "Paris Romance",
        destination: "Paris",
        duration: "7 Days | City of Love Experience",
        description: "Romantic getaway in the heart of France",
        originalPrice: "₦2.8M",
        price: "₦2,450,000",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "BESTSELLER",
        tagStyle: "popular",
        inclusions: [
            { icon: "plane", text: "Return Flights" },
            { icon: "hotel", text: "4-Star Champs-Élysées Hotel" },
            { icon: "utensils", text: "Seine River Dinner Cruise" },
            { icon: "camera", text: "Eiffel Tower Experience" },
        ],
        buttonStyle: "outline",
    },
    {
        id: "bali",
        name: "Bali Bliss",
        destination: "Bali",
        duration: "8 Days | Temples, Rice Fields & Beaches",
        description: "Discover the magic of Indonesia",
        originalPrice: "₦1.8M",
        price: "₦1,550,000",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        inclusions: [
            { icon: "plane", text: "Return Flights via Singapore" },
            { icon: "hotel", text: "Ubud Villa + Beach Resort" },
            { icon: "utensils", text: "Daily Breakfast" },
            { icon: "car", text: "Private Driver & Tours" },
        ],
        buttonStyle: "filled",
    },
    {
        id: "cape-town",
        name: "Cape Town Safari",
        destination: "Cape Town",
        duration: "6 Days | City, Wine & Wildlife",
        description: "South Africa's finest experiences",
        originalPrice: "₦2.2M",
        price: "₦1,950,000",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "VISA-FREE",
        tagStyle: "popular",
        inclusions: [
            { icon: "plane", text: "Direct Flights" },
            { icon: "hotel", text: "Waterfront Boutique Hotel" },
            { icon: "wine", text: "Cape Winelands Tour" },
            { icon: "camera", text: "Table Mountain Cable Car" },
        ],
        buttonStyle: "outline",
    },
];

const getIcon = (iconName: string) => {
    const iconClass = "w-5 h-5 text-cyan-500";
    switch (iconName) {
        case "plane": return <Plane className={iconClass} />;
        case "hotel": return <Hotel className={iconClass} />;
        case "utensils": return <Utensils className={iconClass} />;
        case "passport": return <BookOpen className={iconClass} />;
        case "water": return <Droplets className={iconClass} />;
        case "wine": return <Wine className={iconClass} />;
        case "camera": return <Camera className={iconClass} />;
        case "building": return <Building className={iconClass} />;
        case "car": return <Car className={iconClass} />;
        case "file": return <FileText className={iconClass} />;
        default: return <Plane className={iconClass} />;
    }
};

export default function TravelPackagesPage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        numberOfTravellers: "1",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openModal = (pkg: TravelPackage) => {
        setSelectedPackage(pkg);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPackage(null);
        setFormData({ fullName: "", email: "", phone: "", numberOfTravellers: "1" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPackage || !formData.fullName || !formData.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/travel-packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: formData.fullName,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    numberOfTravellers: formData.numberOfTravellers,
                    packageName: selectedPackage.name,
                    destination: selectedPackage.destination,
                    duration: selectedPackage.duration,
                    price: selectedPackage.price,
                }),
            });

            if (response.ok) {
                toast.success("Inquiry submitted! Check your email for confirmation.");
                closeModal();
            } else {
                toast.error("Failed to submit inquiry. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            toast.error("Failed to submit inquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <section className="pt-32 pb-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold text-customBlue mb-4">Trending Getaways</h1>
                        <div className="h-1 w-24 bg-cyan-500 mx-auto rounded"></div>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                            Exclusive all-inclusive packages for honeymoons, family vacations, and solo adventures. Curated by VisionFly experts.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-12 flex-wrap">
                        <button className="px-6 py-2 bg-customBlue text-white rounded-full text-sm font-semibold shadow-lg">All Deals</button>
                        <button className="px-6 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-full text-sm font-semibold border border-gray-200">Honeymoon</button>
                        <button className="px-6 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-full text-sm font-semibold border border-gray-200">Visa-Free</button>
                        <button className="px-6 py-2 bg-white text-gray-600 hover:bg-gray-100 rounded-full text-sm font-semibold border border-gray-200">European Summer</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {travelPackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                                {pkg.tag && pkg.tagStyle === "special" && (
                                    <div className="absolute top-0 left-0 bg-customBlue text-white text-xs font-bold px-4 py-2 rounded-br-lg z-10">
                                        {pkg.tag}
                                    </div>
                                )}
                                <div className="relative h-64">
                                    <img 
                                        src={pkg.image} 
                                        alt={pkg.name} 
                                        className="w-full h-full object-cover"
                                    />
                                    {pkg.tag && pkg.tagStyle === "popular" && (
                                        <div className="absolute top-4 right-4 bg-cyan-500 text-white font-bold px-3 py-1 rounded text-xs shadow-md">
                                            {pkg.tag}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-xl text-customBlue">{pkg.name}</h3>
                                        <div className="text-right">
                                            <span className="block text-xs text-gray-400 line-through">{pkg.originalPrice}</span>
                                            <span className="block font-bold text-customBlue text-lg">{pkg.price}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">{pkg.duration}</p>
                                    
                                    <ul className="text-sm text-gray-600 space-y-2 mb-6 flex-grow">
                                        {pkg.inclusions.map((item, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                {getIcon(item.icon)}
                                                <span>{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button 
                                        onClick={() => openModal(pkg)}
                                        className={`w-full font-bold py-3 rounded-lg transition ${
                                            pkg.buttonStyle === "filled" 
                                                ? "bg-cyan-500 text-white hover:bg-cyan-600 shadow-md" 
                                                : "border-2 border-customBlue text-customBlue hover:bg-customBlue hover:text-white"
                                        }`}
                                    >
                                        Reserve Spot
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-500 mb-4">Don&apos;t see what you like?</p>
                        <Link href="#custom-plan" className="inline-flex items-center font-bold text-customBlue hover:text-cyan-500 transition">
                            Browse Custom Packages <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section id="custom-plan" className="py-20 bg-customBlue text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Dream, <span className="text-cyan-400">Your Budget.</span></h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Not everyone fits into a pre-made package. Tell us where you want to go, and our travel architects will build a custom itinerary just for you.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-cyan-400" />
                                Pay in convenient installments
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-cyan-400" />
                                Exclusive hotel upgrades
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-cyan-400" />
                                Expert visa advisory included
                            </li>
                        </ul>
                    </div>

                    <div className="md:w-1/2 bg-white text-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md">
                        <h3 className="font-bold text-2xl mb-1 text-customBlue">Plan My Trip</h3>
                        <p className="text-sm text-gray-500 mb-6">Fill this form to get a callback within 2 hours.</p>
                        
                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destination of Interest</label>
                                <input type="text" placeholder="e.g. Paris, Bali, or 'Not Sure'" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Travelers</label>
                                    <input type="number" placeholder="2" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget (₦)</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 transition">
                                        <option>500k - 1M</option>
                                        <option>1M - 2M</option>
                                        <option>2M - 5M</option>
                                        <option>5M+</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your WhatsApp Number</label>
                                <input type="tel" placeholder="+234..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 transition" />
                            </div>
                            <button type="submit" className="w-full bg-customBlue text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">
                                Start Planning
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-cyan-50 text-customBlue rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserCheck className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-customBlue">Personal Concierge</h3>
                            <p className="text-gray-600 text-sm">We don&apos;t just book; we manage. From visa assistance to special dinner reservations.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-cyan-50 text-customBlue rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-customBlue">Transparent Pricing</h3>
                            <p className="text-gray-600 text-sm">No hidden fees. Our all-inclusive packages cover flights, hotels, and tours.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-cyan-50 text-customBlue rounded-full flex items-center justify-center mx-auto mb-4">
                                <Headset className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-customBlue">24/7 Support</h3>
                            <p className="text-gray-600 text-sm">Stuck at an airport? Need a change? We are just a WhatsApp message away.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-cover bg-center bg-fixed relative" style={{ backgroundImage: "linear-gradient(rgba(6, 87, 119, 0.85), rgba(6, 87, 119, 0.8)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
                <div className="container mx-auto px-6 text-center text-white">
                    <span className="bg-cyan-500 text-white font-bold py-1 px-4 rounded-full text-sm uppercase tracking-wider mb-6 inline-block">
                        Limited Time Offers
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Stop Dreaming.<br />Start <span className="text-cyan-400">Packing.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                        Exclusive all-inclusive packages for honeymoons, family vacations, and solo adventures.
                    </p>
                    <Link href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-block bg-cyan-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-cyan-600 transition transform hover:scale-105 shadow-xl">
                        View All Deals
                    </Link>
                </div>
            </section>

            <Dialog open={showModal} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="w-[95vw] max-w-md">
                    <DialogHeader className="bg-customBlue text-white p-4 -m-6 mb-4 rounded-t-lg">
                        <DialogTitle className="text-xl font-bold">Confirm Interest</DialogTitle>
                        {selectedPackage && (
                            <p className="text-cyan-300 text-sm mt-1">
                                Package: <span className="font-bold">{selectedPackage.name}</span>
                            </p>
                        )}
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Selected Package</p>
                            <p className="font-bold text-customBlue">{selectedPackage?.name}</p>
                            <p className="text-sm text-gray-600">{selectedPackage?.duration}</p>
                            <p className="text-lg font-bold text-cyan-600 mt-1">{selectedPackage?.price}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input 
                                type="text" 
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                            <input 
                                type="tel" 
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="+234..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travellers *</label>
                            <input 
                                type="number" 
                                required
                                min="1"
                                max="50"
                                value={formData.numberOfTravellers}
                                onChange={(e) => setFormData({ ...formData, numberOfTravellers: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="1"
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-cyan-500 text-white font-bold py-3 rounded-lg hover:bg-cyan-600 transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                        </button>
                        
                        <p className="text-xs text-gray-500 text-center">
                            Our travel architects will reach out within 2 hours to discuss your trip.
                        </p>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
