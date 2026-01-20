import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { collection, getDocs, timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function BookingCalendar() {
    const [range, setRange] = useState();
    const [disabledDays, setDisabledDays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "bookings"));
                const bookedDates = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.startDate && data.endDate) {
                        // Handle both Firestore Timestamp and string formats
                        const start = data.startDate.toDate ? data.startDate.toDate() : new Date(data.startDate);
                        const end = data.endDate.toDate ? data.endDate.toDate() : new Date(data.endDate);

                        // Disable the range
                        bookedDates.push({ from: start, to: end });
                    }
                });

                setDisabledDays(bookedDates);
            } catch (error) {
                console.error("Error fetching bookings: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleWhatsAppClick = () => {
        if (range?.from && range?.to) {
            const startStr = format(range.from, "d 'de' MMMM", { locale: es });
            const endStr = format(range.to, "d 'de' MMMM", { locale: es });

            const message = `Hola, vi el depto en la web. Me interesa reservar del ${startStr} al ${endStr}. ¿Está disponible?`;
            const encodedMessage = encodeURIComponent(message);
            // Replace with actual phone number if known, otherwise using a placeholder or user prompt implies needing it.
            // Using a placeholder number for now as per prompt "https://wa.me/..."
            window.open(`https://wa.me/5491112345678?text=${encodedMessage}`, '_blank');
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Reservar Fechas</h2>

            {loading ? (
                <p>Cargando disponibilidad...</p>
            ) : (
                <div className="booking-calendar-wrapper">
                    <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        disabled={disabledDays}
                        locale={es}
                        footer={
                            range?.from && range?.to ? (
                                <p className="mt-4 text-center">
                                    Del {format(range.from, "P", { locale: es })} al {format(range.to, "P", { locale: es })}
                                </p>
                            ) : (
                                <p className="mt-4 text-center text-gray-500">Selecciona tu fecha de llegada y salida.</p>
                            )
                        }
                    />
                </div>
            )}

            {range?.from && range?.to && (
                <button
                    onClick={handleWhatsAppClick}
                    className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 flex items-center gap-2"
                >
                    <span>Consultar por WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.6 1.672.56 3.054.965 4.752z" /></svg>
                </button>
            )}
        </div>
    );
}
