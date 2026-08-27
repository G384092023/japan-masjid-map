import React, { useState } from 'react';
import {
  X,
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  User,
  CircleDollarSign,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function MasjidModal({ masjid, onClose }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!masjid) return null;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: masjid.name,
      text: `Find prayer spaces and details for ${masjid.name} in ${masjid.prefecture}, Japan.`,
      url: masjid.google_maps_url || window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        copyToClipboard(masjid.google_maps_url, 'share');
      }
    } else {
      copyToClipboard(masjid.google_maps_url, 'share');
    }
  };

  // Clean WhatsApp number if exists (strip +, -, spaces)
  const cleanWaNumber = masjid.contact_whatsapp
    ? masjid.contact_whatsapp.replace(/[^0-9]/g, '')
    : masjid.contact_phone
    ? masjid.contact_phone.replace(/[^0-9]/g, '')
    : '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="type-pill masjid" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {masjid.type || 'Masjid'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {masjid.prefecture} Prefecture ({masjid.prefecture_jp})
              </span>
            </div>
            <h3>{masjid.name}</h3>
            {masjid.name_jp && (
              <div className="jp-text" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                {masjid.name_jp}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn-icon" onClick={handleShare} title="Share location">
              <Share2 size={16} />
            </button>
            <button className="btn-icon" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Prominent Google Maps Direct Navigation Banner */}
        <div className="modal-section">
          <a
            href={masjid.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              justifyContent: 'center',
              padding: '0.9rem 1.5rem',
              fontSize: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Navigation size={20} />
            <span>Open in Google Maps / Get Directions</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Address with 1-click Copy */}
        {masjid.address && (
          <div className="modal-section">
            <div className="section-label">
              <MapPin size={14} />
              <span>Location Address</span>
            </div>
            <div className="copyable-box">
              <span>{masjid.address}</span>
              <button
                className="btn-copy"
                onClick={() => copyToClipboard(masjid.address, 'address')}
                title="Copy address to clipboard"
              >
                {copiedField === 'address' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copiedField === 'address' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Contact Person & Communication Section */}
        <div className="modal-section">
          <div className="section-label">
            <User size={14} />
            <span>Contact Person & Community Channel</span>
          </div>

          <div className="contact-person-box">
            {masjid.contact_person ? (
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {masjid.contact_person}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Masjid Administration / Committee Office
              </div>
            )}

            <div className="contact-action-buttons">
              {masjid.contact_phone && (
                <a
                  href={`tel:${masjid.contact_phone}`}
                  className="btn-contact-action btn-phone"
                  title="Call phone number"
                >
                  <Phone size={15} />
                  <span>Call: {masjid.contact_phone}</span>
                </a>
              )}

              {cleanWaNumber && (
                <a
                  href={`https://wa.me/${cleanWaNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-contact-action btn-whatsapp"
                  title="Open WhatsApp Chat"
                >
                  <MessageSquare size={15} />
                  <span>WhatsApp Chat</span>
                </a>
              )}

              {masjid.contact_email && (
                <a
                  href={`mailto:${masjid.contact_email}`}
                  className="btn-contact-action btn-email"
                  title="Send Email"
                >
                  <Mail size={15} />
                  <span>Email: {masjid.contact_email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Donation & Support Info Section */}
        {masjid.donation_info && (
          <div className="modal-section">
            <div className="section-label">
              <CircleDollarSign size={14} style={{ color: 'var(--accent-amber)' }} />
              <span>Donation & Community Support Info</span>
            </div>

            <div className="donation-info-box">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {masjid.donation_info}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    copyToClipboard(masjid.donation_info, 'donation');
                    triggerConfetti();
                  }}
                >
                  {copiedField === 'donation' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedField === 'donation' ? 'Donation Info Copied!' : 'Copy Bank Details'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Notes & Jummah/Amenity Info */}
        {masjid.notes && (
          <div className="modal-section">
            <div className="section-label">
              <Info size={14} />
              <span>General Information & Notes</span>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {masjid.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
