import React, { useState } from 'react';
import {
  X,
  Database,
  Link,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';
import { fetchAndParseCsv, parseMasjidCsv } from '../services/csvParser';
import { storageService } from '../services/storageService';

export function DataSyncModal({
  isOpen,
  onClose,
  onDataUpdated,
  currentSourceType
}) {
  const [activeTab, setActiveTab] = useState('sheet'); // 'sheet' | 'upload' | 'template'
  const [sheetUrl, setSheetUrl] = useState(() => storageService.getCustomSheetUrl());
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success'|'error', message: string }
  const [showInstructions, setShowInstructions] = useState(false);

  if (!isOpen) return null;

  const handleSyncGoogleSheet = async (e) => {
    e.preventDefault();
    if (!sheetUrl.trim()) {
      setSyncStatus({ type: 'error', message: 'Please enter a valid Google Sheets URL.' });
      return;
    }

    setIsLoading(true);
    setSyncStatus(null);

    try {
      const { masjids } = await fetchAndParseCsv(sheetUrl.trim());
      if (masjids.length === 0) {
        throw new Error('No valid masjid records were found in the provided spreadsheet.');
      }

      storageService.setCustomSheetUrl(sheetUrl.trim());
      storageService.setCachedMasjids(masjids, 'google_sheet');
      onDataUpdated(masjids, 'google_sheet');
      setSyncStatus({
        type: 'success',
        message: `Successfully synced ${masjids.length} locations from Google Sheets!`
      });
    } catch (err) {
      setSyncStatus({
        type: 'error',
        message: `Failed to load Google Sheet: ${err.message}. Please make sure the sheet is published or shared publicly.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setSyncStatus(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result;
          if (typeof content !== 'string') throw new Error('Could not read file text.');
          const { masjids } = await parseMasjidCsv(content);

          if (masjids.length === 0) {
            throw new Error('No valid masjid records found in this CSV.');
          }

          storageService.setCachedMasjids(masjids, 'custom_csv');
          onDataUpdated(masjids, 'custom_csv');
          setSyncStatus({
            type: 'success',
            message: `Successfully loaded ${masjids.length} locations from uploaded CSV!`
          });
        } catch (err) {
          setSyncStatus({ type: 'error', message: err.message });
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setSyncStatus({ type: 'error', message: err.message });
      setIsLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    setIsLoading(true);
    try {
      storageService.clearCustomSource();
      const { masjids } = await fetchAndParseCsv('./data/japan_masjids_starter.csv');
      onDataUpdated(masjids, 'default');
      setSheetUrl('');
      setSyncStatus({
        type: 'success',
        message: 'Successfully reset to default verified Japan Masjids dataset.'
      });
    } catch (err) {
      setSyncStatus({ type: 'error', message: `Reset failed: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="stat-icon-wrap" style={{ width: '38px', height: '38px' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Data & Google Sheets Sync</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Live Google Sheets sync, direct CSV upload, and spreadsheet template
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="filter-pills-row" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
          <button
            className={`filter-pill ${activeTab === 'sheet' ? 'active' : ''}`}
            onClick={() => setActiveTab('sheet')}
          >
            <FileSpreadsheet size={14} style={{ display: 'inline', marginRight: '5px' }} />
            Google Sheets (Live)
          </button>
          <button
            className={`filter-pill ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={14} style={{ display: 'inline', marginRight: '5px' }} />
            Upload CSV
          </button>
          <button
            className={`filter-pill ${activeTab === 'template' ? 'active' : ''}`}
            onClick={() => setActiveTab('template')}
          >
            <HelpCircle size={14} style={{ display: 'inline', marginRight: '5px' }} />
            Columns & Template
          </button>
        </div>

        {/* Status Message */}
        {syncStatus && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.85rem',
              background: syncStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${syncStatus.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: syncStatus.type === 'success' ? '#34d399' : '#f87171'
            }}
          >
            {syncStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{syncStatus.message}</span>
          </div>
        )}

        {/* Tab 1: Google Sheets Live Sync */}
        {activeTab === 'sheet' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleSyncGoogleSheet} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="modal-section">
                <label className="section-label" htmlFor="sheet-url-input">
                  <Link size={14} />
                  <span>Google Sheets Web URL or Published CSV Link</span>
                </label>
                <input
                  id="sheet-url-input"
                  type="text"
                  className="search-input-field"
                  style={{ borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}
                  placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv or Google Sheet link"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {isLoading ? 'Connecting & Parsing...' : 'Sync with Google Sheet'}
                </button>

                {currentSourceType !== 'default' && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleResetToDefault}
                    disabled={isLoading}
                  >
                    <RotateCcw size={15} />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>
            </form>

            {/* Step-by-step Guide */}
            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', fontSize: '0.825rem' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setShowInstructions(!showInstructions)}
              >
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  How to link your Google Sheet (3 simple steps)
                </span>
                <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
                  {showInstructions ? 'Hide' : 'Show Guide'}
                </span>
              </div>

              {showInstructions && (
                <ol style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <li>In your Google Sheet, click <strong>File &gt; Share &gt; Publish to web</strong>.</li>
                  <li>Under <em>Link</em>, select <strong>Entire Document</strong> (or Sheet tab) and choose <strong>Comma-separated values (.csv)</strong>.</li>
                  <li>Click <strong>Publish</strong>, copy the generated URL, and paste it into the box above!</li>
                </ol>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Custom CSV Upload */}
        {activeTab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-400)' }}>
              <Upload size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Upload Custom CSV File</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px' }}>
                Load a local <code>.csv</code> file exported from Excel or Google Sheets directly in your browser.
              </p>
            </div>

            <label className="btn-primary" style={{ cursor: 'pointer', padding: '0.75rem 1.5rem' }}>
              <Upload size={16} />
              <span>Select CSV File</span>
              <input
                type="file"
                accept=".csv,text/csv"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}

        {/* Tab 3: Columns & Template */}
        {activeTab === 'template' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              The CSV parser automatically recognizes flexible header names. Here are the recommended column headers:
            </p>
            <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.775rem', overflowX: 'auto', border: '1px solid var(--border-glass)', whiteSpace: 'pre' }}>
              id, prefecture, prefecture_jp, region, name, name_jp, type, address, google_maps_url, lat, lng, contact_person, contact_phone, contact_whatsapp, contact_email, donation_info, notes
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <a
                href="./data/japan_masjids_starter.csv"
                download="japan_masjids_template.csv"
                className="btn-primary"
              >
                <Download size={16} />
                <span>Download Sample CSV Template</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
