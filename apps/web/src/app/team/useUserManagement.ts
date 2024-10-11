import { useState } from 'react';

const API_BASE_URL = 'http://localhost:3099';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Message {
  type: 'success' | 'error' | '';
  content: string;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface UseUserManagementReturn {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  message: Message;
  users: User[];
  paginationData: Pagination;
  handleRandomGeneration: () => void;
  handleCreate: () => Promise<void>;
  handleRead: (userId: string) => Promise<void>;
  handleUpdate: (data: User) => Promise<void>;
  handleDelete: (userId: string) => Promise<void>;
  handleQueryAll: () => Promise<void>;
  handleQueryUsers: (page: number, pageSize: number) => Promise<void>;
}

export const useUserManagement = (): UseUserManagementReturn => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<Message>({ type: '', content: '' });
  const [users, setUsers] = useState<User[]>([]);
  const [paginationData, setPagination] = useState<Pagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const showMessage = (type: Message['type'], content: string): void => {
    setMessage({ type, content });
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  const handleResponse = async (response: Response): Promise<any> => {
    const data = await response.json();
    if (response.ok) {
      if (data.success === false) {
        throw new Error(data.message || 'Operation failed');
      }
      return data.data || data;
    } else {
      throw new Error(data.message || response.statusText || 'Operation failed');
    }
  };

  const generateRandomName = (): string => {
    const firstNames = ['张', '王', '李', '薛', '朱', '沈'];
    const lastNames = ['伟', '芳', '娜', '英', '敏', '静', '丽', '强', '磊', '军'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    // console.log(`name`, `${firstName} ${lastName}`)
    return `${firstName} ${lastName}`;
  };

  const generateRandomEmail = (): string => {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const randomString = Math.random().toString(36).substring(4);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomString}@${domain}`;
  };

  const handleRandomGeneration = (): void => {
    const randomName = generateRandomName();
    setName(randomName);
    setEmail(generateRandomEmail());
  };

  const handleCreate = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      }).then(handleResponse);

      showMessage('success', '用户创建成功');
      setName('');
      setEmail('');
      handleQueryUsers()
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '未知错误，请到控制台查看问题。');
    }
  };

  const handleRead = async (userId: string): Promise<void> => {
    try {
      const data = await fetch(`${API_BASE_URL}/users/${userId}`).then(handleResponse);
      if (data && data.name && data.email) {
        setName(data.name);
        setEmail(data.email);
        showMessage('success', '用户查询成功');
      } else {
        throw new Error('User data is incomplete or not found');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '未知错误，请到控制台查看问题。');
    }
  };

  const handleUpdate = async (data: User): Promise<void> => {
    try {
      const randomName = generateRandomName();
      await fetch(`${API_BASE_URL}/users/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: randomName, email:generateRandomEmail() }),
      }).then(handleResponse);
      showMessage('success', '用户更新成功');
      handleQueryUsers()
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '未知错误，请到控制台查看问题。');
    }
  };

  const handleDelete = async (userId: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      }).then(handleResponse);

      showMessage('success', '用户删除成功');
      setName('');
      setEmail('');
      handleQueryUsers()
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '未知错误，请到控制台查看问题。');
    }
  };

  const handleQueryAll = async (): Promise<void> => {
    try {
      const data = await fetch(`${API_BASE_URL}/users`).then(handleResponse);
      if (Array.isArray(data.users)) {
        // console.log('data', data);
        showMessage('success', '所有用户查询成功');
      } else {
        throw new Error('数据格式错误');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '未知错误，请到控制台查看问题。');
    }
  };

  const handleQueryUsers = async (page: number = 1, pageSize: number = 10): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${page}&pageSize=${pageSize}`);
      const data = await handleResponse(response);

      if (Array.isArray(data.users)) {
        // console.log(`data.users`, data.users)
        setUsers(data.users);
        setPagination(data.pagination);
        showMessage('success', 'Users retrieved successfully');
      } else {
        throw new Error('Unexpected data format received');
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    users,
    paginationData,
    handleRandomGeneration,
    handleCreate,
    handleRead,
    handleUpdate,
    handleDelete,
    handleQueryUsers,
    handleQueryAll
  };
};