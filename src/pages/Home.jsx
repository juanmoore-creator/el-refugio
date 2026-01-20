import React, { useState, useRef } from 'react';
import BookingCalendar from '../components/BookingCalendar';

const Home = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const scrollContainerRef = useRef(null);

    const scroll = (offset) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    const galleryImages = [
        { id: 1, src: "/images/2.jpeg", caption: "Amanecer en la costa", location: "Vista Norte" },
        { id: 2, src: "/images/4.jpeg", caption: "Relax total", location: "Spa & Wellness" },
        { id: 3, src: "/images/5.jpeg", caption: "Interiores elegantes", location: "Suite Principal" },
        { id: 4, src: "/images/3.jpeg", caption: "Vista al mar", location: "Terraza" },
        { id: 5, src: "/images/11.jpeg", caption: "Naturaleza viva", location: "Jardines" },
    ];

    return (
        <div className={`bg-snow dark:bg-hunter-green text-hunter-green dark:text-snow font-sans transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-snow/90 dark:bg-hunter-green/90 backdrop-blur-md border-b border-muted-olive/20 dark:border-snow/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-bold tracking-tight text-hunter-green dark:text-snow font-sans">El Refugio</div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide uppercase text-blue-slate dark:text-snow/90">
                        <a href="#galeria" className="hover:text-olive-bark dark:hover:text-muted-olive transition-colors">Galería</a>
                        <a href="#reservas" className="hover:text-olive-bark dark:hover:text-muted-olive transition-colors">Reserva</a>
                        <a href="#ubicacion" className="hover:text-olive-bark dark:hover:text-muted-olive transition-colors">Ubicación</a>
                        <a href="#reservas" className="px-5 py-2.5 bg-hunter-green text-white rounded-full hover:bg-olive-bark transition-all font-semibold shadow-md hover:shadow-lg">Reservar Ahora</a>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-muted-olive/20 dark:hover:bg-snow/20 text-hunter-green dark:text-snow transition-colors"
                    >
                        <span className="material-icons-outlined">dark_mode</span>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col lg:flex-row pt-20 overflow-hidden">
                <div className="lg:w-7/12 relative h-[50vh] lg:h-auto overflow-hidden group">
                    <img
                        src="/images/11.jpeg"
                        alt="Coastal landscape view"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 hero-gradient"></div>
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <p className="text-xs uppercase tracking-[0.3em] font-medium mb-2 opacity-90">La costa argentina</p>
                        <h2 className="text-4xl md:text-5xl max-w-lg leading-tight font-bold drop-shadow-lg">Donde el cielo abraza el mar en calma.</h2>
                    </div>
                </div>
                <div className="lg:w-5/12 flex items-center justify-center p-8 lg:p-20 bg-snow dark:bg-hunter-green">
                    <div className="max-w-md w-full">
                        <span className="inline-block px-3 py-1 bg-muted-olive/30 text-hunter-green dark:text-snow text-xs font-bold uppercase tracking-widest rounded-full mb-6">Boutique Stay</span>
                        <h1 className="text-5xl lg:text-7xl mb-6 text-hunter-green dark:text-snow leading-none font-bold">
                            Bienvenido a <br /><span className="text-olive-bark dark:text-muted-olive italic font-serif">El Refugio</span>
                        </h1>
                        <p className="text-lg text-blue-slate dark:text-snow/80 mb-10 leading-relaxed font-light">
                            Un santuario diseñado para el descanso. Despierta con el sonido de las olas y disfruta de una estadía única en nuestro espacio de diseño minimalista frente a la costa.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#reservas" className="px-8 py-4 bg-hunter-green text-white text-center rounded-xl font-semibold shadow-lg shadow-hunter-green/30 hover:scale-[1.02] hover:bg-olive-bark transition-all">
                                Ver Disponibilidad
                            </a>
                            <a href="#galeria" className="px-8 py-4 border-2 border-muted-olive/50 dark:border-snow/30 text-center rounded-xl font-semibold text-hunter-green dark:text-snow hover:bg-muted-olive/10 dark:hover:bg-snow/10 transition-colors">
                                Explorar Galería
                            </a>
                        </div>
                        <div className="mt-12 flex items-center gap-4 text-blue-slate dark:text-snow/60 text-sm font-medium">
                            <span>+200 estadías inolvidables</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="galeria" className="py-24 bg-snow dark:bg-olive-bark relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-muted-olive/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end relative z-10">
                    <div>
                        <h2 className="text-4xl mb-4 text-hunter-green dark:text-snow font-bold">Momentos en El Refugio</h2>
                        <p className="text-blue-slate dark:text-snow/70">Desliza para ver cada rincón de nuestra propiedad.</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button onClick={() => scroll(-300)} className="p-3 border border-muted-olive/50 dark:border-snow/20 rounded-full hover:bg-white dark:hover:bg-hunter-green text-hunter-green dark:text-snow transition-all shadow-sm">
                            <span className="material-icons-outlined">west</span>
                        </button>
                        <button onClick={() => scroll(300)} className="p-3 border border-muted-olive/50 dark:border-snow/20 rounded-full hover:bg-white dark:hover:bg-hunter-green text-hunter-green dark:text-snow transition-all shadow-sm">
                            <span className="material-icons-outlined">east</span>
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Gallery */}
                {/* Horizontal Scroll Gallery */}
                <div
                    ref={scrollContainerRef}
                    className="scroll-container hide-scrollbar flex overflow-x-auto gap-6 px-6 pb-12 snap-x snap-mandatory scroll-smooth"
                >
                    {galleryImages.map((img) => (
                        <div key={img.id} className="scroll-item flex-none w-[85vw] sm:w-[350px] group relative cursor-pointer">
                            {/* Premium Card Design */}
                            <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-md transition-all duration-500 group-hover:shadow-2xl">
                                <img
                                    src={img.src}
                                    alt={img.caption}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-white opacity-0 group-hover:opacity-100">
                                    <p className="text-xs font-bold tracking-widest uppercase mb-1">{img.location}</p>
                                    <h3 className="font-serif text-2xl italic">{img.caption}</h3>
                                </div>
                            </div>
                            {/* Mobile caption visible below card for better UX on touch */}
                            <div className="mt-4 md:hidden text-center">
                                <h3 className="font-serif text-xl italic text-hunter-green dark:text-snow">{img.caption}</h3>
                                <p className="text-xs text-olive-bark dark:text-gray-400 uppercase tracking-widest mt-1">{img.location}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scroll Progress Indicator (Optional visual cue) */}
                <div className="flex justify-center mt-4 gap-2">
                    {galleryImages.map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-hunter-green/20 dark:bg-snow/20"></div>
                    ))}
                </div>
            </section>

            {/* Booking Section */}
            <section id="reservas" className="py-24 bg-muted-olive/10 dark:bg-hunter-green border-t border-muted-olive/10 dark:border-snow/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl mb-6 text-hunter-green dark:text-snow leading-tight font-bold">Reserva tu Estadía</h2>
                            <p className="text-blue-slate dark:text-snow/80 mb-8 text-lg">
                                Selecciona las fechas de tu preferencia en el calendario y nuestro equipo se pondrá en contacto contigo para coordinar los detalles de tu llegada.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-hunter-green dark:text-snow/90 font-medium">
                                    <span className="material-icons-outlined text-olive-bark dark:text-muted-olive">check_circle</span>
                                    Confirmación inmediata
                                </li>
                                <li className="flex items-center gap-3 text-hunter-green dark:text-snow/90 font-medium">
                                    <span className="material-icons-outlined text-olive-bark dark:text-muted-olive">check_circle</span>
                                    Cancelación flexible
                                </li>
                                <li className="flex items-center gap-3 text-hunter-green dark:text-snow/90 font-medium">
                                    <span className="material-icons-outlined text-olive-bark dark:text-muted-olive">check_circle</span>
                                    Atención personalizada 24/7
                                </li>
                            </ul>
                        </div>

                        {/* Booking Component Replacement */}
                        <div className="relative z-10 transform hover:translate-y-[-5px] transition-transform duration-500">
                            <BookingCalendar />
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section id="ubicacion" className="py-24 bg-snow dark:bg-olive-bark">
                <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                    <h2 className="text-4xl mb-4 text-hunter-green dark:text-snow font-bold">Nuestra Ubicación</h2>
                    <p className="text-blue-slate dark:text-snow/70 max-w-2xl mx-auto">
                        Encuéntranos frente al mar, en el corazón de la calma. Un entorno natural privilegiado diseñado para desconectar.
                    </p>
                </div>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-hunter-green aspect-video lg:aspect-[21/9]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2692.061204101118!2d-56.68607952103947!3d-36.64038539620979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1768878001299!5m2!1ses!2sar"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación de El Refugio"
                            className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                        ></iframe>

                        {/* Overlay Badge */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="relative">
                                <div className="w-12 h-12 bg-hunter-green rounded-full animate-ping absolute -inset-0 opacity-20"></div>
                                <div className="relative z-10 bg-hunter-green text-white p-3 rounded-full shadow-xl">
                                    <span className="material-icons-outlined">home</span>
                                </div>
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white dark:bg-hunter-green px-4 py-2 rounded-lg shadow-lg border border-snow/50 dark:border-snow/10 text-sm font-bold text-hunter-green dark:text-snow">
                                    El Refugio Boutique
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                            <div className="bg-white dark:bg-hunter-green p-2 rounded-lg shadow-md flex items-center gap-3">
                                <span className="material-icons-outlined text-hunter-green dark:text-snow">directions</span>
                                <span className="text-sm font-medium text-hunter-green dark:text-snow">¿Cómo llegar?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contacto" className="bg-olive-bark text-snow py-20 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-hunter-green/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2">
                            <h2 className="text-3xl mb-6 font-bold text-snow">El Refugio</h2>
                            <p className="text-snow/70 max-w-sm mb-8">Tu casa lejos de casa. Un refugio de paz y diseño frente al mar pensado para crear recuerdos inolvidables.</p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-hunter-green/30 flex items-center justify-center hover:bg-hunter-green transition-colors">
                                    {/* Icon placeholder or img */}
                                    <span className="text-xs">IG</span>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-hunter-green/30 flex items-center justify-center hover:bg-hunter-green transition-colors">
                                    <span className="text-xs">FB</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-muted-olive">Enlaces</h4>
                            <ul className="space-y-4 text-snow/70">
                                <li><a href="#" className="hover:text-snow transition-colors">Sobre nosotros</a></li>
                                <li><a href="#galeria" className="hover:text-snow transition-colors">Galería</a></li>
                                <li><a href="#reservas" className="hover:text-snow transition-colors">Reservas</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-muted-olive">Contacto</h4>
                            <ul className="space-y-4 text-snow/70">
                                <li className="flex items-start gap-3">
                                    <span className="material-icons-outlined text-sm">location_on</span>
                                    Av. del Mar 1230, <br />Pinamar, Argentina
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-icons-outlined text-sm">phone</span>
                                    +54 9 11 1234 5678
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-icons-outlined text-sm">email</span>
                                    hola@elrefugio.com
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-snow/10 text-center text-snow/50 text-sm">
                        <p>&copy; {new Date().getFullYear()} El Refugio Boutique. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
