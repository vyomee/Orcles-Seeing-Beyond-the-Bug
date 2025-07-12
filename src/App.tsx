import React from 'react';
import LoginForm from './components/LoginForm';
import EmailVerificationForm from './components/EmailVerificationForm';
import AccountSetupForm from './components/AccountSetupForm';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const {
    isLoading,
    error,
    user,
    emailVerificationSent,
    showEmailForm,
    showAccountSetup,
    setupSuccess,
    verificationToken,
    signIn,
    sendEmailVerification,
    completeAccountSetup,
    showSignUpForm,
    backToLogin,
    signOut,
  } = useAuth();

  // Show dashboard if user is logged in
  if (user) {
    return user.is_admin ? (
      <AdminDashboard user={user} onSignOut={signOut} />
    ) : (
      <Dashboard user={user} onSignOut={signOut} />
    );
  }

  // Show account setup form if verification token is present
  if (showAccountSetup && verificationToken) {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || '';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AccountSetupForm
            email={email}
            onSubmit={(data) => completeAccountSetup({ ...data, email })}
            isLoading={isLoading}
            error={error}
            success={setupSuccess}
          />
        </div>
      </div>
    );
  }

  // Show email verification form for signup
  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <EmailVerificationForm
            onSubmit={sendEmailVerification}
            onBack={backToLogin}
            isLoading={isLoading}
            error={error}
            emailSent={emailVerificationSent}
            email=""
          />
        </div>
      </div>
    );
  }

  // Show login form by default
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm
          isLoading={isLoading}
          error={error}
          onSignIn={signIn}
          onShowSignUp={showSignUpForm}
        />
      </div>
    </div>
  );
}

export default App;
