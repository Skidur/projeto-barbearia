import api from './api';

export async function registerUser({ name, email, password, phone, birthDate, reminderEmail, reminderWhatsapp }) {
    const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        birth_date: birthDate,
        reminder_email: reminderEmail,
        reminder_whatsapp: reminderWhatsapp,
    });
    return data;
}

export async function loginUser({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
}
