import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate(from, { replace: true });
        toast.success('Successfully signed in!');
      }
      if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully');
      }
      if (event === 'USER_UPDATED') {
        toast.success('Account updated successfully');
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast.info('Password recovery email sent');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Store POS</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={`${window.location.origin}/reset-password`}
        />
      </Card>
    </div>
  );
};