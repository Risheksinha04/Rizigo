import React, { useState } from 'react';
import './App.css';

// Backend API Service
const API_BASE_URL = 'http://localhost:8080';

const backend = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error(await response.text() || 'Login failed.');
        return { message: 'Login successful' };
    },
    register: async (username, email, password, phone, age) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, phone, age }),
        });
        if (!response.ok) throw new Error(await response.text() || 'Registration failed.');
        return response.json();
    },
    searchHotels: async (requestBody) => {
        const response = await fetch(`${API_BASE_URL}/hotels/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) throw new Error(await response.text() || 'Search failed.');
        return response.json();
    }
};

// Icon Components
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const StarIcon = ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill={filled ? "#F59E0B" : "#E5E7EB"}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.786.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"/>
    </svg>
);

const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
    </svg>
);

const EmailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
    </svg>
);

const PhoneIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
    </svg>
);

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
    </svg>
);

const LocationIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
    </svg>
);

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
    </svg>
);

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1l7 3v5c0 4.5-3 8.2-7 9.5C6 17.2 3 13.5 3 9V4l7-3zm-1 12.5l5-5-1.4-1.4L9 10.7 7.4 9.1 6 10.5l3 3z" clipRule="evenodd"/>
    </svg>
);

const TagIcon = () => (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.6 9.6L10.4 2.4A2 2 0 009 1.8H3a2 2 0 00-2 2v6c0 .5.2 1 .6 1.4l7.2 7.2a2 2 0 002.8 0l6-6a2 2 0 000-2.8zM5.5 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd"/>
    </svg>
);

const CompassIcon = () => (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.5-11.5l-2 5-5 2 2-5 5-2z" clipRule="evenodd"/>
    </svg>
);

// Loading Screen Component — an animated flight-path stands in for a spinner,
// fitting the ticket/travel visual language.
const LoadingScreen = () => (
    <div className="loading-overlay">
        <div className="loading-content">
            <div className="route-track">
                <div className="route-dot"></div>
            </div>
            <h2 className="loading-title">Searching for your stay</h2>
            <p className="loading-subtitle">Checking routes &amp; rates…</p>
        </div>
    </div>
);

const Header = ({ title, subtitle, eyebrow }) => {
    const [before, after] = title.split('RiziGo');
    return (
        <header className="header">
            {eyebrow && <span className="header-eyebrow">{eyebrow}</span>}
            <h1 className="header-title">
                {before}
                <span className="brand">RiziGo</span>
                {after || ''}
            </h1>
            <p className="header-subtitle">{subtitle}</p>
        </header>
    );
};

const Message = ({ message, type }) => (
    <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`}>
        {message}
    </div>
);

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="input-group">
        <label className="label">{label}</label>
        <div className="input-wrapper">
            {Icon && <Icon />}
            <input className="input" {...props} />
        </div>
    </div>
);

// ---- LOGIN FORM ----
// Now shown only when the user tries to book a hotel (or taps "Log in" from search).
// pendingHotelName lets us tell the user *why* they're being asked to log in.
const LoginForm = ({ onLoginSuccess, onSwitchView, pendingHotelName }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await backend.login(email, password);
            setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
            setTimeout(() => onLoginSuccess(), 1000);
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <Header
                eyebrow={pendingHotelName ? 'One Step to Confirm' : 'Boarding Pass'}
                title="Get Started With RiziGo"
                subtitle={pendingHotelName
                    ? `Log in or continue as guest to book ${pendingHotelName}.`
                    : 'Wherever You Go Book With RiziGo!'}
            />
            <form onSubmit={handleSubmit} className="form">
                <InputField
                    label="Email"
                    icon={EmailIcon}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <InputField
                    label="Password"
                    icon={LockIcon}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            Logging In...
                        </>
                    ) : (
                        'Log In'
                    )}
                </button>
            </form>

            <div className="separator">
                <span className="separator-text">or</span>
            </div>

            <button className="btn btn-google" type="button">
                <GoogleIcon />
                Log in with Google
            </button>

            <button
                className="btn btn-primary"
                type="button"
                style={{ width: '100%', marginTop: '18px' }}
                onClick={() => onLoginSuccess()}
            >
                Continue as Guest
            </button>

            <p className="auth-switch">
                Don't have an account?{' '}
                <button onClick={() => onSwitchView('register')} className="link-btn">
                    Register here
                </button>
            </p>

            {pendingHotelName && (
                <p className="auth-switch">
                    <button onClick={() => onSwitchView('search')} className="link-btn">
                        ← Back to search
                    </button>
                </p>
            )}

            {message && <Message message={message.text} type={message.type} />}
        </div>
    );
};

const RegisterForm = ({ onSwitchView, pendingHotelName }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await backend.register(username, email, password, phone, age);
            setMessage({ text: 'Registration successful! Please log in.', type: 'success' });
            setTimeout(() => onSwitchView('login'), 1000);
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <Header
                eyebrow="New Passenger"
                title="Register for RiziGo"
                subtitle={pendingHotelName
                    ? `Create an account to finish booking ${pendingHotelName}.`
                    : 'Create your account to get started with booking.'}
            />
            <form onSubmit={handleSubmit} className="form">
                <InputField
                    label="Username"
                    icon={UserIcon}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <InputField
                    label="Email"
                    icon={EmailIcon}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <InputField
                    label="Password"
                    icon={LockIcon}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <InputField
                    label="Phone Number"
                    icon={PhoneIcon}
                    type="text"
                    placeholder="+919876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <InputField
                    label="Age"
                    icon={UserIcon}
                    type="number"
                    min="18"
                    placeholder="18"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            Registering...
                        </>
                    ) : (
                        'Register'
                    )}
                </button>
            </form>

            <div className="separator">
                <span className="separator-text">or</span>
            </div>

            <button className="btn btn-google" type="button">
                <GoogleIcon />
                Register with Google
            </button>

            <p className="auth-switch">
                Already have an account?{' '}
                <button onClick={() => onSwitchView('login')} className="link-btn">
                    Log in here
                </button>
            </p>

            {message && <Message message={message.text} type={message.type} />}
        </div>
    );
};

// A handful of popular Indian destinations shown as quick-select chips,
// styled with airport/station-style codes to fit the ticket motif.
const POPULAR_DESTINATIONS = [
    { code: 'DEL', name: 'New Delhi' },
    { code: 'BOM', name: 'Mumbai' },
    { code: 'BLR', name: 'Bengaluru' },
    { code: 'PNQ', name: 'Pune' },
    { code: 'GOI', name: 'Goa' },
    { code: 'JAI', name: 'Jaipur' },
];

// ---- SEARCH FORM ----
// This is now the FIRST screen the user sees. Booking a hotel routes to login/register;
// browsing does not require an account at all.
const SearchForm = ({ onBookNow, onLoginClick }) => {
    const [searchParams, setSearchParams] = useState({
        location: '', name: '', phone: '', email: '', age: '',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date().toISOString().split('T')[0],
        numGuests: 1, numRooms: 1, typeAccommodation: ''
    });
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Util function to wait N ms
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setHotels([]);
        try {
            // Wait for both: the fetch AND at least 2.5s
            const [hotelResp] = await Promise.all([
                backend.searchHotels(searchParams),
                wait(2500)
            ]);
            setHotels(hotelResp.data);
            setMessage({ text: hotelResp.message, type: 'success' });
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} filled={i < Math.floor(rating)} />
        ));
    };

    return (
        <div className="search-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={onLoginClick} className="link-btn">
                    Log in
                </button>
            </div>
            <Header eyebrow="Wherever You Go" title="Find Your Perfect Stay" subtitle="Search for hotels by city or name." />

            <div className="trust-strip">
                <div className="trust-item">
                    <ShieldIcon />
                    <span>Verified stays only</span>
                </div>
                <div className="trust-item">
                    <TagIcon />
                    <span>Best price match</span>
                </div>
                <div className="trust-item">
                    <CompassIcon />
                    <span>Secure, guest-friendly booking</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-grid">
                    <div className="grid-full">
                        <InputField
                            label="Destination"
                            icon={LocationIcon}
                            name="location"
                            placeholder="e.g., New Delhi"
                            value={searchParams.location}
                            onChange={handleChange}
                            required
                        />
                        <div className="chip-row">
                            {POPULAR_DESTINATIONS.map((dest) => (
                                <button
                                    type="button"
                                    key={dest.code}
                                    className="destination-chip"
                                    onClick={() => setSearchParams(prev => ({ ...prev, location: dest.name }))}
                                >
                                    <span className="chip-code">{dest.code}</span>
                                    {dest.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <InputField
                        label="Your Name"
                        icon={UserIcon}
                        name="name"
                        placeholder="Your Name"
                        value={searchParams.name}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Your Email"
                        icon={EmailIcon}
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={searchParams.email}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Phone"
                        icon={PhoneIcon}
                        name="phone"
                        placeholder="+919876543210"
                        value={searchParams.phone}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Age"
                        icon={UserIcon}
                        name="age"
                        type="number"
                        min="18"
                        placeholder="18"
                        value={searchParams.age}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Check-in"
                        icon={CalendarIcon}
                        name="checkIn"
                        type="date"
                        value={searchParams.checkIn}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                    <InputField
                        label="Check-out"
                        icon={CalendarIcon}
                        name="checkOut"
                        type="date"
                        value={searchParams.checkOut}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                    <InputField
                        label="Guests"
                        name="numGuests"
                        type="number"
                        placeholder="1"
                        value={searchParams.numGuests}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Rooms"
                        name="numRooms"
                        type="number"
                        placeholder="1"
                        value={searchParams.numRooms}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Type"
                        name="typeAccommodation"
                        placeholder="e.g., hotel"
                        value={searchParams.typeAccommodation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary search-btn">
                    Search Hotels
                </button>
            </form>

            {message && <Message message={message.text} type={message.type} />}

            {loading && <LoadingScreen />}

            {!loading && message?.type === 'success' && hotels.length === 0 && (
                <div className="empty-state">
                    <CompassIcon />
                    <h3>No stays found on this route</h3>
                    <p>Try a nearby city or widen your dates — new listings come in often.</p>
                </div>
            )}

            {!loading && hotels.length > 0 && (
                <div className="hotels-grid">
                    {hotels.map((hotel) => (
                        <div key={hotel.id} className="hotel-card">
                            <div className="hotel-image">
                                <img
                                    src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop`}
                                    alt={hotel.name}
                                />
                                <div className="hotel-badge">{hotel.source}</div>
                            </div>
                            <div className="hotel-content">
                                <div className="hotel-header">
                                    <h3 className="hotel-name">{hotel.name}</h3>
                                    <div className="hotel-rating">
                                        {renderStars(hotel.rating)}
                                        <span className="rating-text">{hotel.rating && hotel.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <p className="hotel-location">
                                    <LocationIcon />
                                    {hotel.location}
                                </p>
                                <div className="hotel-details">
                                    <span className="rooms-available">{hotel.roomsAvailable} rooms available</span>
                                </div>
                                <div className="hotel-footer">
                                    <div className="price-section">
                                        <span className="price">₹{hotel.price.toLocaleString()}</span>
                                        <span className="price-unit">per night</span>
                                    </div>
                                    <button onClick={() => onBookNow(hotel, searchParams)} className="btn btn-primary book-btn">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Deterministic-ish booking reference for display purposes.
// Replace with a real ID returned by the backend once bookings are persisted.
const generateBookingRef = () =>
    'RZG-' + Math.random().toString(36).slice(2, 8).toUpperCase();

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
};

const nightsBetween = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const ms = new Date(checkOut) - new Date(checkIn);
    const nights = Math.round(ms / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
};

const ConfirmationPage = ({ hotel, bookingDetails, onSearchAgain }) => {
    // bookingRef is generated once per confirmation, not on every re-render.
    const [bookingRef] = useState(generateBookingRef);
    const nights = nightsBetween(bookingDetails?.checkIn, bookingDetails?.checkOut);
    const total = hotel.price * nights;

    return (
        <div className="confirmation-container">
            <div className="confirmation-content">
                <div className="success-icon">✓</div>
                <h1 className="confirmation-title">Booking Confirmed!</h1>
                <p className="confirmation-subtitle">Thank you for booking with us.</p>

                <div className="booking-details">
                    <p>Your booking for <strong>{hotel.name}</strong> is now confirmed.</p>
                    <p className="booking-ref">Booking reference: <strong>{bookingRef}</strong></p>

                    <div className="ticket-rows">
                        <div className="ticket-row">
                            <span>Check-in</span>
                            <strong>{formatDate(bookingDetails?.checkIn)}</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Check-out</span>
                            <strong>{formatDate(bookingDetails?.checkOut)}</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Duration</span>
                            <strong>{nights} night{nights > 1 ? 's' : ''}</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Guests / Rooms</span>
                            <strong>{bookingDetails?.numGuests || 1} guest(s), {bookingDetails?.numRooms || 1} room(s)</strong>
                        </div>
                        <div className="ticket-row">
                            <span>Location</span>
                            <strong>{hotel.location}</strong>
                        </div>
                        {bookingDetails?.name && (
                            <div className="ticket-row">
                                <span>Booked by</span>
                                <strong>{bookingDetails.name}</strong>
                            </div>
                        )}
                        <div className="ticket-divider"></div>
                        <div className="ticket-row ticket-total">
                            <span>Total ({nights} night{nights > 1 ? 's' : ''})</span>
                            <strong>₹{total.toLocaleString()}</strong>
                        </div>
                    </div>

                    <p className="booking-closing">We hope you enjoy your stay!</p>
                </div>

                <button onClick={onSearchAgain} className="btn btn-primary">
                    Search Again
                </button>
            </div>
        </div>
    );
};

const App = () => {
    // Search page is now the landing view.
    const [view, setView] = useState('search');
    // Hotel the user tapped "Book Now" on, held while they log in/register.
    const [selectedHotel, setSelectedHotel] = useState(null);
    // The search form values at the moment of booking (dates, guests, contact info)
    // so the confirmation page can show real check-in/check-out details.
    const [bookingDetails, setBookingDetails] = useState(null);

    // "Book Now" no longer books directly — it routes through login first.
    const handleBookNow = (hotel, details) => {
        setSelectedHotel(hotel);
        setBookingDetails(details);
        setView('login');
    };

    // Voluntary login from the search page header (no hotel pending).
    const handleLoginClick = () => {
        setSelectedHotel(null);
        setBookingDetails(null);
        setView('login');
    };

    // After login/guest-continue: go straight to confirming the pending hotel,
    // or back to search if the user logged in without booking anything.
    const handleLoginSuccess = () => {
        if (selectedHotel) {
            setView('confirmation');
        } else {
            setView('search');
        }
    };

    const handleSearchAgain = () => {
        setSelectedHotel(null);
        setBookingDetails(null);
        setView('search');
    };

    const renderView = () => {
        switch (view) {
            case 'search':
                return <SearchForm onBookNow={handleBookNow} onLoginClick={handleLoginClick} />;
            case 'login':
                return (
                    <LoginForm
                        onLoginSuccess={handleLoginSuccess}
                        onSwitchView={setView}
                        pendingHotelName={selectedHotel?.name}
                    />
                );
            case 'register':
                return (
                    <RegisterForm
                        onSwitchView={setView}
                        pendingHotelName={selectedHotel?.name}
                    />
                );
            case 'confirmation':
                return (
                    <ConfirmationPage
                        hotel={selectedHotel}
                        bookingDetails={bookingDetails}
                        onSearchAgain={handleSearchAgain}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="app">
            <div className="container">
                {renderView()}
            </div>
        </div>
    );
};

export default App;
// import React, { useState } from 'react';
// import './App.css';
//
// // Backend API Service
// const API_BASE_URL = 'http://localhost:8080';
//
// const backend = {
//     login: async (email, password) => {
//         const response = await fetch(`${API_BASE_URL}/auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password }),
//         });
//         if (!response.ok) throw new Error(await response.text() || 'Login failed.');
//         return { message: 'Login successful' };
//     },
//     register: async (username, email, password, phone, age) => {
//         const response = await fetch(`${API_BASE_URL}/auth/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, email, password, phone, age }),
//         });
//         if (!response.ok) throw new Error(await response.text() || 'Registration failed.');
//         return response.json();
//     },
//     searchHotels: async (requestBody) => {
//         const response = await fetch(`${API_BASE_URL}/hotels/search`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(requestBody),
//         });
//         if (!response.ok) throw new Error(await response.text() || 'Search failed.');
//         return response.json();
//     }
// };
//
// // Icon Components
// const GoogleIcon = () => (
//     <svg width="20" height="20" viewBox="0 0 24 24">
//         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//     </svg>
// );
//
// const StarIcon = ({ filled }) => (
//     <svg width="16" height="16" viewBox="0 0 20 20" fill={filled ? "#F59E0B" : "#E5E7EB"}>
//         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.786.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"/>
//     </svg>
// );
//
// const UserIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
//     </svg>
// );
//
// const EmailIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
//         <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
//         <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
//     </svg>
// );
//
// const PhoneIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
//         <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
//     </svg>
// );
//
// const LockIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
//     </svg>
// );
//
// const LocationIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
//     </svg>
// );
//
// const CalendarIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
//     </svg>
// );
//
// // Loading Screen Component
// const LoadingScreen = () => (
//     <div className="loading-overlay">
//         <div className="loading-content">
//             <div className="spinner large"></div>
//             <h2 className="loading-title">Searching for best accommodations…</h2>
//             <p className="loading-subtitle">Hold tight, almost there!</p>
//         </div>
//     </div>
// );
//
// const Header = ({ title, subtitle }) => {
//     const [before, after] = title.split('RiziGo');
//     return (
//         <header className="header">
//             <h1 className="header-title">
//                 {before}
//                 <span className="brand">RiziGo</span>
//                 {after || ''}
//             </h1>
//             <p className="header-subtitle">{subtitle}</p>
//         </header>
//     );
// };
//
// const Message = ({ message, type }) => (
//     <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`}>
//         {message}
//     </div>
// );
//
// const InputField = ({ label, icon: Icon, ...props }) => (
//     <div className="input-group">
//         <label className="label">{label}</label>
//         <div className="input-wrapper">
//             {Icon && <Icon />}
//             <input className="input" {...props} />
//         </div>
//     </div>
// );
//
// // ---- LOGIN FORM ----
// // Now shown only when the user tries to book a hotel (or taps "Log in" from search).
// // pendingHotelName lets us tell the user *why* they're being asked to log in.
// const LoginForm = ({ onLoginSuccess, onSwitchView, pendingHotelName }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage(null);
//         try {
//             await backend.login(email, password);
//             setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
//             setTimeout(() => onLoginSuccess(), 1000);
//         } catch (error) {
//             setMessage({ text: error.message, type: 'error' });
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="form-container">
//             <Header
//                 title="Get Started With RiziGo"
//                 subtitle={pendingHotelName
//                     ? `Log in or continue as guest to book ${pendingHotelName}.`
//                     : 'Wherever You Go Book With RiziGo!'}
//             />
//             <form onSubmit={handleSubmit} className="form">
//                 <InputField
//                     label="Email"
//                     icon={EmailIcon}
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <InputField
//                     label="Password"
//                     icon={LockIcon}
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit" disabled={loading} className="btn btn-primary">
//                     {loading ? (
//                         <>
//                             <div className="spinner"></div>
//                             Logging In...
//                         </>
//                     ) : (
//                         'Log In'
//                     )}
//                 </button>
//             </form>
//
//             <div className="separator">
//                 <span className="separator-text">or</span>
//             </div>
//
//             <button className="btn btn-google" type="button">
//                 <GoogleIcon />
//                 Log in with Google
//             </button>
//
//             <button
//                 className="btn btn-primary"
//                 type="button"
//                 style={{ width: '100%', marginTop: '18px' }}
//                 onClick={() => onLoginSuccess()}
//             >
//                 Continue as Guest
//             </button>
//
//             <p className="auth-switch">
//                 Don't have an account?{' '}
//                 <button onClick={() => onSwitchView('register')} className="link-btn">
//                     Register here
//                 </button>
//             </p>
//
//             {pendingHotelName && (
//                 <p className="auth-switch">
//                     <button onClick={() => onSwitchView('search')} className="link-btn">
//                         ← Back to search
//                     </button>
//                 </p>
//             )}
//
//             {message && <Message message={message.text} type={message.type} />}
//         </div>
//     );
// };
//
// const RegisterForm = ({ onSwitchView, pendingHotelName }) => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [phone, setPhone] = useState('');
//     const [age, setAge] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage(null);
//         try {
//             await backend.register(username, email, password, phone, age);
//             setMessage({ text: 'Registration successful! Please log in.', type: 'success' });
//             setTimeout(() => onSwitchView('login'), 1000);
//         } catch (error) {
//             setMessage({ text: error.message, type: 'error' });
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="form-container">
//             <Header
//                 title="Register for RiziGo"
//                 subtitle={pendingHotelName
//                     ? `Create an account to finish booking ${pendingHotelName}.`
//                     : 'Create your account to get started with booking.'}
//             />
//             <form onSubmit={handleSubmit} className="form">
//                 <InputField
//                     label="Username"
//                     icon={UserIcon}
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                 />
//                 <InputField
//                     label="Email"
//                     icon={EmailIcon}
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <InputField
//                     label="Password"
//                     icon={LockIcon}
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <InputField
//                     label="Phone Number"
//                     icon={PhoneIcon}
//                     type="text"
//                     placeholder="+919876543210"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     required
//                 />
//                 <InputField
//                     label="Age"
//                     icon={UserIcon}
//                     type="number"
//                     min="18"
//                     placeholder="18"
//                     value={age}
//                     onChange={(e) => setAge(e.target.value)}
//                     required
//                 />
//                 <button type="submit" disabled={loading} className="btn btn-primary">
//                     {loading ? (
//                         <>
//                             <div className="spinner"></div>
//                             Registering...
//                         </>
//                     ) : (
//                         'Register'
//                     )}
//                 </button>
//             </form>
//
//             <div className="separator">
//                 <span className="separator-text">or</span>
//             </div>
//
//             <button className="btn btn-google" type="button">
//                 <GoogleIcon />
//                 Register with Google
//             </button>
//
//             <p className="auth-switch">
//                 Already have an account?{' '}
//                 <button onClick={() => onSwitchView('login')} className="link-btn">
//                     Log in here
//                 </button>
//             </p>
//
//             {message && <Message message={message.text} type={message.type} />}
//         </div>
//     );
// };
//
// // ---- SEARCH FORM ----
// // This is now the FIRST screen the user sees. Booking a hotel routes to login/register;
// // browsing does not require an account at all.
// const SearchForm = ({ onBookNow, onLoginClick }) => {
//     const [searchParams, setSearchParams] = useState({
//         location: '', name: '', phone: '', email: '', age: '',
//         checkIn: new Date().toISOString().split('T')[0],
//         checkOut: new Date().toISOString().split('T')[0],
//         numGuests: 1, numRooms: 1, typeAccommodation: ''
//     });
//     const [hotels, setHotels] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState(null);
//
//     // Util function to wait N ms
//     const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage(null);
//         setHotels([]);
//         try {
//             // Wait for both: the fetch AND at least 2.5s
//             const [hotelResp] = await Promise.all([
//                 backend.searchHotels(searchParams),
//                 wait(2500)
//             ]);
//             setHotels(hotelResp.data);
//             setMessage({ text: hotelResp.message, type: 'success' });
//         } catch (error) {
//             setMessage({ text: error.message, type: 'error' });
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSearchParams(prev => ({ ...prev, [name]: value }));
//     };
//
//     const renderStars = (rating) => {
//         return Array.from({ length: 5 }, (_, i) => (
//             <StarIcon key={i} filled={i < Math.floor(rating)} />
//         ));
//     };
//
//     return (
//         <div className="search-container">
//             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                 <button onClick={onLoginClick} className="link-btn">
//                     Log in
//                 </button>
//             </div>
//             <Header title="Find Your Perfect Stay" subtitle="Search for hotels by city or name." />
//             <form onSubmit={handleSubmit} className="search-form">
//                 <div className="search-grid">
//                     <div className="grid-full">
//                         <InputField
//                             label="Destination"
//                             icon={LocationIcon}
//                             name="location"
//                             placeholder="e.g., New Delhi"
//                             value={searchParams.location}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <InputField
//                         label="Your Name"
//                         icon={UserIcon}
//                         name="name"
//                         placeholder="Your Name"
//                         value={searchParams.name}
//                         onChange={handleChange}
//                         required
//                     />
//                     <InputField
//                         label="Your Email"
//                         icon={EmailIcon}
//                         name="email"
//                         type="email"
//                         placeholder="you@example.com"
//                         value={searchParams.email}
//                         onChange={handleChange}
//                         required
//                     />
//                     <InputField
//                         label="Phone"
//                         icon={PhoneIcon}
//                         name="phone"
//                         placeholder="+919876543210"
//                         value={searchParams.phone}
//                         onChange={handleChange}
//                         required
//                     />
//                     <InputField
//                         label="Age"
//                         icon={UserIcon}
//                         name="age"
//                         type="number"
//                         min="18"
//                         placeholder="18"
//                         value={searchParams.age}
//                         onChange={handleChange}
//                         required
//                     />
//                     <InputField
//                         label="Check-in"
//                         icon={CalendarIcon}
//                         name="checkIn"
//                         type="date"
//                         value={searchParams.checkIn}
//                         onChange={handleChange}
//                         min={new Date().toISOString().split('T')[0]}
//                         required
//                     />
//                     <InputField
//                         label="Check-out"
//                         icon={CalendarIcon}
//                         name="checkOut"
//                         type="date"
//                         value={searchParams.checkOut}
//                         onChange={handleChange}
//                         min={new Date().toISOString().split('T')[0]}
//                         required
//                     />
//                     <InputField
//                         label="Guests"
//                         name="numGuests"
//                         type="number"
//                         placeholder="1"
//                         value={searchParams.numGuests}
//                         onChange={handleChange}
//                         required
//                     />
//                     <InputField
//                         label="Rooms"
//                         name="numRooms"
//                         type="number"
//                         placeholder="1"
//                         value={searchParams.numRooms}
//                         onChange={handleChange}
//                         required
//                     />
//                     <InputField
//                         label="Type"
//                         name="typeAccommodation"
//                         placeholder="e.g., hotel"
//                         value={searchParams.typeAccommodation}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit" disabled={loading} className="btn btn-primary search-btn">
//                     Search Hotels
//                 </button>
//             </form>
//
//             {message && <Message message={message.text} type={message.type} />}
//
//             {loading && <LoadingScreen />}
//
//             {!loading && hotels.length > 0 && (
//                 <div className="hotels-grid">
//                     {hotels.map((hotel) => (
//                         <div key={hotel.id} className="hotel-card">
//                             <div className="hotel-image">
//                                 <img
//                                     src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop`}
//                                     alt={hotel.name}
//                                 />
//                                 <div className="hotel-badge">{hotel.source}</div>
//                             </div>
//                             <div className="hotel-content">
//                                 <div className="hotel-header">
//                                     <h3 className="hotel-name">{hotel.name}</h3>
//                                     <div className="hotel-rating">
//                                         {renderStars(hotel.rating)}
//                                         <span className="rating-text">{hotel.rating && hotel.rating.toFixed(1)}</span>
//                                     </div>
//                                 </div>
//                                 <p className="hotel-location">
//                                     <LocationIcon />
//                                     {hotel.location}
//                                 </p>
//                                 <div className="hotel-details">
//                                     <span className="rooms-available">{hotel.roomsAvailable} rooms available</span>
//                                 </div>
//                                 <div className="hotel-footer">
//                                     <div className="price-section">
//                                         <span className="price">₹{hotel.price.toLocaleString()}</span>
//                                         <span className="price-unit">per night</span>
//                                     </div>
//                                     <button onClick={() => onBookNow(hotel)} className="btn btn-primary book-btn">
//                                         Book Now
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// const ConfirmationPage = ({ hotel, onSearchAgain }) => (
//     <div className="confirmation-container">
//         <div className="confirmation-content">
//             <div className="success-icon">✓</div>
//             <h1 className="confirmation-title">Booking Confirmed!</h1>
//             <p className="confirmation-subtitle">Thank you for booking with us.</p>
//             <div className="booking-details">
//                 <p>Your booking for <strong>{hotel.name}</strong> is now confirmed.</p>
//                 <p>We hope you enjoy your stay!</p>
//             </div>
//             <button onClick={onSearchAgain} className="btn btn-primary">
//                 Search Again
//             </button>
//         </div>
//     </div>
// );
//
// const App = () => {
//     // Search page is now the landing view.
//     const [view, setView] = useState('search');
//     // Hotel the user tapped "Book Now" on, held while they log in/register.
//     const [selectedHotel, setSelectedHotel] = useState(null);
//
//     // "Book Now" no longer books directly — it routes through login first.
//     const handleBookNow = (hotel) => {
//         setSelectedHotel(hotel);
//         setView('login');
//     };
//
//     // Voluntary login from the search page header (no hotel pending).
//     const handleLoginClick = () => {
//         setSelectedHotel(null);
//         setView('login');
//     };
//
//     // After login/guest-continue: go straight to confirming the pending hotel,
//     // or back to search if the user logged in without booking anything.
//     const handleLoginSuccess = () => {
//         if (selectedHotel) {
//             setView('confirmation');
//         } else {
//             setView('search');
//         }
//     };
//
//     const handleSearchAgain = () => {
//         setSelectedHotel(null);
//         setView('search');
//     };
//
//     const renderView = () => {
//         switch (view) {
//             case 'search':
//                 return <SearchForm onBookNow={handleBookNow} onLoginClick={handleLoginClick} />;
//             case 'login':
//                 return (
//                     <LoginForm
//                         onLoginSuccess={handleLoginSuccess}
//                         onSwitchView={setView}
//                         pendingHotelName={selectedHotel?.name}
//                     />
//                 );
//             case 'register':
//                 return (
//                     <RegisterForm
//                         onSwitchView={setView}
//                         pendingHotelName={selectedHotel?.name}
//                     />
//                 );
//             case 'confirmation':
//                 return <ConfirmationPage hotel={selectedHotel} onSearchAgain={handleSearchAgain} />;
//             default:
//                 return null;
//         }
//     };
//
//     return (
//         <div className="app">
//             <div className="container">
//                 {renderView()}
//             </div>
//         </div>
//     );
// };
//
// export default App;
// // import React, { useState } from 'react';
// // import './App.css';
// //
// // // Backend API Service
// // const API_BASE_URL = 'http://localhost:8080';
// //
// // const backend = {
// //     login: async (email, password) => {
// //         const response = await fetch(`${API_BASE_URL}/auth/login`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ email, password }),
// //         });
// //         if (!response.ok) throw new Error(await response.text() || 'Login failed.');
// //         return { message: 'Login successful' };
// //     },
// //     register: async (username, email, password, phone, age) => {
// //         const response = await fetch(`${API_BASE_URL}/auth/register`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ username, email, password, phone, age }),
// //         });
// //         if (!response.ok) throw new Error(await response.text() || 'Registration failed.');
// //         return response.json();
// //     },
// //     searchHotels: async (requestBody) => {
// //         const response = await fetch(`${API_BASE_URL}/hotels/search`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify(requestBody),
// //         });
// //         if (!response.ok) throw new Error(await response.text() || 'Search failed.');
// //         return response.json();
// //     }
// // };
// //
// // // Icon Components
// // const GoogleIcon = () => (
// //     <svg width="20" height="20" viewBox="0 0 24 24">
// //         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
// //         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
// //         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
// //         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
// //     </svg>
// // );
// //
// // const StarIcon = ({ filled }) => (
// //     <svg width="16" height="16" viewBox="0 0 20 20" fill={filled ? "#F59E0B" : "#E5E7EB"}>
// //         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.786.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"/>
// //     </svg>
// // );
// //
// // const UserIcon = () => (
// //     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
// //         <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
// //     </svg>
// // );
// //
// // const EmailIcon = () => (
// //     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
// //         <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
// //         <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
// //     </svg>
// // );
// //
// // const PhoneIcon = () => (
// //     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
// //         <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
// //     </svg>
// // );
// //
// // const LockIcon = () => (
// //     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
// //         <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
// //     </svg>
// // );
// //
// // const LocationIcon = () => (
// //     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
// //         <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
// //     </svg>
// // );
// //
// // const CalendarIcon = () => (
// //     <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
// //         <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
// //     </svg>
// // );
// //
// // // Loading Screen Component
// // const LoadingScreen = () => (
// //     <div className="loading-overlay">
// //         <div className="loading-content">
// //             <div className="spinner large"></div>
// //             <h2 className="loading-title">Searching for best accommodations…</h2>
// //             <p className="loading-subtitle">Hold tight, almost there!</p>
// //         </div>
// //     </div>
// // );
// //
// // const Header = ({ title, subtitle }) => {
// //     const [before, after] = title.split('RiziGo');
// //     return (
// //         <header className="header">
// //             <h1 className="header-title">
// //                 {before}
// //                 <span className="brand">RiziGo</span>
// //                 {after || ''}
// //             </h1>
// //             <p className="header-subtitle">{subtitle}</p>
// //         </header>
// //     );
// // };
// //
// // const Message = ({ message, type }) => (
// //     <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`}>
// //         {message}
// //     </div>
// // );
// //
// // const InputField = ({ label, icon: Icon, ...props }) => (
// //     <div className="input-group">
// //         <label className="label">{label}</label>
// //         <div className="input-wrapper">
// //             {Icon && <Icon />}
// //             <input className="input" {...props} />
// //         </div>
// //     </div>
// // );
// //
// // // ---- LOGIN FORM with "Continue as Guest" button ----
// // const LoginForm = ({ onLoginSuccess, onSwitchView }) => {
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [loading, setLoading] = useState(false);
// //     const [message, setMessage] = useState(null);
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setMessage(null);
// //         try {
// //             await backend.login(email, password);
// //             setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
// //             setTimeout(() => onLoginSuccess(), 1000);
// //         } catch (error) {
// //             setMessage({ text: error.message, type: 'error' });
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     return (
// //         <div className="form-container">
// //             <Header title="Get Started With RiziGo" subtitle="Wherever You Go Book With RiziGo!" />
// //             <form onSubmit={handleSubmit} className="form">
// //                 <InputField
// //                     label="Email"
// //                     icon={EmailIcon}
// //                     type="email"
// //                     placeholder="you@example.com"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     required
// //                 />
// //                 <InputField
// //                     label="Password"
// //                     icon={LockIcon}
// //                     type="password"
// //                     placeholder="••••••••"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     required
// //                 />
// //                 <button type="submit" disabled={loading} className="btn btn-primary">
// //                     {loading ? (
// //                         <>
// //                             <div className="spinner"></div>
// //                             Logging In...
// //                         </>
// //                     ) : (
// //                         'Log In'
// //                     )}
// //                 </button>
// //             </form>
// //
// //             <div className="separator">
// //                 <span className="separator-text">or</span>
// //             </div>
// //
// //             <button className="btn btn-google" type="button">
// //                 <GoogleIcon />
// //                 Log in with Google
// //             </button>
// //
// //             <button
// //                 className="btn btn-primary"
// //                 type="button"
// //                 style={{ width: '100%', marginTop: '18px' }}
// //                 onClick={() => onLoginSuccess()}
// //             >
// //                 Continue as Guest
// //             </button>
// //
// //             <p className="auth-switch">
// //                 Don't have an account?{' '}
// //                 <button onClick={() => onSwitchView('register')} className="link-btn">
// //                     Register here
// //                 </button>
// //             </p>
// //
// //             {message && <Message message={message.text} type={message.type} />}
// //         </div>
// //     );
// // };
// //
// // const RegisterForm = ({ onSwitchView }) => {
// //     const [username, setUsername] = useState('');
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [phone, setPhone] = useState('');
// //     const [age, setAge] = useState('');
// //     const [loading, setLoading] = useState(false);
// //     const [message, setMessage] = useState(null);
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setMessage(null);
// //         try {
// //             await backend.register(username, email, password, phone, age);
// //             setMessage({ text: 'Registration successful! Please log in.', type: 'success' });
// //         } catch (error) {
// //             setMessage({ text: error.message, type: 'error' });
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     return (
// //         <div className="form-container">
// //             <Header title="Register for RiziGo" subtitle="Create your account to get started with booking." />
// //             <form onSubmit={handleSubmit} className="form">
// //                 <InputField
// //                     label="Username"
// //                     icon={UserIcon}
// //                     type="text"
// //                     placeholder="Username"
// //                     value={username}
// //                     onChange={(e) => setUsername(e.target.value)}
// //                     required
// //                 />
// //                 <InputField
// //                     label="Email"
// //                     icon={EmailIcon}
// //                     type="email"
// //                     placeholder="you@example.com"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     required
// //                 />
// //                 <InputField
// //                     label="Password"
// //                     icon={LockIcon}
// //                     type="password"
// //                     placeholder="••••••••"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     required
// //                 />
// //                 <InputField
// //                     label="Phone Number"
// //                     icon={PhoneIcon}
// //                     type="text"
// //                     placeholder="+919876543210"
// //                     value={phone}
// //                     onChange={(e) => setPhone(e.target.value)}
// //                     required
// //                 />
// //                 <InputField
// //                     label="Age"
// //                     icon={UserIcon}
// //                     type="number"
// //                     min="18"
// //                     placeholder="18"
// //                     value={age}
// //                     onChange={(e) => setAge(e.target.value)}
// //                     required
// //                 />
// //                 <button type="submit" disabled={loading} className="btn btn-primary">
// //                     {loading ? (
// //                         <>
// //                             <div className="spinner"></div>
// //                             Registering...
// //                         </>
// //                     ) : (
// //                         'Register'
// //                     )}
// //                 </button>
// //             </form>
// //
// //             <div className="separator">
// //                 <span className="separator-text">or</span>
// //             </div>
// //
// //             <button className="btn btn-google" type="button">
// //                 <GoogleIcon />
// //                 Register with Google
// //             </button>
// //
// //             <p className="auth-switch">
// //                 Already have an account?{' '}
// //                 <button onClick={() => onSwitchView('login')} className="link-btn">
// //                     Log in here
// //                 </button>
// //             </p>
// //
// //             {message && <Message message={message.text} type={message.type} />}
// //         </div>
// //     );
// // };
// //
// // const SearchForm = ({ onBookNow }) => {
// //     const [searchParams, setSearchParams] = useState({
// //         location: '', name: '', phone: '', email: '', age: '',
// //         checkIn: new Date().toISOString().split('T')[0],
// //         checkOut: new Date().toISOString().split('T')[0],
// //         numGuests: 1, numRooms: 1, typeAccommodation: ''
// //     });
// //     const [hotels, setHotels] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [message, setMessage] = useState(null);
// //
// //     // Util function to wait N ms
// //     const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setMessage(null);
// //         setHotels([]);
// //         try {
// //             // Wait for both: the fetch AND at least 2.5s
// //             const [hotelResp] = await Promise.all([
// //                 backend.searchHotels(searchParams),
// //                 wait(2500)
// //             ]);
// //             setHotels(hotelResp.data);
// //             setMessage({ text: hotelResp.message, type: 'success' });
// //         } catch (error) {
// //             setMessage({ text: error.message, type: 'error' });
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setSearchParams(prev => ({ ...prev, [name]: value }));
// //     };
// //
// //     const renderStars = (rating) => {
// //         return Array.from({ length: 5 }, (_, i) => (
// //             <StarIcon key={i} filled={i < Math.floor(rating)} />
// //         ));
// //     };
// //
// //     return (
// //         <div className="search-container">
// //             <Header title="Find Your Perfect Stay" subtitle="Search for hotels by city or name." />
// //             <form onSubmit={handleSubmit} className="search-form">
// //                 <div className="search-grid">
// //                     <div className="grid-full">
// //                         <InputField
// //                             label="Destination"
// //                             icon={LocationIcon}
// //                             name="location"
// //                             placeholder="e.g., New Delhi"
// //                             value={searchParams.location}
// //                             onChange={handleChange}
// //                             required
// //                         />
// //                     </div>
// //                     <InputField
// //                         label="Your Name"
// //                         icon={UserIcon}
// //                         name="name"
// //                         placeholder="Your Name"
// //                         value={searchParams.name}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Your Email"
// //                         icon={EmailIcon}
// //                         name="email"
// //                         type="email"
// //                         placeholder="you@example.com"
// //                         value={searchParams.email}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Phone"
// //                         icon={PhoneIcon}
// //                         name="phone"
// //                         placeholder="+919876543210"
// //                         value={searchParams.phone}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Age"
// //                         icon={UserIcon}
// //                         name="age"
// //                         type="number"
// //                         min="18"
// //                         placeholder="18"
// //                         value={searchParams.age}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Check-in"
// //                         icon={CalendarIcon}
// //                         name="checkIn"
// //                         type="date"
// //                         value={searchParams.checkIn}
// //                         onChange={handleChange}
// //                         min={new Date().toISOString().split('T')[0]}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Check-out"
// //                         icon={CalendarIcon}
// //                         name="checkOut"
// //                         type="date"
// //                         value={searchParams.checkOut}
// //                         onChange={handleChange}
// //                         min={new Date().toISOString().split('T')[0]}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Guests"
// //                         name="numGuests"
// //                         type="number"
// //                         placeholder="1"
// //                         value={searchParams.numGuests}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Rooms"
// //                         name="numRooms"
// //                         type="number"
// //                         placeholder="1"
// //                         value={searchParams.numRooms}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                     <InputField
// //                         label="Type"
// //                         name="typeAccommodation"
// //                         placeholder="e.g., hotel"
// //                         value={searchParams.typeAccommodation}
// //                         onChange={handleChange}
// //                         required
// //                     />
// //                 </div>
// //                 <button type="submit" disabled={loading} className="btn btn-primary search-btn">
// //                     Search Hotels
// //                 </button>
// //             </form>
// //
// //             {message && <Message message={message.text} type={message.type} />}
// //
// //             {loading && <LoadingScreen />}
// //
// //             {!loading && hotels.length > 0 && (
// //                 <div className="hotels-grid">
// //                     {hotels.map((hotel) => (
// //                         <div key={hotel.id} className="hotel-card">
// //                             <div className="hotel-image">
// //                                 <img
// //                                     src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop`}
// //                                     alt={hotel.name}
// //                                 />
// //                                 <div className="hotel-badge">{hotel.source}</div>
// //                             </div>
// //                             <div className="hotel-content">
// //                                 <div className="hotel-header">
// //                                     <h3 className="hotel-name">{hotel.name}</h3>
// //                                     <div className="hotel-rating">
// //                                         {renderStars(hotel.rating)}
// //                                         <span className="rating-text">{hotel.rating && hotel.rating.toFixed(1)}</span>
// //                                     </div>
// //                                 </div>
// //                                 <p className="hotel-location">
// //                                     <LocationIcon />
// //                                     {hotel.location}
// //                                 </p>
// //                                 <div className="hotel-details">
// //                                     <span className="rooms-available">{hotel.roomsAvailable} rooms available</span>
// //                                 </div>
// //                                 <div className="hotel-footer">
// //                                     <div className="price-section">
// //                                         <span className="price">₹{hotel.price.toLocaleString()}</span>
// //                                         <span className="price-unit">per night</span>
// //                                     </div>
// //                                     <button onClick={() => onBookNow(hotel)} className="btn btn-primary book-btn">
// //                                         Book Now
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };
// //
// // const ConfirmationPage = ({ hotel, onSearchAgain }) => (
// //     <div className="confirmation-container">
// //         <div className="confirmation-content">
// //             <div className="success-icon">✓</div>
// //             <h1 className="confirmation-title">Booking Confirmed!</h1>
// //             <p className="confirmation-subtitle">Thank you for booking with us.</p>
// //             <div className="booking-details">
// //                 <p>Your booking for <strong>{hotel.name}</strong> is now confirmed.</p>
// //                 <p>We hope you enjoy your stay!</p>
// //             </div>
// //             <button onClick={onSearchAgain} className="btn btn-primary">
// //                 Search Again
// //             </button>
// //         </div>
// //     </div>
// // );
// //
// // const App = () => {
// //     const [view, setView] = useState('login');
// //     const [selectedHotel, setSelectedHotel] = useState(null);
// //
// //     const handleLoginSuccess = () => setView('search');
// //     const handleBookNow = (hotel) => {
// //         setSelectedHotel(hotel);
// //         setView('confirmation');
// //     };
// //     const handleSearchAgain = () => setView('search');
// //
// //     const renderView = () => {
// //         switch (view) {
// //             case 'login':
// //                 return <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchView={setView} />;
// //             case 'register':
// //                 return <RegisterForm onSwitchView={setView} />;
// //             case 'search':
// //                 return <SearchForm onBookNow={handleBookNow} />;
// //             case 'confirmation':
// //                 return <ConfirmationPage hotel={selectedHotel} onSearchAgain={handleSearchAgain} />;
// //             default:
// //                 return null;
// //         }
// //     };
// //
// //     return (
// //         <div className="app">
// //             <div className="container">
// //                 {renderView()}
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default App;
