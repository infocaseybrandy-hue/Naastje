'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserType, ZORG_CATEGORIES, ZORGZOEKER_TASKS, AvailabilityTime } from '@/types';

function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('naastje_cookie_consent') === null;
    }
    return false;
  });
  const [accepted, setAccepted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('naastje_cookie_consent') !== null;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.getItem('naastje_cookie_consent');
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('naastje_cookie_consent', 'accepted');
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
          Naastje gebruikt cookies om de app goed te laten werken. 
          Je persoonsgegevens worden alleen gebruikt voor het matchen van zorgvragers en zorgverleners.
        </p>
        <button 
          onClick={handleAccept}
          className="btn-primary"
          style={{ padding: '12px 32px', background: '#f97316', border: 'none' }}
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

const TIME_SLOTS = [
  { key: 'ochtend', icon: '🌅', label: 'Ochtend' },
  { key: 'middag', icon: '☀️', label: 'Middag' },
  { key: 'avond', icon: '🌆', label: 'Avond' },
];

const INTERESTS = [
  'Wandelen', 'Koken', 'Lezen', 'Muziek', 'Tuiniere', 'Sport', 'Knutselen', 'Creatief', 'Film', 'Gezelligheid', 'Fietsen', 'Volleyballen'
];

const GENDER_OPTIONS = [
  { value: 'man', label: 'Man', icon: '👤' },
  { value: 'vrouw', label: 'Vrouw', icon: '👥' },
  { value: 'anders', label: 'Anders', icon: '✋' },
];

const ZORGZOEKER_SUBTYPES = [
  { value: 'pgb_houder', label: 'PGB-houder', icon: '🧾', desc: 'Ik heb een persoonsgebonden budget' },
  { value: 'zorgvrager', label: 'Zorgvrager', icon: '🏠', desc: 'Ik zoek zorg zonder PGB' },
  { value: 'ouder', label: 'Ouder', icon: '👨‍👩‍👧', desc: 'Ik heb zorg voor mijn kind(eren)' },
  { value: 'mantelzorger', label: 'Mantelzorger', icon: '💝', desc: 'Ik zorg voor een naaste' },
];

const ZORGAANBIEDER_SUBTYPES = [
  { value: 'zzp_zorgverlener', label: 'ZZP\'er', icon: '💼', desc: 'Ik werk zelfstandig in de zorg' },
  { value: 'student', label: 'Student', icon: '🎓', desc: 'Ik studeer zorg of medicijnen' },
  { value: 'huishoudelijke_hulp', label: 'Huishoudelijke hulp', icon: '🧹', desc: 'Ik help met het huishouden' },
  { value: 'vrijwilliger', label: 'Vrijwilliger', icon: '❤️', desc: 'Ik help als maatje/vrijwilliger' },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useApp();
  const userType = searchParams.get('type') as UserType;
  const taskListRef = useRef<HTMLDivElement>(null);
  const [taskScrollProgress, setTaskScrollProgress] = useState(0);

  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '' as string,
    subtype: '' as string,
    photo: '',
    description: '',
    location: '',
    religion: '',
    interests: [] as string[],
    availabilityHours: 8,
    availabilityTimes: [] as string[],
    hasPets: false,
    petType: '',
    cleaningProducts: '' as string,
    needCleaningSupplies: false,
    searchTasks: [] as string[],
    otherNotes: '',
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

  const handleTimeSlotToggle = (day: string, time: string) => {
    const key = `${day}${time}` as AvailabilityTime;
    handleCheckboxChange('availabilityTimes', key);
  };

  const isTimeSlotSelected = (day: string, time: string) => {
    const key = `${day}${time}`;
    return formData.availabilityTimes.includes(key);
  };

  const handleTaskScroll = () => {
    if (taskListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = taskListRef.current;
      const progress = ((scrollTop + clientHeight) / scrollHeight) * 100;
      setTaskScrollProgress(Math.min(100, Math.max(0, progress)));
    }
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
      photo: formData.photo || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop`,
      description: formData.description,
      location: formData.location,
      religion: formData.religion || undefined,
      interests: formData.interests,
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
  const subtypes = isZorgzoeker ? ZORGZOEKER_SUBTYPES : ZORGAANBIEDER_SUBTYPES;

  const progressSteps = [1, 2, 3, 4];

  return (
    <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
      {step === 1 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>👤 Over jezelf</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Profielfoto</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#fed7aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : formData.name ? (
                  <span style={{ color: '#c2410c', fontWeight: 600, fontSize: '24px' }}>{getInitials(formData.name)}</span>
                ) : (
                  '📷'
                )}
              </div>
              <label style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px dashed #fed7aa',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#c2410c',
                backgroundColor: '#fff7ed',
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '20px' }}>📸</span>
                <span style={{ fontSize: '14px' }}>Kies een foto van je apparaat</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Naam *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Je volledige naam" />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Geslacht/Gender *</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {GENDER_OPTIONS.map(g => (
                <label key={g.value} style={{ 
                  flex: 1, 
                  padding: '14px 8px', 
                  border: formData.gender === g.value ? '2px solid #f97316' : '2px solid #e5e7eb', 
                  borderRadius: '12px', 
                  textAlign: 'center', 
                  cursor: 'pointer', 
                  backgroundColor: formData.gender === g.value ? '#fff7ed' : 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <input type="radio" name="gender" value={g.value} checked={formData.gender === g.value} onChange={handleChange} style={{ display: 'none' }} />
                  <span style={{ fontSize: '24px' }}>{g.icon}</span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{g.label}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="error-message">{errors.gender}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>Wie ben je? *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {subtypes.map(sub => (
                <label key={sub.value} style={{ 
                  padding: '16px', 
                  border: formData.subtype === sub.value ? '2px solid #f97316' : '2px solid #e5e7eb', 
                  borderRadius: '12px', 
                  cursor: 'pointer', 
                  backgroundColor: formData.subtype === sub.value ? '#fff7ed' : 'white',
                  textAlign: 'center',
                }}>
                  <input type="radio" name="subtype" value={sub.value} checked={formData.subtype === sub.value} onChange={handleChange} style={{ display: 'none' }} />
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{sub.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>{sub.label}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{sub.desc}</div>
                </label>
              ))}
            </div>
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

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%', background: '#f97316', border: 'none' }}>Volgende →</button>
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Geloof of levensbeschouwing</label>
            <select name="religion" value={formData.religion} onChange={handleChange} className="input-field">
              <option value="">Kies (optioneel)</option>
              <option value="Geen">Geen</option>
              <option value="Christelijk">Christelijk</option>
              <option value="Katholiek">Katholiek</option>
              <option value="Protestants">Protestants</option>
              <option value="Islam">Islam</option>
              <option value="Anders">Anders</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 500 }}>Interesses en hobby&apos;s</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {INTERESTS.map(interest => (
                <label key={interest} style={{ 
                  padding: '8px 14px', 
                  border: formData.interests.includes(interest) ? '2px solid #f97316' : '2px solid #e5e7eb', 
                  borderRadius: '20px', 
                  cursor: 'pointer', 
                  backgroundColor: formData.interests.includes(interest) ? '#fff7ed' : 'white',
                  fontSize: '13px',
                }}>
                  <input 
                    type="checkbox" 
                    checked={formData.interests.includes(interest)} 
                    onChange={() => handleCheckboxChange('interests', interest)}
                    style={{ display: 'none' }}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%', background: '#f97316', border: 'none' }}>Volgende →</button>
          <button onClick={() => setStep(1)} className="btn-ghost" style={{ width: '100%', marginTop: '12px', color: '#f97316' }}>← Terug</button>
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
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', fontSize: '13px' }}></th>
                    {TIME_SLOTS.map(t => (
                      <th key={t.key} style={{ textAlign: 'center', padding: '8px' }}>
                        <div style={{ fontSize: '20px' }}>{t.icon}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{t.label}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day.key}>
                      <td style={{ padding: '8px', fontSize: '13px', fontWeight: 500 }}>{day.label}</td>
                      {TIME_SLOTS.map(time => (
                        <td key={time.key} style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isTimeSlotSelected(day.key, time.key)}
                            onChange={() => handleTimeSlotToggle(day.key, time.key)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#f97316' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>⏰ 24u</td>
                    <td colSpan={3} style={{ textAlign: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                        <input type="checkbox" checked={formData.availabilityTimes.includes('24_uur')} onChange={() => handleCheckboxChange('availabilityTimes', '24_uur')} style={{ width: '20px', height: '20px', accentColor: '#f97316' }} />
                        <span style={{ fontSize: '13px' }}>24-uurs beschikbaar</span>
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
              <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#fff7ed', borderRadius: '12px', border: '2px solid rgba(249, 115, 22, 0.2)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.hasPets} 
                    onChange={(e) => setFormData(prev => ({ ...prev, hasPets: e.target.checked }))} 
                    style={{ width: '22px', height: '22px', accentColor: '#f97316' }} 
                  />
                  <span style={{ fontSize: '22px' }}>🐾</span>
                  <span>Er zijn huisdieren aanwezig</span>
                </label>
                {formData.hasPets && (
                  <input 
                    type="text" 
                    name="petType" 
                    value={formData.petType} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="Welke huisdieren? (bijv. hond, kat)" 
                    style={{ marginTop: '12px' }} 
                  />
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontWeight: 500 }}>Welke taken zoek je hulp bij? *</label>
                  <span style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '10px' }}>
                    {formData.searchTasks.length} gekozen
                  </span>
                </div>
                <div 
                  ref={taskListRef}
                  onScroll={handleTaskScroll}
                  style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px', position: 'relative' }}
                >
                  {ZORGZOEKER_TASKS.map(task => (
                    <label key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.searchTasks.includes(task.id)} 
                        onChange={() => handleCheckboxChange('searchTasks', task.id)} 
                        style={{ marginRight: '12px', width: '20px', height: '20px', accentColor: '#f97316' }} 
                      />
                      {task.label}
                    </label>
                  ))}
                </div>
                {taskScrollProgress < 100 && (
                  <div style={{ height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', marginTop: '8px' }}>
                    <div style={{ height: '100%', width: `${taskScrollProgress}%`, backgroundColor: '#f97316', borderRadius: '2px', transition: 'width 0.2s' }} />
                  </div>
                )}
                {errors.searchTasks && <p className="error-message">{errors.searchTasks}</p>}
              </div>

              {formData.searchTasks.includes('schoonmaken') && (
                <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#fff7ed', borderRadius: '12px', border: '2px solid rgba(249, 115, 22, 0.2)' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    <span style={{ marginRight: '8px' }}>🧹</span>
                    Schoonmaakspullen
                  </label>
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

          <button onClick={handleNext} className="btn-primary" style={{ width: '100%', background: '#f97316', border: 'none' }}>Volgende →</button>
          <button onClick={() => setStep(2)} className="btn-ghost" style={{ width: '100%', marginTop: '12px', color: '#f97316' }}>← Terug</button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>🏷️ Zorgcategorieën</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>Kies de categorieën die bij je passen:</p>

          <div style={{ marginBottom: '24px', maxHeight: '350px', overflowY: 'auto' }}>
            {ZORG_CATEGORIES.map(cat => (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #e5e7eb', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={formData.categories.includes(cat.id)} 
                  onChange={() => handleCheckboxChange('categories', cat.id)} 
                  style={{ marginRight: '12px', width: '20px', height: '20px', accentColor: '#f97316' }} 
                />
                <span style={{ marginRight: '10px', fontSize: '20px' }}>{cat.icon}</span>
                {cat.label}
              </label>
            ))}
          </div>

          <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', marginBottom: '12px', background: '#f97316', border: 'none' }}>✅ Profiel aanmaken</button>
          <button onClick={() => setStep(3)} className="btn-ghost" style={{ width: '100%', color: '#f97316' }}>← Terug</button>
        </>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  
  return (
    <div className="page-container" style={{ background: `
      linear-gradient(rgba(255, 248, 240, 0.9), rgba(255, 248, 240, 0.9)),
      url('https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1920&q=80') center/cover no-repeat
    ` }}>
      <CookieConsent />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '36px' }}>🧡</span>
          <h1 style={{ color: 'var(--primary)', marginBottom: 0, fontSize: '28px' }}>Naastje</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Profiel aanmaken</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', width: '100%', maxWidth: '300px' }}>
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              style={{ 
                flex: 1, 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: s <= currentStep ? '#f97316' : '#e5e7eb',
                transition: 'background-color 0.3s',
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