import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import type { User } from '../../types';

/**
 * UserManagement — polished, accessible, debounced search, validation, safe delete.
 * Visual theming kept consistent with site (cream bg / white cards) — only UX + small styling changed.
 *
 * Important: This preserves all original behaviour (create/edit/delete/filter).
 */

const ROLE_BADGES: Record<string, string> = {
  admin: 'bg-violet-100 text-violet-800',
  injector: 'bg-sky-100 text-sky-800',
  scientist: 'bg-slate-100 text-slate-800',
};

const STATUS_BADGES: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-rose-100 text-rose-800',
};

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // refs for focus management
  const createButtonRef = useRef<HTMLButtonElement | null>(null);
  const editTriggerRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // debounce searchTerm -> debouncedSearch
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearch) ||
      user.email.toLowerCase().includes(debouncedSearch) ||
      user.role.toLowerCase().includes(debouncedSearch)
    );
  }, [users, debouncedSearch]);

  // safe delete with confirmation
  const handleDelete = useCallback((u: User) => {
    if (confirm(`Delete user "${u.name}"? This action cannot be undone.`)) {
      setUsers(prev => prev.filter(p => p.id !== u.id));
    }
  }, []);

  // Modal form (Create/Edit)
  const UserForm: React.FC<{ user?: User; onClose: () => void }> = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      role: user?.role || ('scientist' as const),
    });
    const [touched, setTouched] = useState({ name: false, email: false, username: false });

    // focus first input on open
    useEffect(() => {
      const t = setTimeout(() => firstInputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }, []);

    // validation helpers
    const isValidEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
    const isValid = formData.name.trim().length > 0 && isValidEmail(formData.email) && formData.username.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) {
        setTouched({ name: true, email: true, username: true });
        return;
      }

      if (user) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...formData } : u));
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setUsers(prev => [...prev, newUser]);
      }
      onClose();
    };

    return (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="userform-title"
      >
        <Card className="w-full max-w-md bg-white border border-slate-200 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle id="userform-title">{user ? 'Edit User' : 'Create New User'}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                required
                ref={firstInputRef}
              />
              {touched.name && !formData.name.trim() && <div className="text-rose-600 text-sm">Name is required.</div>}

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                required
              />
              {touched.email && !isValidEmail(formData.email) && <div className="text-rose-600 text-sm">Enter a valid email.</div>}

              <Input
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                required
              />
              {touched.username && !formData.username.trim() && <div className="text-rose-600 text-sm">Username is required.</div>}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-500"
                >
                  <option value="admin">Administrator</option>
                  <option value="injector">Data Injector</option>
                  <option value="scientist">Research Scientist</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white"
                  disabled={!isValid}
                >
                  {user ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  // when a modal closes, restore focus back to the trigger (create or editing button)
  useEffect(() => {
    if (!showCreateForm && !editingUser) {
      createButtonRef.current?.focus();
    }
  }, [showCreateForm, editingUser]);

  return (
    <div className="space-y-6 bg-[#fdf2df] min-h-screen p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600">Manage system users and permissions</p>
        </div>

        <div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-sky-600 to-blue-600 text-white"
            ref={createButtonRef as any}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                  aria-label="Search users"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-slate-600">User</th>
                  <th className="text-left p-3 text-slate-600">Role</th>
                  <th className="text-left p-3 text-slate-600">Status</th>
                  <th className="text-left p-3 text-slate-600">Last Login</th>
                  <th className="text-left p-3 text-slate-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-white/60 transition-colors">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-slate-900">{u.name}</p>
                        <p className="text-sm text-slate-500">{u.email}</p>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full capitalize inline-flex items-center gap-2 ${ROLE_BADGES[u.role] || 'bg-slate-100 text-slate-800'}`}
                        aria-label={`Role: ${u.role}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${STATUS_BADGES[u.status] || 'bg-slate-100 text-slate-800'}`}
                        aria-label={`Status: ${u.status}`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="p-3 text-sm text-slate-600">{u.lastLogin || 'Never'}</td>

                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // set a ref so we can return focus if needed
                            editTriggerRef.current[u.id] = editTriggerRef.current[u.id] || null;
                            setEditingUser(u);
                            // after modal closes, focus will return automatically to create button per effect;
                            // if you prefer focus to return to edit trigger, we can store and restore it similarly.
                          }}
                          aria-label={`Edit user ${u.name}`}
                          ref={(el: HTMLButtonElement | null) => {
                            editTriggerRef.current[u.id] = el;
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(u)}
                          aria-label={`Delete user ${u.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* conditional modals */}
      {showCreateForm && <UserForm onClose={() => setShowCreateForm(false)} />}
      {editingUser && <UserForm user={editingUser} onClose={() => setEditingUser(null)} />}
    </div>
  );
};
