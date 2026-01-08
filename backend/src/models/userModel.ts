import type { User } from '@prisma/client';
import prisma from '../utils/prisma.js';

export const createUser = async (
   email: string,
   password: string,
   name?: string
): Promise<User> => {
   return prisma.user.create({
      // The commented line below shows an alternative way to write the data object
      // {email: email, password: password, name: name ?? null}
      data: { email, password, name: name ?? null },
   });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
   return prisma.user.findUnique({
      where: { email },
   });
};

export const findUserById = async (
   id: number
): Promise<Omit<User, 'password'> | null> => {
   return prisma.user.findUnique({
      where: { id },
      select: {
         // no password field
         id: true,
         email: true,
         name: true,
         createdAt: true,
      },
   });
};
