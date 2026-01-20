import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { collection, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function BookingCalendar() {
    const [range, setRange] = useState();
    const [disabledDays, setDisabledDays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "bookings"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const bookedDates = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.startDate && data.endDate) {
                    const start = data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate);
                    const end = data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate);
                    bookedDates.push({ from: start, to: end });
                }
            });
            setDisabledDays(bookedDates);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching bookings: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleWhatsAppClick = () => {
        if (range?.from && range?.to) {
            const startStr = format(range.from, "d 'de' MMMM", { locale: es });
            const endStr = format(range.to, "d 'de' MMMM", { locale: es });

            const message = `Hola, vi el depto en la web. Me interesa reservar del ${startStr} al ${endStr}. ¿Está disponible?`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/5491112345678?text=${encodedMessage}`, '_blank');
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto my-8 border border-muted-olive/10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 font-sans">Reservar Fechas</h2>

            {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-hunter-green/20 border-t-hunter-green rounded-full animate-spin"></div>
                    <p className="text-blue-slate font-medium">Cargando disponibilidad...</p>
                </div>
            ) : (
                <div className="booking-calendar-wrapper" style={{
                    "--rdp-cell-size": "45px",
                    "--rdp-caption-font-size": "1.1rem",
                    "--rdp-accent-color": "#4a6c45",
                    "--rdp-background-color": "#f8f9fa",
                    color: "#1f2937"
                }}>
                    <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        disabled={[{ before: new Date() }, ...disabledDays]}
                        modifiers={{
                            booked: disabledDays,
                        }}
                        locale={es}
                        footer={
                            <div className="mt-6 pt-4 border-t border-gray-100 italic">
                                {range?.from && range?.to ? (
                                    <p className="text-center text-hunter-green font-semibold">
                                        Del {format(range.from, "d 'de' MMM", { locale: es })} al {format(range.to, "d 'de' MMM", { locale: es })}
                                    </p>
                                ) : (
                                    <p className="text-center text-blue-slate text-sm">Selecciona tu llegada y salida.</p>
                                )}
                            </div>
                        }
                    />
                </div>
            )}

            {range?.from && range?.to && (
                <button
                    onClick={handleWhatsAppClick}
                    className="mt-8 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 active:scale-95"
                >
                    <span>Consultar por WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.6 1.672.56 3.054.965 4.752z" /></svg>
                </button>
            )}
        </div>
    );
}
