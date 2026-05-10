import { useState } from 'react';
import { User, Mail, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, Button, Input } from '../components/ui';
import { usersApi, authApi } from '../api';
import useAuthStore from '../store/authStore';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState(user?.language_pref || 'en');
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    setNameError('');
    setSaving(true);
    try {
      const res = await usersApi.updateProfile({ name, language_pref: language });
      updateUser(res.data);
      await authApi.getMe().then(r => updateUser(r.data));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) setNameError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-text-primary">Profile Settings</h1>

      <Card>
        <CardBody className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{user?.name}</h2>
              <p className="text-text-secondary">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={handleNameChange}
              error={nameError}
            />

            <Input
              label="Email"
              type="email"
              value={user?.email}
              disabled
              helperText="Email cannot be changed"
            />

            <div className="relative">
              <Globe className="absolute left-4 top-[46px] w-5 h-5 text-text-secondary pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
              <label className="absolute -top-2 left-3 text-xs bg-surface px-1 text-text-secondary">Language</label>
            </div>
          </div>

          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-lg font-display font-bold text-text-primary mb-4">Account Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">User ID</span>
              <span className="text-text-primary font-mono">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Account created</span>
              <span className="text-text-primary">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
