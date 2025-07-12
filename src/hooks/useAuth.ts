import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, AuthFormData, User } from '../types/auth';
import { sendVerificationEmail, generateVerificationToken } from '../services/emailService';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
    user: null,
    emailVerificationSent: false,
    showEmailForm: false,
    showAccountSetup: false,
    setupSuccess: false,
    verificationToken: null,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    };

    // Check for verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (token && email) {
      setState(prev => ({
        ...prev,
        showAccountSetup: true,
        verificationToken: token,
      }));
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      checkSession();
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({ ...prev, user: null }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        user: data,
        error: null,
      }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load user profile',
      }));
    }
  };

  const createAdminUser = async () => {
    try {
      // Check if admin already exists
      const { data: existingAdmin } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', 'orcalesseeingbeyondthebug@gmail.com')
        .single();

      if (existingAdmin) {
        console.log('Admin user already exists');
        await createTestUsers();
        return;
      }

      // Create admin auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'orcalesseeingbeyondthebug@gmail.com',
        password: '8sHNk%U(*t1|7Y$*',
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create admin profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: 'orcalesseeingbeyondthebug@gmail.com',
            username: 'admin',
            country: 'US',
            state: 'California',
            is_admin: true,
          });

        if (profileError) throw profileError;
        console.log('Admin user created successfully');
        
        // Create test users after admin is created
        await createTestUsers();
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  };

  const createTestUsers = async () => {
    try {
      const testUsers = [
        {
          email: '220130141052@gecg28.ac.in',
          password: 'TechStud3nt@2024!',
          username: 'student_220130141052',
          country: 'IN',
          state: 'Gujarat'
        },
        {
          email: 'vyomeeb@gmail.com',
          password: 'SecurePass#789',
          username: 'vyomee_b',
          country: 'IN',
          state: 'Gujarat'
        }
      ];

      for (const user of testUsers) {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          console.log(`Test user ${user.email} already exists`);
          continue;
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
        });

        if (authError) {
          console.error(`Error creating auth user for ${user.email}:`, authError);
          continue;
        }

        if (authData.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              email: user.email,
              username: user.username,
              country: user.country,
              state: user.state,
              is_admin: false,
            });

          if (profileError) {
            console.error(`Error creating profile for ${user.email}:`, profileError);
          } else {
            console.log(`Test user ${user.email} created successfully`);
          }
        }
      }
    } catch (error) {
      console.error('Error creating test users:', error);
    }
  };

  const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  };

  const sendEmailVerification = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      const verificationToken = generateVerificationToken();
      const baseUrl = window.location.origin;

      const emailSent = await sendVerificationEmail({
        email,
        verificationToken,
        baseUrl,
      });

      if (!emailSent) {
        throw new Error('Failed to send verification email');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        emailVerificationSent: true,
        verificationToken,
      }));

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to send verification email',
      }));
    }
  };

  const completeAccountSetup = async (formData: AuthFormData & { email: string }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        let profilePicturePath = null;

        // Upload profile picture if provided
        if (formData.profilePicture) {
          profilePicturePath = await uploadProfilePicture(formData.profilePicture, authData.user.id);
        }

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            username: formData.username!,
            country: formData.country!,
            state: formData.state!,
            profile_picture_path: profilePicturePath,
            is_admin: false,
          });

        if (profileError) throw profileError;

        setState(prev => ({
          ...prev,
          isLoading: false,
          setupSuccess: true,
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create account',
      }));
    }
  };

  const signIn = async (formData: AuthFormData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to sign in',
      }));
    }
  };

  const showSignUpForm = () => {
    setState(prev => ({
      ...prev,
      showEmailForm: true,
      error: null,
      emailVerificationSent: false,
    }));
  };

  const backToLogin = () => {
    setState(prev => ({
      ...prev,
      showEmailForm: false,
      showAccountSetup: false,
      emailVerificationSent: false,
      setupSuccess: false,
      error: null,
      verificationToken: null,
    }));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Initialize admin user on first load
  useEffect(() => {
    createAdminUser();
  }, []);

  return {
    ...state,
    signIn,
    sendEmailVerification,
    completeAccountSetup,
    showSignUpForm,
    backToLogin,
    signOut,
  };
};
