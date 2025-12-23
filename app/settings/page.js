'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Settings, 
  Shield, 
  Mail, 
  Phone, 
  Lock, 
  AlertTriangle,
  ShieldCheck,
  Key,
  Bell,
  Sun,
  Moon,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/api-config';

// Animated gradient background component
const AnimatedGradient = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-20"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: `hsl(${Math.random() * 360}, 80%, 60%)`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
  </div>
);

// Animated card component
const AnimatedCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={cn("relative group", className)}
  >
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-200" />
    <div className="relative bg-white dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm group-hover:shadow-lg transition-all duration-300 overflow-hidden">
      {children}
    </div>
  </motion.div>
);

// Animated tab content
const AnimatedTabContent = ({ value, children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={value}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const SettingsSection = ({ title, description, children, className }) => (
  <div className={cn("space-y-6", className)}>
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingItem = ({ 
  title, 
  description, 
  children, 
  className,
  last = false 
}) => (
  <div className={cn(
    "flex flex-col sm:flex-row sm:items-start sm:justify-between py-4 space-y-3 sm:space-y-0",
    !last && "border-b border-gray-100 dark:border-gray-800",
    className
  )}>
    <div className="space-y-1 pr-0 sm:pr-4">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
    <div className="flex-shrink-0 sm:ml-auto">
      {children}
    </div>
  </div>
);

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    darkMode: false,
    language: 'en',
    promoEmails: true,
    twoFactorAuth: false,
    marketingPreferences: {
      email: true,
      sms: true,
      push: true
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
      dataSharing: false
    }
  });

  // Animation hooks - must be called unconditionally at the top level
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.02]);
  const y = useTransform(scrollYProgress, [0, 0.1], [0, 50]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      // Load saved settings from API or local storage
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [status, router]);

  const handleToggle = (setting, nestedPath = null) => {
    let newSettings;
    if (nestedPath) {
      const [parent, child] = nestedPath.split('.');
      newSettings = {
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: !settings[parent][child]
        }
      };
    } else {
      newSettings = { ...settings, [setting]: !settings[setting] };
    }
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const newSettings = { ...settings, [name]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const saveSettings = async (newSettings) => {
    try {
      // Save to local storage for immediate feedback
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      
      // Sync with server if needed
      if (status === 'authenticated') {
        await fetch(API_ENDPOINTS.userSettings, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: newSettings }),
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <AnimatedGradient />
      <div className="relative container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
              Account Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
              Customize your experience and manage your account preferences with our intuitive settings panel
            </p>
          </div>
          
          <Tabs defaultValue="account" className="space-y-6 sm:space-y-8">
            <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-1.5 rounded-xl shadow-sm overflow-x-auto flex sm:grid sm:grid-cols-4 sm:overflow-x-visible">
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center whitespace-nowrap text-sm sm:text-base"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Account</span>
                <span className="sm:hidden">Acct</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center whitespace-nowrap text-sm sm:text-base"
              >
                <Bell className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center whitespace-nowrap text-sm sm:text-base"
              >
                <Sun className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Appearance</span>
                <span className="sm:hidden">Theme</span>
              </TabsTrigger>
              <TabsTrigger 
                value="privacy"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center whitespace-nowrap text-sm sm:text-base"
              >
                <Shield className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Privacy</span>
                <span className="sm:hidden">Secure</span>
              </TabsTrigger>
            </TabsList>
          
          <TabsContent value="account" className="pt-4 sm:pt-6">
            <AnimatedTabContent value="account">
              <Card className="border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Account Information</CardTitle>
                      <CardDescription>Manage your personal details and contact information</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <div className="relative">
                        <Input 
                          id="email" 
                          type="email" 
                          value={session.user.email || ''} 
                          disabled 
                          className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-sm"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contact support to change your email</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <Input 
                          id="name" 
                          value={session.user.name || ''} 
                          disabled 
                          className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-sm"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={session.user.phone || ''} 
                          disabled 
                          className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-sm"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="member-since" className="text-sm font-medium">Member Since</Label>
                      <div className="relative">
                        <Input 
                          id="member-since" 
                          value={new Date(session.user.createdAt || new Date()).toLocaleDateString()} 
                          disabled 
                          className="pl-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 text-sm"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button 
                      onClick={() => router.push('/profile')}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-blue-500/30 transition-all duration-300 w-full sm:w-auto"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Profile</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/my-bookings')}
                      className="border-blue-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 w-full sm:w-auto"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">View Bookings</span>
                      <span className="sm:hidden">Bookings</span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
              
              <Card className="mt-8 border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Account Security</CardTitle>
                      <CardDescription>Manage your password and security settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Security Recommendation</h3>
                          <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                            <p>For your security, we recommend enabling two-factor authentication and changing your password regularly.</p>
                          </div>
                          <div className="mt-4">
                            <div className="-mx-2 -my-1.5 flex">
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-md text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-50 focus:ring-amber-600 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-900/40 dark:focus:ring-offset-amber-900/20"
                              >
                                View security tips
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">2FA Status</p>
                              <p className="text-xs text-green-600 dark:text-green-400">Active</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs sm:text-sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Password</Label>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Last Changed</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">2 months ago</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs sm:text-sm"
                            onClick={() => router.push('/auth/change-password')}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedTabContent>
          </TabsContent>
          
          <TabsContent value="notifications" className="pt-4 sm:pt-6">
            <AnimatedTabContent value="notifications">
              <Card className="border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Notification Preferences</CardTitle>
                      <CardDescription>Choose how you receive notifications</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-6">
                <SettingItem
                  title="Email Notifications"
                  description="Receive email notifications about your bookings and promotions"
                >
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle('emailNotifications')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </SettingItem>
                
                <SettingItem
                  title="SMS Notifications"
                  description="Receive text message notifications about your bookings"
                >
                  <Switch
                    id="sms-notifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={() => handleToggle('smsNotifications')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </SettingItem>
                
                <SettingItem
                  title="Promotional Emails"
                  description="Receive emails about special offers and promotions"
                  last
                >
                  <Switch
                    id="promo-emails"
                    checked={settings.promoEmails}
                    onCheckedChange={() => handleToggle('promoEmails')}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </SettingItem>
              </div>
            </CardContent>
          </Card>
        </AnimatedTabContent>
      </TabsContent>
          
          <TabsContent value="appearance" className="pt-4 sm:pt-6">
            <AnimatedTabContent value="appearance">
              <Card className="border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Appearance</CardTitle>
                      <CardDescription>Customize how the app looks and feels</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-6">
                    <SettingItem
                      title="Dark Mode"
                      description="Switch between light and dark theme"
                    >
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-gray-400" />
                        <Switch
                          id="dark-mode"
                          checked={settings.darkMode}
                          onCheckedChange={() => handleToggle('darkMode')}
                          className="data-[state=checked]:bg-amber-600"
                        />
                        <Moon className="w-4 h-4 text-gray-400" />
                      </div>
                    </SettingItem>
                    
                    <SettingItem
                      title="Language"
                      description="Select your preferred language"
                      last
                    >
                      <select
                        id="language"
                        name="language"
                        value={settings.language}
                        onChange={handleSelectChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </SettingItem>
                  </div>
                </CardContent>
              </Card>
            </AnimatedTabContent>
          </TabsContent>
          
          <TabsContent value="privacy" className="pt-4 sm:pt-6">
            <AnimatedTabContent value="privacy">
              <Card className="border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Privacy & Security</CardTitle>
                      <CardDescription>Manage your data and privacy settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6 sm:space-y-8">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Your privacy matters</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <p>We take your privacy seriously. Your data is encrypted and securely stored in accordance with our privacy policy.</p>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => window.open('/privacy', '_blank')}
                            className="inline-flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200"
                          >
                            View Privacy Policy
                            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Danger Zone</h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.')) {
                                toast.error('Account deletion is not implemented yet');
                              }
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete My Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              </Card>
            </AnimatedTabContent>
          </TabsContent>
        </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
