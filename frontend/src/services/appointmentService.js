import api from './api';

export async function fetchBarbers() {
    const { data } = await api.get('/barbers');
    return data;
}

export async function fetchBarberServices(barberId) {
    const { data } = await api.get(`/barbers/${barberId}/services`);
    return data;
}

export async function fetchAvailability(barberId, date, serviceIds) {
    const { data } = await api.get(`/barbers/${barberId}/availability`, {
        params: { date, serviceIds: serviceIds.join(',') },
    });
    return data;
}

export async function createAppointment({ barberId, date, startTime, serviceIds }) {
    const { data } = await api.post('/appointments', { barberId, date, startTime, serviceIds });
    return data;
}

export async function fetchMyAppointments() {
    const { data } = await api.get('/appointments/me');
    return data;
}

export async function cancelAppointment(appointmentId) {
    await api.delete(`/appointments/${appointmentId}`);
}
