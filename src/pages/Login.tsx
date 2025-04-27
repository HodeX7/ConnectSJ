import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { auth } from '../firebase';

interface LoginProps { onLogin: () => void; }

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [calstateId, setCalstateId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!calstateId || !password) { setError('Please enter both CalState ID and password.'); return; }
    setIsLoading(true);
    try {
      const email = calstateId.includes('@') ? calstateId : `${calstateId}@yourdomain.edu`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in user:', userCredential.user);
      onLogin();
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') setError('No account found with that CalState ID. Please sign up first.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
      else setError(err.message);
    } finally { setIsLoading(false); }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100 p-4">
      <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-primary-700 mb-2">{t('app.name')}</h1>
          <p className="text-neutral-600">{t('dashboard.welcome')}</p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="mb-4">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">{t('auth.login')}</h2>
              {error && <div className="mb-4 p-3 bg-error-50 text-error-600 rounded-lg text-sm">{error}</div>}
              <Input label={t('auth.calstateId')} id="calstateId" type="text" value={calstateId} onChange={e => setCalstateId(e.target.value)} icon={<User size={18}/>} placeholder="CS12345678" autoComplete="username" />
              <Input label={t('auth.password')} id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} icon={<Lock size={18}/>} autoComplete="current-password" />
              <div className="mb-6 text-right"><Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">{t('auth.forgotPassword')}</Link></div>
              <Button type="submit" fullWidth disabled={isLoading}>{isLoading ? t('common.loading') : t('auth.login')}</Button>
            </form>
          </Card>
        </motion.div>
        <motion.div className="text-center mt-4" variants={itemVariants}><p className="text-neutral-600">{t('auth.noAccount')} <Link to="/signup" className="text-primary-600 font-medium hover:text-primary-700">{t('auth.signupHere')}</Link></p></motion.div>
      </motion.div>
    </div>
  );
};

 export default Login;

//TEST
// Un comment it to Test

// import { useEffect } from 'react';
// import {
//   addTestJob,
//   addTestResource,
//   addTestActivity,
//   addTestCompletedActivity,
//   addTestRegisterActivity,
//   addTestReward,
//   addTestRedemptionHistory,
//   getJobs,
//   getResources,
//   getActivities,
//   getCompletedActivities,
//   getRewards,
//   getRedemptionHistory,
// } from '../services/api';

// export default function FirestoreTest() {
//   useEffect(() => {
//     const run = async () => {
//       const job = await addTestJob();
//       console.log('✅ Test Job Added:', job);

//       const resource = await addTestResource();
//       console.log('✅ Test Resource Added:', resource);

//       const activity = await addTestActivity();
//       console.log('✅ Test Activity Added:', activity);

//       const completedActivity = await addTestCompletedActivity();
//       console.log('✅ Test Completed Activity Added:', completedActivity);

//       const registeredActivity = await addTestRegisterActivity();
//       console.log('✅ Test Registered Activity Added:', registeredActivity);

//       const reward = await addTestReward();
//       console.log('✅ Test Reward Added:', reward);

//       const redemption = await addTestRedemptionHistory();
//       console.log('✅ Test Redemption History Added:', redemption);

//       // Fetching data back to confirm
//       const jobs = await getJobs();
//       console.log('📦 All Jobs:', jobs);

//       const resources = await getResources();
//       console.log('📦 All Resources:', resources);

//       const activities = await getActivities();
//       console.log('📦 All Activities:', activities);

//       const completed = await getCompletedActivities();
//       console.log('📦 Completed Activities:', completed);

//       const rewards = await getRewards();
//       console.log('📦 All Rewards:', rewards);

//       const redemptions = await getRedemptionHistory();
//       console.log('📦 Redemption History:', redemptions);
//     };

//     run();
//   }, []);

//   return <div>🚀 Check your browser console for Firestore test output!</div>;
// }


