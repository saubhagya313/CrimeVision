import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Phone,
  Navigation,
  Mail,
  Shield,
  Building,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { POLICE_STATIONS_DATA, searchPoliceStations } from '../services/api';

const QUICK_CITIES = ['All Cities', 'Noida', 'Delhi', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'];

const NearbyPolicePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const handleCityFilter = (city) => {
    setSelectedCity(city);
    if (city === 'All Cities') {
      setSearchQuery('');
    } else {
      setSearchQuery(city);
    }
  };

  const filteredStations = searchPoliceStations(searchQuery);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
          <MapPin className="w-3.5 h-3.5" />
          <span>Physical Reporting & Jurisdictional Assistance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Find Nearby Cyber & Local Police Stations
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Search authorized Cyber Crime Police Stations and District Commissionerate Cells across India with direct addresses, contact numbers, and navigation routes.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">
              National Cyber Crime Reporting Helpline: <span className="text-rose-400 font-mono text-sm font-bold">1930</span> (24x7 Toll-Free)
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Call immediately for urgent financial fraud transaction stop-requests before visiting the physical police station.
            </p>
          </div>
        </div>
        <a
          href="tel:1930"
          className="px-4 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider hover:bg-rose-400 transition-colors shadow-lg flex-shrink-0 text-center"
        >
          Dial 1930
        </a>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by City, State, Pincode (e.g. Noida, Bengaluru, 201301, Mumbai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Quick City Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider mr-1 flex-shrink-0">
            Quick Cities:
          </span>
          {QUICK_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleCityFilter(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCity === city
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-glow'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Police Station Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Found {filteredStations.length} Police Stations</span>
          <span className="font-mono">Showing verified jurisdictional police stations</span>
        </div>

        {filteredStations.length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center space-y-3">
            <Building className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No police stations found for "{searchQuery}"</p>
            <p className="text-xs text-slate-400">
              Try searching with a different city name, state, or dial 1930 for nationwide reporting.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All Cities');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {station.city}, {station.state}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 font-bold">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {station.distance}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 leading-snug">
                    {station.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="text-slate-400 leading-relaxed">
                      {station.address} - <span className="font-mono text-slate-300">{station.pincode}</span>
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{station.contact}</span>
                      </div>
                      {station.email && (
                        <div className="flex items-center gap-1.5 text-slate-400 truncate">
                          <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate">{station.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${station.contact.split('/')[0].trim()}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call</span>
                  </a>

                  <a
                    href={station.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyPolicePage;
