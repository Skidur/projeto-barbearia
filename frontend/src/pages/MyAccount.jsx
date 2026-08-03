import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchMyAppointments, cancelAppointment } from '../services/appointmentService';
import './MyAccount.css';

const MIN_CANCELLATION_NOTICE_MINUTES = 120;

const STATUS_LABELS = {
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    completed: 'Concluído',
};

function canCancel(appointment) {
    if (appointment.status !== 'confirmed') return false;
    const start = new Date(`${appointment.date.slice(0, 10)}T${appointment.start_time}`);
    const minutesUntil = (start.getTime() - Date.now()) / 60000;
    return minutesUntil >= MIN_CANCELLATION_NOTICE_MINUTES;
}

export const MyAccount = () => {
    const { isAuthenticated } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    const loadAppointments = () => {
        setLoading(true);
        fetchMyAppointments()
            .then(setAppointments)
            .catch(() => setError('Não foi possível carregar seus agendamentos.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isAuthenticated) loadAppointments();
    }, [isAuthenticated]);

    const handleCancel = async (appointmentId) => {
        setError('');
        setCancellingId(appointmentId);
        try {
            await cancelAppointment(appointmentId);
            loadAppointments();
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível cancelar esse agendamento.');
        } finally {
            setCancellingId(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="account-page">
                <div className="account-container">
                    <p className="account-login-prompt">
                        Você precisa <Link to="/login">entrar na sua conta</Link> para ver seus agendamentos.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="account-page">
            <div className="account-container">
                <h2>Meus Agendamentos</h2>

                {error && <p className="form-error">{error}</p>}
                {loading && <p>Carregando...</p>}
                {!loading && appointments.length === 0 && <p>Você ainda não tem nenhum agendamento.</p>}

                <ul className="appointment-list">
                    {appointments.map((appointment) => (
                        <li key={appointment.id} className={`appointment-card status-${appointment.status}`}>
                            <div className="appointment-info">
                                <strong>
                                    {new Date(`${appointment.date.slice(0, 10)}T00:00:00`).toLocaleDateString('pt-BR')}
                                    {' às '}
                                    {appointment.start_time.slice(0, 5)}
                                </strong>
                                <span>com {appointment.barber_name}</span>
                                <span className="appointment-services">
                                    {appointment.services.map((s) => s.name).join(', ')}
                                </span>
                            </div>
                            <div className="appointment-status">
                                <span className={`status-badge status-badge-${appointment.status}`}>
                                    {STATUS_LABELS[appointment.status]}
                                </span>
                                {canCancel(appointment) && (
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => handleCancel(appointment.id)}
                                        disabled={cancellingId === appointment.id}
                                    >
                                        {cancellingId === appointment.id ? 'Cancelando...' : 'Cancelar'}
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
