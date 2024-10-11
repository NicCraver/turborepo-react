const Router = require('koa-router');
const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../responseWrapper');
const dayjs = require('dayjs');

const router = new Router();
const prisma = new PrismaClient();

// 格式化用户数据的函数
const formatUser = (user) => ({
  ...user,
  createdAt: dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  updatedAt: dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm:ss')
});

// 创建用户
router.post('/users', async (ctx) => {
  const { name, email } = ctx.request.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      ctx.body = errorResponse('Email already in use', 409);
      return;
    }
    const user = await prisma.user.create({ data: { name, email } });
    ctx.body = successResponse(formatUser(user), 'User created successfully', 201);
  } catch (error) {
    ctx.body = errorResponse('Failed to create user', 400, error.message);
  }
});

// 获取所有用户（带分页）
router.get('/users', async (ctx) => {
  const { page = 1, pageSize = 10 } = ctx.query;
  const pageNumber = parseInt(page);
  const size = parseInt(pageSize);

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        take: size,
        skip: (pageNumber - 1) * size,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalCount / size);

    ctx.body = successResponse({
      users: users.map(formatUser),
      pagination: {
        currentPage: pageNumber,
        pageSize: size,
        totalItems: totalCount,
        totalPages,
      }
    }, 'Users retrieved successfully');
  } catch (error) {
    ctx.body = errorResponse('Failed to retrieve users', 500, error.message);
  }
});

// 根据ID获取单个用户
router.get('/users/:id', async (ctx) => {
  const { id } = ctx.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (user) {
      ctx.body = successResponse(formatUser(user), 'User retrieved successfully');
    } else {
      ctx.body = errorResponse('User not found', 404);
    }
  } catch (error) {
    ctx.body = errorResponse('Failed to retrieve user', 500, error.message);
  }
});

// 更新用户信息
router.put('/users/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, email } = ctx.request.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingUser) {
      ctx.body = errorResponse('User not found', 404);
      return;
    }
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        ctx.body = errorResponse('Email already in use', 409);
        return;
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });
    ctx.body = successResponse(formatUser(updatedUser), 'User updated successfully');
  } catch (error) {
    ctx.body = errorResponse('Failed to update user', 400, error.message);
  }
});

// 删除用户
router.delete('/users/:id', async (ctx) => {
  const { id } = ctx.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      ctx.body = errorResponse('User not found', 404);
      return;
    }
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    ctx.body = successResponse(null, 'User deleted successfully', 204);
  } catch (error) {
    ctx.body = errorResponse('Failed to delete user', 400, error.message);
  }
});

module.exports = router;