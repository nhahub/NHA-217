import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, updateUserStatus, deleteUser } from '../../api/admin';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page, search, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { isActive: statusFilter === 'active' }),
      };
      const result = await getAllUsers(params);
      setUsers(result.users || []);
      setTotalPages(result.pages || 1);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: !currentStatus } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    exit: { opacity: 0, x: 20 },
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="admin-users">
      {/* Filters */}
      <div className="users-filters">
        <div className="filter-group">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="table-loading">Loading users...</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="table-row"
                    whileHover={{ backgroundColor: '#f8fafc' }}
                  >
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <motion.button
                        className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleStatusToggle(user._id, user.isActive)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </motion.button>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <motion.button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(user._id)}
                          title="Delete user"
                          whileHover={{ scale: 1.1, backgroundColor: '#fee2e2' }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <motion.button
            className="pagination-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            whileHover={page !== 1 ? { scale: 1.05 } : {}}
            whileTap={page !== 1 ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Previous
          </motion.button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <motion.button
            className="pagination-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            whileHover={page !== totalPages ? { scale: 1.05 } : {}}
            whileTap={page !== totalPages ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

