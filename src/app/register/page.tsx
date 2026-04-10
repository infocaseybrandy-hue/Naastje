'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserType, ZORG_CATEGORIES, Gender, AvailabilityTime } from '@/types';

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zorgvank_cookie_consent');
      if (!saved) {
        setAccepted(false);
        setVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zorgvank_cookie_consent', 'accepted');
    }
    setAccepted(true);
    setVisible(false);
  };

  if (!visible || accepted) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
      padding: '20px',
      zIndex: 1000,
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍪</div>
        <h3 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Privacy & Cookies</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
          ZorgVonk gebruikt cookies om de app goed te laten werken. 
          Je persoonsgegevens worden alleen gebruikt voor het matchen van zorgvragers en zorgverleners.
        </p>
        <button 
          onClick={handleAccept}
          className="btn-primary"
          style={{ padding: '12px 32px' }}
        >
          Akkoord
        </button>
      </div>
    </div>
  );
}

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
    gender: '' as Gender | '',
    description: '',
    location: '',
    religion: '',
    interests: '',
    availabilityHours: 8,
    availabilityTimes: [] as AvailabilityTime[],
    education: '',
    diplomas: '',
    categories: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Naam is verplicht';
    if (!formData.gender) newErrors.gender = 'Kies je gender';
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

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.availabilityTimes.length === 0) newErrors.availabilityTimes = 'Kies minimaal 1 tijdblok';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleSubmit = () => {
    const user = register({
      name: formData.name,
      email: formData.email,
      gender: formData.gender as Gender,
      description: formData.description,
      location: formData.location,
      religion: formData.religion || undefined,
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      availabilityHours: formData.availabilityHours,
      availabilityTimes: formData.availabilityTimes,
      education: formData.education.split(',').map(e => e.trim()).filter(Boolean),
      diplomas: formData.diplomas.split(',').map(d => d.trim()).filter(Boolean),
      categories: formData.categories,
    }, userType);

    if (user) {
      router.push('/app');
    }
  };

  const isZorgaanbieder = userType === 'zorgaanbieder';

  const timeLabels: Record<AvailabilityTime, string> = {
    'ochtend': '🌅 Ochtend (6-12)',
    'middag': '☀️ Middag (12-18)',
    'avond': '🌆 Avond (18-22)',
    'nacht': '🌙 Nacht (22-6)',
    '24_uur': '⏰ 24-uurs',
  };

  return (
    <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
      {step === 1 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>👤 Over jezelf</h2>
          
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Geslacht/Gender *</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(['man', 'vrouw', 'anders'] as Gender[]).map(g => (
                <label
                  key={g}
                  style={{
                    flex: 1,
                    padding: '14px',
                    border: formData.gender === g ? '2px solid var(--primary)' : '2px solid #e5e7eb',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: formData.gender === g ? 'var(--surface-soft)' : 'white',
                    fontWeight: formData.gender === g ? 600 : 400,
                  }}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  {g === 'man' && '👨 Man'}
                  {g === 'vrouw' && '👩 Vrouw'}
                  {g === 'anders' && '🌈 Anders'}
                </label>
              ))}
            </div>
            {errors.gender && <p className="error-message">{errors.gender}</p>}
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
            Volgende →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>📝 Profiel</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Korte beschrijving *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea-field"
              placeholder="Vertel iets over jezelf, je ervaring en wat je zoekt of kunt bieden..."
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

          <div style={{ marginBottom: '24px' }}>
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

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>
            Volgende →
          </button>
          
          <button onClick={() => setStep(1)} className="btn-ghost" style={{ width: '100%', marginTop: '12px' }}>
            ← Terug
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>⏰ Beschikbaarheid</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Aantal uren per week</label>
            <select
              name="availabilityHours"
              value={formData.availabilityHours}
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
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>
              Welke momenten ben je beschikbaar? *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {(Object.keys(timeLabels) as AvailabilityTime[]).map(time => (
                <label
                  key={time}
                  style={{
                    padding: '12px 16px',
                    border: formData.availabilityTimes.includes(time) 
                      ? '2px solid var(--primary)' 
                      : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: formData.availabilityTimes.includes(time) 
                      ? 'var(--surface-soft)' 
                      : 'white',
                    fontSize: '14px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.availabilityTimes.includes(time)}
                    onChange={() => handleCheckboxChange('availabilityTimes', time)}
                    style={{ marginRight: '8px' }}
                  />
                  {timeLabels[time]}
                </label>
              ))}
            </div>
            {errors.availabilityTimes && <p className="error-message">{errors.availabilityTimes}</p>}
          </div>

          {isZorgaanbieder && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Opleidingen</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Bijv. Verpleegkunde HBO, MBO Zorg (gescheiden door komma's)"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  🎓 Diploma&apos;s en certificaten
                </label>
                <input
                  type="text"
                  name="diplomas"
                  value={formData.diplomas}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Bijv. Verpleegkunde diploma, EHBO, BHV (gescheiden door komma's)"
                />
              </div>
            </>
          )}

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>
            Volgende →
          </button>
          
          <button onClick={() => setStep(2)} className="btn-ghost" style={{ width: '100%', marginTop: '12px' }}>
            ← Terug
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>🏷️ Zorgcategorieën</h2>
          
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Kies de categorieën die bij je passen (meerdere mogelijk):
          </p>

          <div style={{ marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
            {ZORG_CATEGORIES.map(cat => (
              <label
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.categories.includes(cat.id)}
                  onChange={() => handleCheckboxChange('categories', cat.id)}
                  style={{ marginRight: '12px', width: '20px', height: '20px' }}
                />
                {cat.label}
              </label>
            ))}
          </div>

          <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
            ✅ Profiel aanmaken
          </button>
          
          <button onClick={() => setStep(3)} className="btn-ghost" style={{ width: '100%' }}>
            ← Terug
          </button>
        </>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="page-container" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)' }}>
      <CookieConsent />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', marginTop: '24px' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '8px' }}>ZorgVonk</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Registreren
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              style={{
                width: '50px',
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