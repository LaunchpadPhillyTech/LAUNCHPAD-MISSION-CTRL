'use client';

import { Edit2, Trash2, UserPlus, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useTheme } from '@/app/context/ThemeContext';
import { useAuth } from '@/app/context/AuthContext';

type StaffRole = 'ADMINISTRATOR' | 'PROGRAM_COORDINATOR' | 'PARTNERSHIP_MANAGER' | 'STAFF_USER';

interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  title?: string | null;
  accessLevel?: string | null;
}

interface StaffFormState {
  fullName: string;
  email: string;
  role: StaffRole;
  title: string;
  accessLevel: string;
}

const EMPTY_STAFF_FORM: StaffFormState = {
  fullName: '',
  email: '',
  role: 'STAFF_USER',
  title: '',
  accessLevel: '',
};

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [addForm, setAddForm] = useState<StaffFormState>(EMPTY_STAFF_FORM);
  const [editForm, setEditForm] = useState<StaffFormState>(EMPTY_STAFF_FORM);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);


  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      } else {
        setErrorMessage('Unable to load staff list.');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setErrorMessage('Unable to load staff list.');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStaffList(staffList.filter(s => s.id !== id));
        if (editingId === id) {
          setEditingId(null);
        }
      } else {
        setErrorMessage('Failed to delete staff member.');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      setErrorMessage('Failed to delete staff member.');
    }
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  const startAddStaff = () => {
    setErrorMessage(null);
    setEditingId(null);
    setEditForm(EMPTY_STAFF_FORM);
    setAddForm(EMPTY_STAFF_FORM);
    setIsAddingStaff(true);
  };

  const cancelAddStaff = () => {
    setIsAddingStaff(false);
    setAddForm(EMPTY_STAFF_FORM);
  };

  const startEditingStaff = (staff: StaffMember) => {
    setErrorMessage(null);
    setIsAddingStaff(false);
    setEditingId(staff.id);
    setEditForm({
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
      title: staff.title || '',
      accessLevel: staff.accessLevel || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(EMPTY_STAFF_FORM);
  };

  const handleAddStaff = async () => {
    if (!addForm.fullName || !addForm.email || !addForm.role) {
      setErrorMessage('Name, email, and role are required.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to add staff member.');
        return;
      }

      const created = await res.json();
      setStaffList((prev) => [...prev, created].sort((a, b) => a.fullName.localeCompare(b.fullName)));
      setIsAddingStaff(false);
      setAddForm(EMPTY_STAFF_FORM);
    } catch (error) {
      console.error('Error adding staff:', error);
      setErrorMessage('Failed to add staff member.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editForm.fullName || !editForm.email || !editForm.role) {
      setErrorMessage('Name, email, and role are required.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to update staff member.');
        return;
      }

      const updated = await res.json();
      setStaffList((prev) =>
        prev
          .map((staff) => (staff.id === id ? updated : staff))
          .sort((a, b) => a.fullName.localeCompare(b.fullName))
      );
      setEditingId(null);
      setEditForm(EMPTY_STAFF_FORM);
    } catch (error) {
      console.error('Error updating staff:', error);
      setErrorMessage('Failed to update staff member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
            Settings
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Manage your workspace and staff
          </p>
        </div>

        {/* Your Profile */}
        <div
          className="rounded-lg border p-8"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
                Full Name
              </p>
              <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                {user?.fullName}
              </p>
            </div>
            <div>
              <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
                Your Title / Role
              </p>
              <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                {user?.role} {user?.title && `- ${user.title}`}
              </p>
            </div>
            <div>
              <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
                Email
              </p>
              <p className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
                Access Level
              </p>
              <p className="text-lg font-semibold" style={{ color: "var(--success)" }}>
                Full access
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div
          className="rounded-lg border p-8"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                Theme
              </h3>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Choose your preferred theme for the application
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-2 rounded-lg border transition-all"
              style={{
                backgroundColor: "var(--secondary)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {theme === 'light' ? (
                <>
                  <Moon size={20} />
                  <span className="text-sm font-medium">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={20} />
                  <span className="text-sm font-medium">Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Staff Management */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Staff Directory
            </h2>
            <button
              onClick={startAddStaff}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <UserPlus size={20} />
              Add Staff Member
            </button>
          </div>

          {errorMessage && (
            <div
              className="mb-4 rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: 'rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: 'var(--destructive)',
              }}
            >
              {errorMessage}
            </div>
          )}

          {isAddingStaff && (
            <div
              className="mb-6 rounded-lg border p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <input
                placeholder="Full Name"
                value={addForm.fullName}
                onChange={(e) => setAddForm((prev) => ({ ...prev, fullName: e.target.value }))}
                className="px-3 py-2 rounded-lg border"
              />
              <input
                placeholder="Email"
                value={addForm.email}
                onChange={(e) => setAddForm((prev) => ({ ...prev, email: e.target.value }))}
                className="px-3 py-2 rounded-lg border"
              />
              <select
                value={addForm.role}
                onChange={(e) => setAddForm((prev) => ({ ...prev, role: e.target.value as StaffRole }))}
                className="px-3 py-2 rounded-lg border"
              >
                <option value="STAFF_USER">Staff User</option>
                <option value="PROGRAM_COORDINATOR">Program Coordinator</option>
                <option value="PARTNERSHIP_MANAGER">Partnership Manager</option>
                <option value="ADMINISTRATOR">Administrator</option>
              </select>
              <input
                placeholder="Title"
                value={addForm.title}
                onChange={(e) => setAddForm((prev) => ({ ...prev, title: e.target.value }))}
                className="px-3 py-2 rounded-lg border"
              />
              <input
                placeholder="Access Level"
                value={addForm.accessLevel}
                onChange={(e) => setAddForm((prev) => ({ ...prev, accessLevel: e.target.value }))}
                className="px-3 py-2 rounded-lg border"
              />
              <div className="md:col-span-2 lg:col-span-5 flex justify-end gap-2">
                <button
                  onClick={cancelAddStaff}
                  className="px-3 py-2 rounded-lg border"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  className="px-3 py-2 rounded-lg text-white"
                  style={{ backgroundColor: 'var(--primary)' }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Staff'}
                </button>
              </div>
            </div>
          )}

          <div
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "var(--secondary)", borderBottom: `1px solid var(--border)` }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Title
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Loading staff...
                    </td>
                  </tr>
                ) : staffList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      No staff found.
                    </td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                  <tr
                    key={staff.id}
                    style={{
                      borderBottom: `1px solid var(--border)`,
                      backgroundColor: "var(--card)",
                    }}
                    className="hover:opacity-75 transition-all"
                  >
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {editingId === staff.id ? (
                        <input
                          value={editForm.fullName}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-2 py-1 rounded border"
                        />
                      ) : (
                        staff.fullName
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingId === staff.id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value as StaffRole }))}
                          className="w-full px-2 py-1 rounded border"
                        >
                          <option value="STAFF_USER">Staff User</option>
                          <option value="PROGRAM_COORDINATOR">Program Coordinator</option>
                          <option value="PARTNERSHIP_MANAGER">Partnership Manager</option>
                          <option value="ADMINISTRATOR">Administrator</option>
                        </select>
                      ) : (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: 'rgba(14, 165, 164, 0.1)',
                            color: 'var(--primary)',
                          }}
                        >
                          {staff.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                      {editingId === staff.id ? (
                        <div className="grid grid-cols-1 gap-2">
                          <input
                            value={editForm.title}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full px-2 py-1 rounded border"
                            placeholder="Title"
                          />
                          <input
                            value={editForm.email}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full px-2 py-1 rounded border"
                            placeholder="Email"
                          />
                          <input
                            value={editForm.accessLevel}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, accessLevel: e.target.value }))}
                            className="w-full px-2 py-1 rounded border"
                            placeholder="Access Level"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-1">
                          <span>{staff.title || 'N/A'}</span>
                          <span className="text-xs">{staff.email}</span>
                          <span className="text-xs">{staff.accessLevel || 'N/A'}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === staff.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(staff.id)}
                              className="px-3 py-2 rounded-lg text-white text-xs"
                              style={{ backgroundColor: 'var(--primary)' }}
                              disabled={saving}
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-2 rounded-lg text-xs border"
                              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditingStaff(staff)}
                            className="p-2 rounded-lg transition-all"
                            style={{
                              backgroundColor: 'rgba(14, 165, 164, 0.1)',
                              color: 'var(--primary)',
                            }}
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--destructive)',
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SettingsPage;
