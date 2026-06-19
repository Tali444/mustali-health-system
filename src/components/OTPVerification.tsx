import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, Send, Check, AlertCircle, Loader2 } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  phoneNumber?: string;
  telegramHandle?: string;
  onVerificationMethod: (method: 'email' | 'sms' | 'telegram') => void;
  onOTPSubmit: (otp: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

export default function OTPVerification({
  email,
  phoneNumber,
  telegramHandle,
  onVerificationMethod,
  onOTPSubmit,
  onCancel,
  isLoading = false,
  errorMessage
}: OTPVerificationProps) {
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'sms' | 'telegram' | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationSent, setVerificationSent] = useState(false);
  const [localError, setLocalError] = useState('');

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleMethodSelection = (method: 'email' | 'sms' | 'telegram') => {
    setSelectedMethod(method);
    setVerificationSent(true);
    setResendCountdown(60);
    setOtpCode('');
    setLocalError('');
    onVerificationMethod(method);
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setLocalError('OTP must be 6 digits');
      return;
    }
    onOTPSubmit(otpCode);
  };

  const handleResendOTP = () => {
    if (selectedMethod) {
      setResendCountdown(60);
      setOtpCode('');
      setLocalError('');
      onVerificationMethod(selectedMethod);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Send className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Verify Your Account</h2>
          <p className="text-blue-100 text-sm mt-1">One-Time Password verification required</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Error message */}
          {(errorMessage || localError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-red-700 font-medium">{errorMessage || localError}</span>
            </div>
          )}

          {/* Method selection - only show if not yet selected */}
          {!verificationSent ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Choose OTP delivery method
              </h3>

              {/* Email option */}
              <button
                onClick={() => handleMethodSelection('email')}
                className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-slate-900">Send to Email</p>
                  <p className="text-xs text-slate-500 mt-0.5">{email}</p>
                </div>
              </button>

              {/* SMS option - only show if phone provided */}
              {phoneNumber && (
                <button
                  onClick={() => handleMethodSelection('sms')}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-slate-900">Send via SMS</p>
                    <p className="text-xs text-slate-500 mt-0.5">{phoneNumber}</p>
                  </div>
                </button>
              )}

              {/* Telegram option - only show if handle provided */}
              {telegramHandle && (
                <button
                  onClick={() => handleMethodSelection('telegram')}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                    <Send className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-slate-900">Send via Telegram</p>
                    <p className="text-xs text-slate-500 mt-0.5">{telegramHandle}</p>
                  </div>
                </button>
              )}
            </div>
          ) : (
            /* OTP input form */
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Enter the 6-digit code sent to your {selectedMethod}
                </p>

                {/* OTP Input Fields */}
                <div className="flex gap-2 justify-center mb-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpCode[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value) {
                          const newOtp = otpCode.split('');
                          newOtp[index] = value;
                          setOtpCode(newOtp.join(''));
                          // Auto-focus next input
                          if (index < 5) {
                            const nextInput = document.getElementById(`otp-${index + 1}`);
                            if (nextInput) nextInput.focus();
                          }
                        }
                      }}
                      id={`otp-${index}`}
                      className="w-12 h-12 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendCountdown > 0 ? (
                    <p className="text-xs text-slate-500">
                      Resend OTP in <span className="font-bold text-slate-700">{resendCountdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Verify OTP
                    </>
                  )}
                </button>
              </div>

              {/* Change method button */}
              <button
                type="button"
                onClick={() => setVerificationSent(false)}
                disabled={isLoading}
                className="w-full text-xs text-slate-500 hover:text-slate-700 font-medium py-2 disabled:opacity-50"
              >
                Change delivery method
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Your account will be activated after OTP verification
          </p>
        </div>
      </div>
    </div>
  );
}
