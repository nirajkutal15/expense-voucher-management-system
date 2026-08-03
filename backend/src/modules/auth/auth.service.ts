import bcrypt from 'bcryptjs';
import { prisma } from '../../config';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { UnauthorizedError, NotFoundError, ConflictError } from '../../errors/AppError';
import { Role } from '../../constants';

export class AuthService {
  async register(data: { email: string; password: string; name: string; employeeId?: string }) {
    const email = data.email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email address already exists', 'EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const empId = data.employeeId?.trim() || `EMP-${Math.floor(100 + Math.random() * 900)}`;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: data.name.trim(),
        employeeId: empId,
        role: Role.EMPLOYEE,
      },
    });

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Calculate refresh token expiry (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedError('Refresh token required', 'MISSING_REFRESH_TOKEN');
    }

    verifyRefreshToken(token);

    // Check if refresh token exists in DB and is active
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // Revoke used token (token rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = storedToken.user;
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token?: string) {
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return true;
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        employeeId: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return user;
  }
}

export const authService = new AuthService();
