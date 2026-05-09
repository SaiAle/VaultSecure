import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Smartphone } from 'lucide-react';
import { setupTotp, verifyTotp } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const { username, totpEnabled } = useAuthStore();
  const [qrUri, setQrUri] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const startTotpSetup = async () => {
    try {
      const data = await setupTotp();
      setQrUri(data.qrUri);
      setSecret(data.secret);
    } catch { setError('Failed to start 2FA setup'); }
  };

  const confirmTotp = async () => {
    try {
      await verifyTotp(code);
      setSuccess('2FA enabled successfully!');
      setQrUri('');
    } catch { setError('Invalid code. Try again.'); }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="text-vault-500 w-5 h-5" />
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-blue-400 w-5 h-5" />
          <h2 className="text-white font-semibold">Account</h2>
        </div>
        <div className="text-sm text-gray-400">
          Signed in as <span className="text-white font-medium">{username}</span>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="text-vault-400 w-5 h-5" />
          <h2 className="text-white font-semibold">Two-Factor Authentication</h2>
          {totpEnabled && (
            <span className="text-xs bg-vault-900 text-vault-400 px-2 py-0.5 rounded-full">Enabled</span>
          )}
        </div>

        {!totpEnabled && !qrUri && (
          <button onClick={startTotpSetup}
            className="bg-vault-600 hover:bg-vault-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
            Set up 2FA
          </button>
        )}

        {qrUri && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Scan this QR code with your authenticator app:</p>
            <img src={qrUri} alt="TOTP QR Code" className="w-48 h-48 rounded-lg" />
            <p className="text-gray-500 text-xs font-mono break-all">Manual key: {secret}</p>
            <div className="flex gap-3">
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code"
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:border-vault-500 font-mono" />
              <button onClick={confirmTotp}
                className="bg-vault-600 hover:bg-vault-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Verify
              </button>
            </div>
          </div>
        )}

        {success && <p className="text-vault-400 text-sm mt-3">{success}</p>}
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}
