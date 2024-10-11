const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const User = {
  findAll: () => prisma.user.findMany(),
  create: (data) => prisma.user.create({ data }),
};

module.exports = User;