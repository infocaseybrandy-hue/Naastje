'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserType, ZORG_CATEGORIES, ZORGZOEKER_TASKS, AvailabilityTime, ZorgzoekerType, ZorgaanbiederType } from '@/types';

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

const DAYS = [
  { key: 'maandag', label: 'Ma' },
  { key: 'dinsdag', label: 'Di' },
  { key: 'woensdag', label: 'Wo' },
  { key: 'donderdag', label: 'Do' },
  { key: 'vrijdag', label: 'Vr' },
  { key: 'zaterdag', label: 'Za' },
  { key: 'zondag', label: 'Zo' },
];

const TIME_SLOTS = ['ochtend', 'middag', 'avond'];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useApp();
  const userType = searchParams.get('type') as UserType;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Stap 1: Account
    name: '',
    email: '',
    password: '',
    gender: '' as string,
    subtype: '' as string,
    
    // Stap 2: Profiel
    description: '',
    location: '',
    religion: '',
    interests: '',
    
    // Stap 3: Beschikbaarheid
    availabilityHours: 8,
    availabilityTimes: [] as string[],
    
    // Extra velden zorgzoeker
    hasPets: false,
    petType: '',
    cleaningProducts: '' as string,
    needCleaningSupplies: false,
    searchTasks: [] as string[],
    otherNotes: '',
    
    // Zorgaanbieder
    education: '',
    diplomas: '',
    
    // Stap 4: Categorieën
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

  const handleTimeSlotToggle = (day: string, time: string) => {
    const key = `${day}${time}` as AvailabilityTime;
    handleCheckboxChange('availabilityTimes', key);
  };

  const isTimeSlotSelected = (day: string, time: string) => {
    const key = `${day}${time}`;
    return formData.availabilityTimes.includes(key);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Naam is verplicht';
    if (!formData.gender) newErrors.gender = 'Kies je gender';
    if (!formData.subtype) newErrors.subtype = 'Kies wie je bent';
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
    if (formData.availabilityTimes.length === 0) newErrors.availabilityTimes = 'Kies minimaal 1 moment';
    if (userType === 'zorgzoeker' && formData.searchTasks.length === 0) newErrors.searchTasks = 'Kies minimaal 1 taak';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleSubmit = () => {
    const user = register({
      name: formData.name,
      email: formData.email,
      gender: formData.gender as any,
      subtype: formData.subtype as any,
      description: formData.description,
      location: formData.location,
      religion: formData.religion || undefined,
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      availabilityHours: formData.availabilityHours,
      availabilityTimes: formData.availabilityTimes as any,
      education: formData.education.split(',').map(e => e.trim()).filter(Boolean),
      diplomas: formData.diplomas.split(',').map(d => d.trim()).filter(Boolean),
      categories: formData.categories,
      hasPets: formData.hasPets,
      petType: formData.petType || undefined,
      cleaningProducts: formData.cleaningProducts as any,
      needCleaningSupplies: formData.needCleaningSupplies,
      searchTasks: formData.searchTasks,
      otherNotes: formData.otherNotes || undefined,
    }, userType);

    if (user) router.push('/app');
  };

  const isZorgaanbieder = userType === 'zorgaanbieder';
  const isZorgzoeker = userType === 'zorgzoeker';

  return (
    <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
      {step === 1 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>👤 Over jezelf</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Naam *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Je volledige naam" />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Geslacht/Gender *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['man', 'vrouw', 'anders'] as const).map(g => (
                <label key={g} style={{ flex: 1, padding: '12px', border: formData.gender === g ? '2px solid var(--primary)' : '2px solid #e5e7eb', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: formData.gender === g ? '#FFF7ED' : 'white' }}>
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} style={{ display: 'none' }} />
                  {g === 'man' ? '👨 Man' : g === 'vrouw' ? '👩 Vrouw' : '🌈 Anders'}
                </label>
              ))}
            </div>
            {errors.gender && <p className="error-message">{errors.gender}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Wie ben je? *</label>
            {isZorgzoeker ? (
              <select name="subtype" value={formData.subtype} onChange={handleChange} className="input-field">
                <option value="">Kies...</option>
                <option value="pgb_houder">🧾 PGB-houder</option>
                <option value="zorgvrager">🏠 Zorgvrager (zonder PGB)</option>
                <option value="ouder">👨‍👩‍👧 Ouder met kind</option>
                <option value="mantelzorger">💝 Mantelzorger</option>
              </select>
            ) : (
              <select name="subtype" value={formData.subtype} onChange={handleChange} className="input-field">
                <option value="">Kies...</option>
                <option value="zzp_zorgverlener">💼 ZZP'er in de zorg</option>
                <option value="student">🎓 Student zorg/medicijnen</option>
                <option value="huishoudelijke_hulp">🧹 Huishoudelijke hulp</option>
                <option value="vrijwilliger">❤️ Vrijwilliger/maatje</option>
              </select>
            )}
            {errors.subtype && <p className="error-message">{errors.subtype}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>E-mailadres *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="jouw@email.nl" />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Wachtwoord *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="Minimaal 6 tekens" />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>Volgende →</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>📝 Profiel</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Korte beschrijving *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="textarea-field" placeholder="Vertel iets over jezelf, je ervaring en wat je zoekt of kunt bieden..." />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Locatie *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" placeholder="Stad of regio in Nederland" />
            {errors.location && <p className="error-message">{errors.location}</p>}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Geloofsovertuiging</label>
            <select name="religion" value={formData.religion} onChange={handleChange} className="input-field">
              <option value="">Kies (optioneel)</option>
              <option value="Geen">Geen</option>
              <option value="Christelijk">Christelijk</option>
              <option value="Katholiek">Katholiek</option>
              <option value="Protestants">Protestants</option>
              <option value="Islam">Islam</option>
              <option value="anders">Anders</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Interesses en hobby&apos;s</label>
            <input type="text" name="interests" value={formData.interests} onChange={handleChange} className="input-field" placeholder="Bijv. wandelen, koken, lezen (gescheiden door komma's)" />
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>Volgende →</button>
          <button onClick={() => setStep(1)} className="btn-ghost" style={{ width: '100%', marginTop: '12px' }}>← Terug</button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>⏰ Beschikbaarheid</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Aantal uren per week</label>
            <select name="availabilityHours" value={formData.availabilityHours} onChange={handleChange} className="input-field">
              {[4, 8, 12, 16, 20, 24, 32, 40].map(h => <option key={h} value={h}>{h} uur</option>)}
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>Wanneer ben je beschikbaar? *</label>
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', fontSize: '14px' }}></th>
                    {TIME_SLOTS.map(t => <th key={t} style={{ textAlign: 'center', padding: '8px', fontSize: '14px' }}>{t === 'ochtend' ? '🌅' : t === 'middag' ? '☀️' : '🌆'}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day.key}>
                      <td style={{ padding: '8px', fontSize: '14px', fontWeight: 500 }}>{day.label}</td>
                      {TIME_SLOTS.map(time => (
                        <td key={time} style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isTimeSlotSelected(day.key, time)}
                            onChange={() => handleTimeSlotToggle(day.key, time)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '8px', fontSize: '14px', fontWeight: 500 }}>⏰</td>
                    <td colSpan={3} style={{ textAlign: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={formData.availabilityTimes.includes('24_uur')} onChange={() => handleCheckboxChange('availabilityTimes', '24_uur')} style={{ width: '20px', height: '20px' }} />
                        24-uurs beschikbaar
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {errors.availabilityTimes && <p className="error-message">{errors.availabilityTimes}</p>}
          </div>

          {isZorgaanbieder && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Opleidingen</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} className="input-field" placeholder="Bijv. Verpleegkunde HBO, MBO Zorg" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>🎓 Diploma&apos;s en certificaten</label>
                <input type="text" name="diplomas" value={formData.diplomas} onChange={handleChange} className="input-field" placeholder="Bijv. Verpleegkunde diploma, EHBO, BHV" />
              </div>
            </>
          )}

          {isZorgzoeker && (
            <>
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '12px', border: '2px solid #10b981' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
                  <input type="checkbox" checked={formData.hasPets} onChange={(e) => setFormData(prev => ({ ...prev, hasPets: e.target.checked }))} style={{ width: '20px', height: '20px' }} />
                  🐾 Er zijn huisdieren aanwezig
                </label>
                {formData.hasPets && (
                  <input type="text" name="petType" value={formData.petType} onChange={handleChange} className="input-field" placeholder="Welke huisdieren? (bijv. hond, kat)" style={{ marginTop: '8px' }} />
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>Welke taken zoek je hulp bij? *</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px' }}>
                  {ZORGZOEKER_TASKS.map(task => (
                    <label key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}>
                      <input type="checkbox" checked={formData.searchTasks.includes(task.id)} onChange={() => handleCheckboxChange('searchTasks', task.id)} style={{ marginRight: '10px', width: '18px', height: '18px' }} />
                      {task.label}
                    </label>
                  ))}
                </div>
                {errors.searchTasks && <p className="error-message">{errors.searchTasks}</p>}
              </div>

              {formData.searchTasks.includes('schoonmaken') && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>🧹 Schoonmaakspullen</label>
                  <select name="cleaningProducts" value={formData.cleaningProducts} onChange={handleChange} className="input-field">
                    <option value="">Kies...</option>
                    <option value="mee">Zorgverlener neemt eigen spullen mee</option>
                    <option value="zelf">Ik heb zelf schoonmaakmiddelen</option>
                    <option value="geen_voorkeur">Geen voorkeur</option>
                  </select>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Overige opmerkingen</label>
                <textarea name="otherNotes" value={formData.otherNotes} onChange={handleChange} className="textarea-field" placeholder="Bijzonderheden die de zorgverlener moet weten..." style={{ minHeight: '80px' }} />
              </div>
            </>
          )}

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%' }}>Volgende →</button>
          <button onClick={() => setStep(2)} className="btn-ghost" style={{ width: '100%', marginTop: '12px' }}>← Terug</button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>🏷️ Zorgcategorieën</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>Kies de categorieën die bij je passen:</p>

          <div style={{ marginBottom: '24px', maxHeight: '350px', overflowY: 'auto' }}>
            {ZORG_CATEGORIES.map(cat => (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.categories.includes(cat.id)} onChange={() => handleCheckboxChange('categories', cat.id)} style={{ marginRight: '12px', width: '20px', height: '20px' }} />
                <span style={{ marginRight: '10px', fontSize: '20px' }}>{cat.icon}</span>
                {cat.label}
              </label>
            ))}
          </div>

          <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>✅ Profiel aanmaken</button>
          <button onClick={() => setStep(3)} className="btn-ghost" style={{ width: '100%' }}>← Terug</button>
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
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Profiel aanmaken</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ width: '50px', height: '4px', borderRadius: '2px', backgroundColor: '#e5e7eb' }} />
          ))}
        </div>

        <Suspense fallback={<div>Laden...</div>}>
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}