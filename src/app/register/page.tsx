'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserType } from '@/types';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useApp();
  const userType = searchParams.get('type') as UserType;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    description: '',
    location: '',
    religion: '',
    interests: '',
    availability: 8,
    education: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Naam is verplicht';
    if (!formData.email.trim()) newErrors.email = 'E-mailadres is verplicht';
    if (!formData.email.includes('@')) newErrors.email = 'Ongeldig e-mailadres';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Wachtwoord moet minstens 6 tekens zijn';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) newErrors.description = 'Beschrijving is verplicht';
    if (!formData.location.trim()) newErrors.location = 'Locatie is verplicht';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = () => {
    const user = register({
      name: formData.name,
      email: formData.email,
      description: formData.description,
      location: formData.location,
      religion: formData.religion || undefined,
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      availability: formData.availability,
      education: formData.education.split(',').map(e => e.trim()).filter(Boolean),
    }, userType);

    if (user) {
      router.push('/app');
    }
  };

  const isZorgverlener = userType === 'zorgverlener';

  return (
    <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '32px' }}>
      {step === 1 && (
        <>
          <h2 style={{ marginBottom: '24px' }}>Account aanmaken</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Naam *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Je volledige naam"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>E-mailadres *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="jouw@email.nl"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Wachtwoord *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Minimaal 6 tekens"
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>
            Volgende
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ marginBottom: '24px' }}>Over jezelf</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Korte beschrijving *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea-field"
              placeholder="Vertel iets over jezelf..."
            />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Locatie *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Stad of regio in Nederland"
            />
            {errors.location && <p className="error-message">{errors.location}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Beschikbaarheid (uren per week)</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="input-field"
            >
              <option value={4}>4 uur</option>
              <option value={8}>8 uur</option>
              <option value={12}>12 uur</option>
              <option value={16}>16 uur</option>
              <option value={20}>20 uur</option>
              <option value={24}>24 uur</option>
              <option value={32}>32 uur</option>
              <option value={40}>40 uur</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Geloofsovertuiging</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Kies (optioneel)</option>
              <option value="Geen">Geen</option>
              <option value="Christelijk">Christelijk</option>
              <option value="Katholiek">Katholiek</option>
              <option value="Protestants">Protestants</option>
              <option value="Islam">Islam</option>
              <option value="Joods">Joods</option>
              <option value="Hindu">Hindu</option>
              <option value="anders">Anders</option>
            </select>
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>
            Volgende
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ marginBottom: '24px' }}>Interesses</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Interesses en hobby&apos;s</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="input-field"
              placeholder="Bijv. wandelen, koken, lezen (gescheiden door komma's)"
            />
          </div>
          
          {isZorgverlener && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Opleidingen en cursussen</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="input-field"
                placeholder="Bijv. Verpleegkunde, EHBO (gescheiden door komma's)"
              />
            </div>
          )}

          <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
            Profiel aanmaken
          </button>
          
          <button onClick={() => setStep(2)} className="btn-ghost" style={{ width: '100%' }}>
            Terug
          </button>
        </>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="page-container" style={{ background: 'linear-gradient(135deg, #FEFCFF 0%, #f3e8ff 100%)' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', marginTop: '24px' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '8px' }}>ZorgMatch</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Registreren
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: '#e5e7eb',
              }}
            />
          ))}
        </div>

        <Suspense fallback={<div>Laden...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}
