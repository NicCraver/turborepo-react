import React, { useEffect } from 'react';
import { useUserManagement } from './useUserManagement';

const UserManagement: React.FC = () => {
  const {
    userId,
    setUserId,
    name,
    setName,
    email,
    setEmail,
    message,
    users,
    pagination,
    handleRandomGeneration,
    handleCreate,
    handleRead,
    handleUpdate,
    handleDelete,
    handleQueryUsers,
    handleQueryAll
  } = useUserManagement();

  useEffect(() => {
    handleQueryUsers(1, 10);
  }, []);

  const inputStyle: React.CSSProperties = {
    margin: '5px 0',
    padding: '5px',
    width: '200px',
  };

  const buttonStyle: React.CSSProperties = {
    margin: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  };

  const messageStyle: React.CSSProperties = {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    backgroundColor: message.type === 'error' ? '#ffcccc' : '#F0F9EB',
    color: message.type === 'error' ? '#FFEFF0' : '#67C23A',
    fontWeight: 'bold'
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <input
        style={inputStyle}
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)}
      />
      <br />
      <input
        style={inputStyle}
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <br />
      <input
        style={inputStyle}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />
      <br />
      <button style={buttonStyle} onClick={handleRandomGeneration}>Generate Random User</button>
      <br />
      <button style={buttonStyle} onClick={handleCreate}>Create</button>
      <button style={buttonStyle} onClick={handleRead}>Read</button>
      <button style={buttonStyle} onClick={handleUpdate}>Update</button>
      <button style={buttonStyle} onClick={handleDelete}>Delete</button>
      <button style={buttonStyle} onClick={handleQueryAll}>Query All Users</button>
     
      <div>
        <h2>User List</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name} - {user.email}</li>
          ))}
        </ul>
        <div>
          <button
            onClick={() => handleQueryUsers(pagination.currentPage - 1, pagination.pageSize)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button
            onClick={() => handleQueryUsers(pagination.currentPage + 1, pagination.pageSize)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {message.content && (
        <div style={messageStyle}>
          {message.content}
        </div>
      )}
    </div>

  );
};

export default UserManagement;