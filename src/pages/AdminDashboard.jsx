import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminDashboard() {
    const [range, setRange] = useState();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [disabledDays, setDisabledDays] = useState([]);
    const [dailyPrice, setDailyPrice] = useState('');
    const [priceLoading, setPriceLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    // New Booking States
    const [clientName, setClientName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [note, setNote] = useState('');
    const [isPaid, setIsPaid] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

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

    const fetchPrice = async () => {
        setPriceLoading(true);
        try {
            const docRef = doc(db, "settings", "pricing");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDailyPrice(docSnap.data().dailyPrice);
            }
        } catch (error) {
            console.error("Error fetching price: ", error);
        } finally {
            setPriceLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchPrice();
    }, []);

    const handleUpdatePrice = async () => {
        if (!dailyPrice) {
            alert("El precio no puede estar vacío.");
            return;
        }

        setSaveLoading(true);
        try {
            await setDoc(doc(db, "settings", "pricing"), {
                dailyPrice: dailyPrice,
                lastUpdated: Timestamp.now()
            });
            alert("Precio actualizado correctamente.");
        } catch (error) {
            console.error("Error updating price: ", error);
            alert("Error al actualizar el precio.");
        } finally {
            setSaveLoading(false);
        }
    };

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
                type: 'admin',
                clientName: clientName || 'Sin nombre',
                totalAmount: totalAmount || 0,
                paidAmount: paidAmount || 0,
                note: note || '',
                isPaid: isPaid || false
            });

            // Reset form
            setRange(undefined);
            setClientName('');
            setTotalAmount('');
            setPaidAmount('');
            setNote('');
            setIsPaid(false);

            fetchBookings();
            alert("Fechas bloqueadas con éxito.");
        } catch (error) {
            console.error("Error blocking dates: ", error);
            alert("Error al bloquear fechas.");
        }
    };

    const startEditing = (booking) => {
        setEditingId(booking.id);
        setEditForm({
            clientName: booking.clientName || '',
            totalAmount: booking.totalAmount || '',
            paidAmount: booking.paidAmount || '',
            note: booking.note || '',
            isPaid: booking.isPaid || false
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleUpdateBooking = async (id) => {
        try {
            const bookingRef = doc(db, "bookings", id);
            await updateDoc(bookingRef, {
                clientName: editForm.clientName,
                totalAmount: editForm.totalAmount,
                paidAmount: editForm.paidAmount,
                note: editForm.note,
                isPaid: editForm.isPaid
            });
            setEditingId(null);
            fetchBookings();
            alert("Reserva actualizada correctamente");
        } catch (error) {
            console.error("Error updating booking:", error);
            alert("Error al actualizar la reserva");
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
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-4xl font-bold text-hunter-green">Panel de Administración</h1>
                <a href="/" className="px-5 py-2.5 bg-hunter-green text-white rounded-xl font-bold hover:bg-olive-bark shadow-lg shadow-hunter-green/20 transition-all flex items-center gap-2">
                    <span className="material-icons-outlined">home</span>
                    Ir a la Home
                </a>
            </div>

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

                    {/* Booking Form Inputs */}
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-olive-bark mb-1">Nombre del Cliente</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full p-2 border border-muted-olive/30 rounded-lg focus:outline-none focus:border-hunter-green"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-olive-bark mb-1">Monto Total</label>
                                <input
                                    type="number"
                                    value={totalAmount}
                                    onChange={(e) => setTotalAmount(e.target.value)}
                                    className="w-full p-2 border border-muted-olive/30 rounded-lg focus:outline-none focus:border-hunter-green"
                                    placeholder="$"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-olive-bark mb-1">Seña / Pago</label>
                                <input
                                    type="number"
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(e.target.value)}
                                    className="w-full p-2 border border-muted-olive/30 rounded-lg focus:outline-none focus:border-hunter-green"
                                    placeholder="$"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-olive-bark mb-1">Nota</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full p-2 border border-muted-olive/30 rounded-lg focus:outline-none focus:border-hunter-green h-20 resize-none"
                                placeholder="Notas adicionales..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPaid"
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                                className="w-4 h-4 text-hunter-green rounded focus:ring-hunter-green"
                            />
                            <label htmlFor="isPaid" className="text-sm font-medium text-olive-bark">Pago Completo</label>
                        </div>
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
                                <div key={booking.id} className="p-4 bg-snow rounded-xl border border-muted-olive/10 group hover:border-muted-olive/30 transition-all">
                                    {editingId === booking.id ? (
                                        // Edit Mode
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                                <span className="font-bold text-hunter-green text-sm">
                                                    {format(booking.start, "d MMM", { locale: es })} - {format(booking.end, "d MMM", { locale: es })}
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={editForm.clientName}
                                                onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                                                className="w-full p-2 text-sm border rounded"
                                                placeholder="Nombre Cliente"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="number"
                                                    value={editForm.totalAmount}
                                                    onChange={(e) => setEditForm({ ...editForm, totalAmount: e.target.value })}
                                                    className="w-full p-2 text-sm border rounded"
                                                    placeholder="Total"
                                                />
                                                <input
                                                    type="number"
                                                    value={editForm.paidAmount}
                                                    onChange={(e) => setEditForm({ ...editForm, paidAmount: e.target.value })}
                                                    className="w-full p-2 text-sm border rounded"
                                                    placeholder="Pagado"
                                                />
                                            </div>
                                            <textarea
                                                value={editForm.note}
                                                onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                                                className="w-full p-2 text-sm border rounded h-16"
                                                placeholder="Nota"
                                            />
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.isPaid}
                                                    onChange={(e) => setEditForm({ ...editForm, isPaid: e.target.checked })}
                                                />
                                                <span className="text-sm">Pago Completo</span>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={cancelEditing} className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                                                <button onClick={() => handleUpdateBooking(booking.id)} className="px-3 py-1 text-xs bg-hunter-green text-white rounded hover:bg-opacity-90">Guardar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-hunter-green">
                                                        {format(booking.start, "d 'de' MMMM", { locale: es })} - {format(booking.end, "d 'de' MMMM", { locale: es })}
                                                    </p>
                                                    <p className="font-semibold text-lg text-olive-bark mt-1">
                                                        {booking.clientName || 'Cliente sin nombre'}
                                                    </p>
                                                    <div className="text-sm text-blue-slate mt-1 space-y-0.5">
                                                        <p>Total: ${booking.totalAmount || 0} | Pagado: ${booking.paidAmount || 0}</p>
                                                        <p className={`${(booking.totalAmount - booking.paidAmount) > 0 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}`}>
                                                            Resta: ${booking.totalAmount - booking.paidAmount}
                                                        </p>
                                                        {booking.note && (
                                                            <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 rounded text-xs italic border border-yellow-100">
                                                                "{booking.note}"
                                                            </div>
                                                        )}
                                                        {booking.isPaid && (
                                                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                                                                PAGADO TOTAL
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => startEditing(booking)}
                                                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                        title="Editar"
                                                    >
                                                        <span className="material-icons-outlined">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBooking(booking.id)}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <span className="material-icons-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Management Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-muted-olive/20 mt-8">
                    <h2 className="text-2xl font-semibold mb-6 text-olive-bark flex items-center gap-2">
                        <span className="material-icons-outlined">payments</span>
                        Precio de la Estadía
                    </h2>
                    <div className="max-w-md mx-auto">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-slate mb-2">Precio por día (ej: 75.000)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-hunter-green font-bold">$</span>
                                    <input
                                        type="text"
                                        value={dailyPrice}
                                        onChange={(e) => setDailyPrice(e.target.value)}
                                        placeholder="75.000"
                                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-muted-olive/30 focus:outline-none focus:ring-2 focus:ring-hunter-green/20 font-bold text-hunter-green"
                                        disabled={priceLoading}
                                    />
                                </div>
                                {priceLoading && <p className="text-xs text-blue-slate mt-2 italic">Cargando precio actual...</p>}
                            </div>
                            <button
                                onClick={handleUpdatePrice}
                                disabled={saveLoading || !dailyPrice}
                                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${saveLoading || !dailyPrice
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-hunter-green text-white hover:bg-olive-bark shadow-lg shadow-hunter-green/20'
                                    }`}
                            >
                                {saveLoading ? (
                                    <>
                                        <span className="animate-spin material-icons-outlined text-sm">sync</span>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-outlined">save</span>
                                        Actualizar Precio
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
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
