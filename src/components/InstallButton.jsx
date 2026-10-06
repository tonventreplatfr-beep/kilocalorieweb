import React, { useState, useEffect } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Bloque l'affichage natif spontané de Chrome
      e.preventDefault();
      // Mémorise l'événement pour le déclencher au clic
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cache le bouton dès que l'installation est terminée
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Déclenche la fenêtre de confirmation native d'Android
    deferredPrompt.prompt();

    // Récupère le choix de l'utilisateur (accepté ou refusé)
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  // Le bouton reste invisible tant qu'Android ne valide pas l'éligibilité PWA
  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#FF8C00',
        color: '#000000',
        fontWeight: '900',
        fontSize: '13px',
        padding: '10px 18px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(255, 140, 0, 0.35)',
        letterSpacing: '0.5px'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <span>INSTALLER SUR ANDROID</span>
    </button>
  );
}