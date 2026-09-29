import { useState } from 'react'
import {
	Activity,
	ArrowRight,
	ArrowUpRight,
	Bell,
	CalendarDays,
	Check,
	ChevronDown,
	Clock3,
	FileText,
	Heart,
	Home,
	LayoutGrid,
	MapPin,
	Menu,
	MessageCircle,
	Plus,
	Search,
	Settings,
	ShieldCheck,
	SlidersHorizontal,
	Sparkles,
	Star,
	Stethoscope,
	X,
} from 'lucide-react'

const doctors = [
	{
		name: 'Dr. Elisa Martin',
		specialty: 'Cardiology',
		rating: '4.98',
		reviews: '248 reviews',
		distance: '0.8 mi away',
		price: '$85',
		image: 'photo-1559839734-2b71ea197ec2',
		color: 'sage',
	},
	{
		name: 'Dr. James Wilson',
		specialty: 'Dermatology',
		rating: '4.95',
		reviews: '186 reviews',
		distance: '1.2 mi away',
		price: '$70',
		image: 'photo-1612349317150-e413f6a5b16d',
		color: 'peach',
	},
	{
		name: 'Dr. Priya Kapoor',
		specialty: 'Pediatrics',
		rating: '4.99',
		reviews: '312 reviews',
		distance: '1.6 mi away',
		price: '$75',
		image: 'photo-1594824476967-48c8b964273f',
		color: 'lavender',
	},
]

const specialties = [
	{ label: 'All doctors', icon: LayoutGrid },
	{ label: 'Cardiology', icon: Heart },
	{ label: 'Dermatology', icon: Sparkles },
	{ label: 'Pediatrics', icon: Activity },
	{ label: 'Dentistry', icon: Stethoscope },
]

const navItems = [
	{ label: 'Overview', href: '#overview', icon: Home },
	{ label: 'Appointments', href: '#appointments', icon: CalendarDays, count: '2' },
	{ label: 'Find a doctor', href: '#doctors', icon: Stethoscope },
	{ label: 'Health records', href: '#records', icon: FileText },
	{ label: 'Messages', href: '#messages', icon: MessageCircle, count: '1' },
]

const slots = ['9:30 AM', '10:15 AM', '10:30 AM', '11:00 AM', '1:30 PM', '2:15 PM', '3:00 PM']
const appointmentDays = [
	{ label: 'Tue, 29', weekday: 'TUE', date: '29', month: 'SEP', formatted: 'Sep 29' },
	{ label: 'Wed, 30', weekday: 'WED', date: '30', month: 'SEP', formatted: 'Sep 30' },
	{ label: 'Thu, 1', weekday: 'THU', date: '1', month: 'OCT', formatted: 'Oct 1' },
	{ label: 'Fri, 2', weekday: 'FRI', date: '2', month: 'OCT', formatted: 'Oct 2' },
]

function getEndTime(startTime) {
	const [time, meridiem] = startTime.split(' ')
	let [hours, minutes] = time.split(':').map(Number)
	if (meridiem === 'PM' && hours !== 12) hours += 12
	if (meridiem === 'AM' && hours === 12) hours = 0
	const endMinutes = hours * 60 + minutes + 45
	const endHours = Math.floor(endMinutes / 60) % 24
	const endMeridiem = endHours >= 12 ? 'PM' : 'AM'
	const displayHours = endHours % 12 || 12
	const displayMinutes = String(endMinutes % 60).padStart(2, '0')
	return `${displayHours}:${displayMinutes} ${endMeridiem}`
}

function Avatar({ image, name, size = 'medium' }) {
	return (
		<img
			className={`avatar avatar-${size}`}
			src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=160&h=160&q=85`}
			alt={name}
		/>
	)
}

function BookingModal({ doctor, onClose, onConfirm }) {
	const [selectedDay, setSelectedDay] = useState('Wed, 30')
	const [selectedSlot, setSelectedSlot] = useState('10:30 AM')

	if (!doctor) return null

	return (
		<div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
			<section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
				<button className="icon-button modal-close" onClick={onClose} aria-label="Close booking window">
					<X size={19} />
				</button>
				<div className="modal-kicker"><span className="status-dot" /> New appointment</div>
				<h2 id="booking-title">Book your visit</h2>
				<div className="modal-doctor">
					<Avatar image={doctor.image} name={doctor.name} />
					<div><strong>{doctor.name}</strong><span>{doctor.specialty} · In person</span></div>
					<span className="modal-price">{doctor.price}</span>
				</div>
				<div className="modal-section-title"><span>Choose a date</span><span className="timezone">September – October 2026</span></div>
				<div className="day-options">
					{appointmentDays.map((day) => (
						<button key={day.label} className={`day-option ${selectedDay === day.label ? 'selected' : ''}`} onClick={() => setSelectedDay(day.label)}>
							<span>{day.label.split(',')[0]}</span><strong>{day.date}</strong>
						</button>
					))}
				</div>
				<div className="modal-section-title"><span>Available times</span><span className="timezone">EDT (UTC−4)</span></div>
				<div className="time-options">
					{slots.map((slot) => <button key={slot} className={`time-option ${selectedSlot === slot ? 'selected' : ''}`} onClick={() => setSelectedSlot(slot)}>{slot}</button>)}
				</div>
				<button className="button button-primary confirm-button" onClick={() => onConfirm({ doctor, ...appointmentDays.find((day) => day.label === selectedDay), time: selectedSlot })}>
					Confirm appointment <ArrowRight size={17} />
				</button>
				<p className="modal-footnote"><ShieldCheck size={14} /> You won’t be charged until after your visit</p>
			</section>
		</div>
	)
}

function App() {
	const [activeNav, setActiveNav] = useState('Overview')
	const [activeSpecialty, setActiveSpecialty] = useState('All doctors')
	const [search, setSearch] = useState('')
	const [bookingDoctor, setBookingDoctor] = useState(null)
	const [appointment, setAppointment] = useState(null)
	const [notice, setNotice] = useState('')
	const [menuOpen, setMenuOpen] = useState(false)

	const filteredDoctors = doctors.filter((doctor) => {
		const matchesSpecialty = activeSpecialty === 'All doctors' || doctor.specialty === activeSpecialty
		const matchesSearch = `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(search.toLowerCase())
		return matchesSpecialty && matchesSearch
	})

	function confirmBooking(details) {
		setAppointment(details)
		setBookingDoctor(null)
		setNotice(`Your ${details.formatted} appointment with ${details.doctor.name} is confirmed.`)
		window.setTimeout(() => setNotice(''), 4200)
	}

	return (
		<div className="app-shell">
			<aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
				<a className="brand" href="#overview" onClick={() => setActiveNav('Overview')} aria-label="Medix home">
					<span className="brand-mark"><Plus size={19} strokeWidth={3} /></span><span>medix<span className="brand-period">.</span></span>
				</a>
				<div className="workspace-label">PATIENT SPACE</div>
				<nav className="main-nav" aria-label="Main navigation">
					{navItems.map(({ label, href, icon: Icon, count }) => (
						<a key={label} className={`nav-link ${activeNav === label ? 'nav-active' : ''}`} href={href} onClick={() => { setActiveNav(label); setMenuOpen(false) }}>
							<Icon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}
						</a>
					))}
				</nav>
				<div className="sidebar-spacer" />
				<div className="care-card">
					<span className="care-icon"><Heart size={17} /></span>
					<strong>Your care, connected.</strong>
					<span>Questions about your plan?</span>
					<button onClick={() => { setActiveNav('Messages'); document.querySelector('#messages')?.scrollIntoView({ behavior: 'smooth' }) }}>Talk to your care team <ArrowRight size={14} /></button>
					<span className="care-orbit orbit-one" /><span className="care-orbit orbit-two" />
				</div>
				<a className="nav-link settings-link" href="#settings" onClick={() => setActiveNav('Settings')}><Settings size={18} strokeWidth={1.8} /><span>Settings</span></a>
				<div className="sidebar-profile">
					<div className="profile-initial">OC</div>
					<div className="profile-copy"><strong>Olivia Carter</strong><span>Patient account</span></div>
					<ChevronDown size={15} />
				</div>
			</aside>

			<main className="main-content" id="overview">
				<header className="topbar">
					<button className="icon-button mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation"><Menu size={20} /></button>
					<div className="breadcrumb"><span>Patient space</span><span className="breadcrumb-slash">/</span><strong>{activeNav}</strong></div>
					<div className="topbar-actions">
						<label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctors, specialties..." /><kbd>⌘ K</kbd></label>
						<button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice('You’re all caught up on notifications.')}><Bell size={18} /><span /></button>
						<button className="top-avatar" aria-label="Olivia Carter profile">OC</button>
					</div>
				</header>

				<div className="page-wrap">
					<section className="welcome-row">
						<div>
							<div className="eyebrow"><span className="eyebrow-line" /> TUESDAY, SEPTEMBER 29, 2026</div>
							<h1>A little better, <span>every day.</span></h1>
							<p>Good morning, Olivia. Your health journey is looking good.</p>
						</div>
						<button className="button button-dark" onClick={() => setBookingDoctor(doctors[0])}><Plus size={17} /> Book an appointment</button>
					</section>

					<section className="hero-panel" aria-label="Health overview">
						<div className="hero-copy">
							<div className="hero-tag"><Sparkles size={14} /> YOUR HEALTH, IN FOCUS</div>
							<h2>Feeling good<br />looks good on you.</h2>
							<p>You’re on track with your care. Keep showing up for yourself.</p>
							<a href="#records" className="hero-link" onClick={() => setActiveNav('Health records')}>View your health summary <ArrowRight size={16} /></a>
						</div>
						<div className="hero-art" aria-hidden="true">
							<div className="hero-sun" />
							<div className="hero-ring ring-a" /><div className="hero-ring ring-b" />
							<div className="hero-stat"><span className="hero-stat-icon"><Activity size={16} /></span><span><strong>All looking good</strong><small>Last check-in · Sep 18</small></span><span className="hero-stat-check"><Check size={14} /></span></div>
							<span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✳</span>
						</div>
						<div className="hero-footnote"><ShieldCheck size={14} /> Your care is private and secure</div>
					</section>

					<section className="stats-row" aria-label="Health at a glance">
						<article className="stat-card">
							<div className="stat-top"><span className="stat-icon stat-icon-mint"><Heart size={17} /></span><span className="stat-trend"><ArrowUpRight size={14} /> 4.2%</span></div>
							<div className="stat-label">HEALTH SCORE</div><div className="stat-value">92<span className="stat-unit"> / 100</span></div>
							<div className="stat-bottom"><span>Looking great this month</span><div className="mini-bars" aria-label="Score trending up">{[37, 53, 43, 68, 55, 76, 64, 88, 72, 96].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></div>
						</article>
						<article className="stat-card">
							<div className="stat-top"><span className="stat-icon stat-icon-lilac"><CalendarDays size={17} /></span><span className="stat-note">UP NEXT</span></div>
							<div className="stat-label">NEXT APPOINTMENT</div><div className="stat-value stat-date">{appointment?.formatted ?? 'Sep 30'}<span className="stat-unit"> · {appointment?.time ?? '10:30 AM'}</span></div>
							<div className="stat-bottom"><span>{appointment?.doctor.name ?? 'Dr. Elisa Martin'} · {appointment?.doctor.specialty ?? 'Cardiology'}</span><a href="#appointments" aria-label="View appointment"><ArrowRight size={15} /></a></div>
						</article>
						<article className="stat-card stat-card-accent">
							<div className="stat-top"><span className="stat-icon stat-icon-coral"><Heart size={17} /></span><span className="stat-note">YOUR CARE CIRCLE</span></div>
							<div className="stat-label">TRUSTED PROVIDERS</div><div className="stat-value">06<span className="stat-unit"> specialists</span></div>
							<div className="stat-bottom"><span>Across 4 specialties</span><div className="avatar-stack"><Avatar image={doctors[0].image} name="Dr. Elisa Martin" size="tiny" /><Avatar image={doctors[1].image} name="Dr. James Wilson" size="tiny" /><Avatar image={doctors[2].image} name="Dr. Priya Kapoor" size="tiny" /><span>+3</span></div></div>
						</article>
					</section>

					<section className="content-section appointment-section" id="appointments">
						<div className="section-heading"><div><div className="section-kicker">ON YOUR CALENDAR</div><h2>Upcoming appointment</h2></div><a href="#appointments" className="subtle-link">See all appointments <ArrowRight size={15} /></a></div>
						<article className="appointment-card">
							<div className="appointment-date"><span>{appointment?.month ?? 'SEP'}</span><strong>{appointment?.date ?? '30'}</strong><span>{appointment?.weekday ?? 'WED'}</span></div>
							<div className="appointment-divider" />
							<Avatar image={appointment?.doctor.image ?? doctors[0].image} name={appointment?.doctor.name ?? 'Dr. Elisa Martin'} size="large" />
							<div className="appointment-details"><div className="appointment-label"><span className="status-dot" /> CONFIRMED <span className="detail-separator">·</span> IN PERSON</div><h3>{appointment?.doctor.name ?? 'Dr. Elisa Martin'}</h3><p>{appointment?.doctor.specialty ?? 'Cardiology'} <span>·</span> Annual heart health check</p><div className="appointment-meta"><span><Clock3 size={14} /> {appointment?.time ?? '10:30 AM'} – {getEndTime(appointment?.time ?? '10:30 AM')}</span><span><MapPin size={14} /> Willow Creek Medical Center</span></div></div>
							<div className="appointment-actions"><button className="button button-outline" onClick={() => setBookingDoctor(appointment?.doctor ?? doctors[0])}>Reschedule</button><button className="icon-button more-button" aria-label="More appointment options"><ChevronDown size={18} /></button></div>
						</article>
					</section>

					<section className="content-section doctor-section" id="doctors">
						<div className="section-heading doctor-heading"><div><div className="section-kicker">CARE THAT FEELS PERSONAL</div><h2>Find your doctor</h2></div><button className="filter-button" onClick={() => { setActiveSpecialty('All doctors'); setSearch('') }}><SlidersHorizontal size={16} /> Filters</button></div>
						<div className="specialty-row" role="tablist" aria-label="Filter by specialty">
							{specialties.map(({ label, icon: Icon }) => <button key={label} role="tab" aria-selected={activeSpecialty === label} className={`specialty-chip ${activeSpecialty === label ? 'chip-active' : ''}`} onClick={() => setActiveSpecialty(label)}><Icon size={15} />{label}</button>)}
							<button className="location-chip"><MapPin size={14} /> New York, NY <ChevronDown size={13} /></button>
						</div>
						<div className="doctor-grid">
							{filteredDoctors.length ? filteredDoctors.map((doctor) => <article className="doctor-card" key={doctor.name}>
								<div className={`doctor-photo photo-${doctor.color}`}><img src={`https://images.unsplash.com/${doctor.image}?auto=format&fit=crop&w=520&h=380&q=85`} alt={doctor.name} /><button className="save-button" aria-label={`Save ${doctor.name}`} onClick={(event) => { event.currentTarget.classList.toggle('saved'); event.currentTarget.setAttribute('aria-pressed', event.currentTarget.classList.contains('saved')) }}><Heart size={17} /></button><span className="doctor-available"><i /> Available today</span></div>
								<div className="doctor-info"><div className="doctor-name-row"><div><h3>{doctor.name}</h3><p>{doctor.specialty}</p></div><div className="rating"><Star size={14} fill="currentColor" /> {doctor.rating}</div></div><div className="doctor-card-meta"><span><MapPin size={13} />{doctor.distance}</span><span>{doctor.reviews}</span></div><div className="doctor-card-bottom"><span>From <strong>{doctor.price}</strong><small> / visit</small></span><button className="button button-book" onClick={() => setBookingDoctor(doctor)}>Book visit <ArrowRight size={15} /></button></div></div>
							</article>) : <div className="empty-results"><Search size={22} /><strong>No doctors found</strong><span>Try another name or specialty.</span><button className="text-button" onClick={() => { setSearch(''); setActiveSpecialty('All doctors') }}>Clear search</button></div>}
						</div>
						<div className="doctor-footer"><span>Showing <strong>{filteredDoctors.length}</strong> of 24 trusted providers</span><button className="subtle-link" onClick={() => setNotice('More providers are being added to your directory.')}>Explore all doctors <ArrowRight size={15} /></button></div>
					</section>

					<section className="lower-grid" id="records">
						<article className="record-panel"><div className="lower-panel-head"><div><div className="section-kicker">YOUR WELLNESS</div><h2>Health summary</h2></div><button className="icon-button small-arrow" aria-label="View all health records"><ArrowUpRight size={17} /></button></div><div className="summary-row"><span className="summary-icon summary-green"><Activity size={17} /></span><span className="summary-copy"><strong>Blood pressure</strong><small>Last checked Sep 18</small></span><span className="summary-reading">118<span> / 76</span><small>mmHg</small></span><span className="summary-status">Normal</span></div><div className="summary-row"><span className="summary-icon summary-peach"><Heart size={17} /></span><span className="summary-copy"><strong>Resting heart rate</strong><small>Last checked Sep 18</small></span><span className="summary-reading">68<small> bpm</small></span><span className="summary-status">Healthy</span></div><a className="all-records-link" href="#records">Open health records <ArrowRight size={15} /></a></article>
						<article className="message-panel" id="messages"><div className="lower-panel-head"><div><div className="section-kicker">HERE WHEN YOU NEED US</div><h2>Care team</h2></div><span className="message-count">1 new</span></div><div className="care-team-row"><div className="care-team-avatars"><Avatar image={doctors[0].image} name="Dr. Elisa Martin" size="team" /><span className="online-indicator" /></div><div className="care-team-copy"><strong>Willow Creek Care Team</strong><span>Dr. Elisa Martin and 2 others</span><small><span className="status-dot" /> Usually replies in a few hours</small></div><button className="icon-button message-action" aria-label="Message your care team" onClick={() => setNotice('Your care team has been notified.')}><MessageCircle size={18} /></button></div><div className="message-preview"><span className="message-unread" /><p><strong>Care coordinator</strong> · Your annual checkup is coming up. Let us know if you need anything before your visit.</p><span className="message-time">9:42 am</span></div></article>
					</section>
					<footer className="page-footer"><span>© 2026 Medix Health, Inc.</span><span><ShieldCheck size={13} /> HIPAA-compliant care</span><a href="#settings" id="settings">Privacy &amp; security</a></footer>
				</div>
			</main>

			{notice && <div className="toast" role="status"><span><Check size={16} /></span>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
			<BookingModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} onConfirm={confirmBooking} />
		</div>
	)
}

export default App
