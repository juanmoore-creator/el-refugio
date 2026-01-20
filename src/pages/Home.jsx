import React from 'react';
import PolaroidGallery from '../components/PolaroidGallery';
import BookingCalendar from '../components/BookingCalendar';

const Home = () => {
    return (
        <div className="font-sans text-refugio-earth bg-refugio-cream min-h-screen flex flex-col">

            {/* Hero Section */}
            <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
                    }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-md">
                        Bienvenido a El Refugio
                    </h1>
                    <p className="text-xl md:text-2xl text-refugio-cream mb-8 font-light drop-shadow-sm">
                        Tu espacio de desconexión en la costa
                    </p>
                    <a href="#reservas" className="bg-refugio-forest hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:-translate-y-1 text-lg inline-block">
                        Reserva tu estadía
                    </a>
                </div>
            </header>

            {/* Polaroid Gallery Section */}
            <PolaroidGallery />

            {/* Booking Section */}
            <section id="reservas" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-refugio-earth mb-4">Reserva tu Estadía</h2>
                        <p className="text-lg text-refugio-slate">Selecciona tus fechas y contáctanos.</p>
                    </div>
                    <BookingCalendar />
                </div>
            </section>

            {/* Location Section */}
            <section className="py-16 bg-refugio-cream">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-refugio-earth mb-4">Nuestra Ubicación</h2>
                        <p className="text-lg text-refugio-slate">Encuéntranos frente al mar, donde la calma te espera.</p>
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-xl max-w-5xl mx-auto h-[400px] border-4 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13136.066850016401!2d-58.433877!3d-34.603684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca3b4ef90cbd%3A0xa0b3d1234567890!2sBuenos+Aires+Playa!5e0!3m2!1ses-419!2sar!4v1532000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación de El Refugio"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-refugio-slate text-refugio-cream py-10 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-2">El Refugio</h3>
                        <p className="text-sm opacity-80">Tu casa lejos de casa.</p>
                    </div>
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="#" className="hover:text-refugio-sage transition-colors">Instagram</a>
                        <a href="#" className="hover:text-refugio-sage transition-colors">Facebook</a>
                        <a href="#" className="hover:text-refugio-sage transition-colors">Contacto</a>
                    </div>
                    <p className="text-xs opacity-60">
                        &copy; {new Date().getFullYear()} El Refugio. Todos los derechos reservados.
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default Home;
