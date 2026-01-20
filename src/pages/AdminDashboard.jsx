import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, timestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminDashboard() {
    const [range, setRange] = useState();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [disabledDays, setDisabledDays] = useState([]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "bookings"), orderBy("startDate", "desc"));
            const querySnapshot = await getDocs(q);
            const bookedList = [];
            const disabledRanges = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const start = data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate);
                const end = data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate);

                bookedList.push({
                    id: doc.id,
                    ...data,
                    start,
                    end
                });
                disabledRanges.push({ from: start, to: end });
            });

            setBookings(bookedList);
            setDisabledDays(disabledRanges);
        } catch (error) {
            console.error("Error fetching bookings: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleBlockDates = async () => {
        if (!range?.from || !range?.to) {
            alert("Por favor selecciona un rango de fechas.");
            return;
        }

        try {
            await addDoc(collection(db, "bookings"), {
                startDate: Timestamp.fromDate(range.from),
                endDate: Timestamp.fromDate(range.to),
                createdAt: Timestamp.now(),
                type: 'admin'
            });
            setRange(undefined);
            fetchBookings();
            alert("Fechas bloqueadas con éxito.");
        } catch (error) {
            console.error("Error blocking dates: ", error);
            alert("Error al bloquear fechas.");
        }
    };

    const handleDeleteBooking = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este bloqueo?")) {
            try {
                await deleteDoc(doc(db, "bookings", id));
                fetchBookings();
            } catch (error) {
                console.error("Error deleting booking: ", error);
                alert("Error al eliminar el bloqueo.");
            }
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-snow min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-hunter-green border-b pb-4">Panel de Administración</h1>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Calendar Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted-olive/20">
                    <h2 className="text-2xl font-semibold mb-6 text-olive-bark">Bloquear Calendario</h2>
                    <div className="flex justify-center">
                        <DayPicker
                            mode="range"
                            selected={range}
                            onSelect={setRange}
                            disabled={disabledDays}
                            locale={es}
                            footer={
                                <div className="mt-4 p-4 bg-muted-olive/10 rounded-lg">
                                    {range?.from && range?.to ? (
                                        <p className="text-sm font-medium text-hunter-green">
                                            Seleccionado: <span className="font-bold">{format(range.from, "d 'de' MMM", { locale: es })}</span> al <span className="font-bold">{format(range.to, "d 'de' MMM", { locale: es })}</span>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-blue-slate">Selecciona un rango para bloquear.</p>
                                    )}
                                </div>
                            }
                        />
                    </div>
                    <button
                        onClick={handleBlockDates}
                        disabled={!range?.from || !range?.to}
                        className={`mt-6 w-full py-3 rounded-xl font-bold transition-all ${!range?.from || !range?.to
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-hunter-green text-white hover:bg-olive-bark shadow-lg shadow-hunter-green/20'
                            }`}
                    >
                        Bloquear Fechas Seleccionadas
                    </button>
                </div>

                {/* List Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-muted-olive/20">
                    <h2 className="text-2xl font-semibold mb-6 text-olive-bark">Bloqueos Actuales</h2>
                    {loading ? (
                        <p className="text-center py-8">Cargando bloqueos...</p>
                    ) : bookings.length === 0 ? (
                        <p className="text-center py-8 text-blue-slate italic">No hay fechas bloqueadas actualmente.</p>
                    ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="flex justify-between items-center p-4 bg-snow rounded-xl border border-muted-olive/10 group hover:border-muted-olive/30 transition-all">
                                    <div>
                                        <p className="font-bold text-hunter-green">
                                            {format(booking.start, "d 'de' MMMM", { locale: es })} - {format(booking.end, "d 'de' MMMM", { locale: es })}
                                        </p>
                                        <p className="text-xs text-blue-slate mt-1 opacity-60">
                                            Creado el {format(booking.createdAt?.toDate ? booking.createdAt.toDate() : new Date(booking.createdAt), "d/M HH:mm")}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBooking(booking.id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Eliminar bloqueo"
                                    >
                                        <span className="material-icons-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center">
                <a href="/" className="text-olive-bark hover:text-hunter-green font-medium underline flex items-center justify-center gap-2">
                    <span className="material-icons-outlined text-sm">west</span>
                    Volver a la Home
                </a>
            </div>
        </div>
    );
}
