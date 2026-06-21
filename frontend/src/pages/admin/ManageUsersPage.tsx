import { useEffect, useState } from 'react';
import { adminUsersApi, extractErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';
import type { Role, User } from '../../types';

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    adminUsersApi
      .list()
      .then(setUsers)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (target: User, role: Role) => {
    setSavingId(target.id);
    setError(null);
    try {
      const updated = await adminUsersApi.updateRole(target.id, role);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-forest-900">Users</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand-100 text-xs uppercase tracking-wide text-forest-900/60">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-forest-900/50">
                    Loading…
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-sand-50">
                      <td className="px-5 py-3 font-medium text-forest-900">
                        {user.name}
                        {isSelf && <span className="ml-2 text-xs text-forest-600">(you)</span>}
                      </td>
                      <td className="px-5 py-3 text-forest-900/70">{user.email}</td>
                      <td className="px-5 py-3 text-forest-900/70">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3">
                        <select
                          className="input-field max-w-[160px] py-1.5"
                          value={user.role}
                          disabled={isSelf || savingId === user.id}
                          onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
