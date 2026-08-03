import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    fetchBarbers,
    fetchBarberServices,
    fetchAvailability,
    createAppointment,
} from '../services/appointmentService';
import './Booking.css';

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

export const Booking = () => {
    const { isAuthenticated } = useAuth();

    const [barbers, setBarbers] = useState([]);
    const [selectedBarberId, setSelectedBarberId] = useState(null);

    const [services, setServices] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState(null);

    useEffect(() => {
        fetchBarbers().then(setBarbers).catch(() => setError('Não foi possível carregar os barbeiros.'));
    }, []);

    const handleSelectBarber = async (barberId) => {
        setSelectedBarberId(barberId);
        setSelectedServiceIds([]);
        setDate('');
        setSlots([]);
        setSelectedTime(null);
        setError('');
        try {
            const barberServices = await fetchBarberServices(barberId);
            setServices(barberServices);
        } catch {
            setError('Não foi possível carregar os serviços desse barbeiro.');
        }
    };

    const toggleService = (serviceId) => {
        setSelectedTime(null);
        setSelectedServiceIds((prev) =>
            prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
        );
    };

    useEffect(() => {
        if (!selectedBarberId || selectedServiceIds.length === 0 || !date) {
            setSlots([]);
            return;
        }

        setLoadingSlots(true);
        setSelectedTime(null);
        setError('');

        fetchAvailability(selectedBarberId, date, selectedServiceIds)
            .then((data) => setSlots(data.slots))
            .catch(() => setError('Não foi possível carregar os horários disponíveis.'))
            .finally(() => setLoadingSlots(false));
    }, [selectedBarberId, selectedServiceIds, date]);

    const handleConfirm = async () => {
        setSubmitting(true);
        setError('');
        try {
            const appointment = await createAppointment({
                barberId: selectedBarberId,
                date,
                startTime: selectedTime,
                serviceIds: selectedServiceIds,
            });
            setConfirmation(appointment);
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível criar o agendamento. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="booking-page">
                <div className="booking-container">
                    <p className="booking-login-prompt">
                        Você precisa <Link to="/login">entrar na sua conta</Link> para agendar um horário.
                    </p>
                </div>
            </div>
        );
    }

    if (confirmation) {
        const selectedBarber = barbers.find((b) => b.id === selectedBarberId);
        return (
            <div className="booking-page">
                <div className="booking-container">
                    <h2>Agendamento confirmado!</h2>
                    <p className="booking-confirmation">
                        Corte com <strong>{selectedBarber?.name}</strong> no dia{' '}
                        <strong>{new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')}</strong> às{' '}
                        <strong>{confirmation.start_time.slice(0, 5)}</strong>.
                    </p>
                    <ul className="booking-confirmation-services">
                        {confirmation.services.map((s) => (
                            <li key={s.id}>R$ {Number(s.price).toFixed(2)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
    const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);

    return (
        <div className="booking-page">
            <div className="booking-container">
                <h2>Agende seu Horário</h2>

                {error && <p className="form-error">{error}</p>}

                <section className="booking-step">
                    <h3>1. Escolha o barbeiro</h3>
                    <div className="booking-options">
                        {barbers.map((barber) => (
                            <button
                                key={barber.id}
                                type="button"
                                className={`booking-option ${selectedBarberId === barber.id ? 'selected' : ''}`}
                                onClick={() => handleSelectBarber(barber.id)}
                            >
                                <strong>{barber.name}</strong>
                                <span>{barber.specialty}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {selectedBarberId && (
                    <section className="booking-step">
                        <h3>2. Escolha os serviços</h3>
                        <div className="booking-options">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    className={`booking-option ${selectedServiceIds.includes(service.id) ? 'selected' : ''}`}
                                    onClick={() => toggleService(service.id)}
                                >
                                    <strong>{service.name}</strong>
                                    <span>R$ {Number(service.price).toFixed(2)} · {service.duration_minutes}min</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {selectedServiceIds.length > 0 && (
                    <section className="booking-step">
                        <h3>3. Escolha a data</h3>
                        <input
                            type="date"
                            min={todayISO()}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="booking-date-input"
                        />
                    </section>
                )}

                {date && (
                    <section className="booking-step">
                        <h3>4. Escolha o horário</h3>
                        {loadingSlots && <p>Carregando horários...</p>}
                        {!loadingSlots && slots.length === 0 && <p>Nenhum horário disponível nesse dia.</p>}
                        <div className="booking-options booking-slots">
                            {slots.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`booking-option ${selectedTime === slot ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {selectedTime && (
                    <section className="booking-step booking-summary">
                        <h3>Resumo</h3>
                        <p>Total: <strong>R$ {totalPrice.toFixed(2)}</strong></p>
                        <button type="button" className="submit-btn" onClick={handleConfirm} disabled={submitting}>
                            {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
};
