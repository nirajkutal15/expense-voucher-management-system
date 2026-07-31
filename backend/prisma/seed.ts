import { PrismaClient } from '@prisma/client';
import { Role, VoucherStatus } from '../src/constants';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding with Indian Corporate Entities...');

  // Clean existing data
  await prisma.refreshToken.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password@123', 12);
  const employeePasswordHash = await bcrypt.hash('Employee@123', 12);
  const directorPasswordHash = await bcrypt.hash('Director@123', 12);
  const accountsPasswordHash = await bcrypt.hash('Accounts@123', 12);

  // 1. Create Users with Indian Names
  const employee1 = await prisma.user.create({
    data: {
      email: 'employee@abc.com',
      passwordHash: employeePasswordHash,
      name: 'Rajesh Kumar',
      employeeId: 'EMP-101',
      role: Role.EMPLOYEE,
    },
  });

  const employee2 = await prisma.user.create({
    data: {
      email: 'priya.sharma@abc.com',
      passwordHash,
      name: 'Priya Sharma',
      employeeId: 'EMP-102',
      role: Role.EMPLOYEE,
    },
  });

  const employee3 = await prisma.user.create({
    data: {
      email: 'amit.patel@abc.com',
      passwordHash,
      name: 'Amit Patel',
      employeeId: 'EMP-103',
      role: Role.EMPLOYEE,
    },
  });

  const director = await prisma.user.create({
    data: {
      email: 'director@abc.com',
      passwordHash: directorPasswordHash,
      name: 'Vikramaditya Mehta (Director)',
      employeeId: 'DIR-001',
      role: Role.DIRECTOR,
    },
  });

  await prisma.user.create({
    data: {
      email: 'accounts@abc.com',
      passwordHash: accountsPasswordHash,
      name: 'Sneha Verma (Accounts)',
      employeeId: 'ACC-001',
      role: Role.ACCOUNTS,
    },
  });

  console.log('✅ Created Seed Users with Indian Names:');
  console.log('   - Employee 1: Rajesh Kumar (employee@abc.com / Employee@123)');
  console.log('   - Employee 2: Priya Sharma (priya.sharma@abc.com / Password@123)');
  console.log('   - Employee 3: Amit Patel (amit.patel@abc.com / Password@123)');
  console.log('   - Director: Vikramaditya Mehta (director@abc.com / Director@123)');
  console.log('   - Accounts: Sneha Verma (accounts@abc.com / Accounts@123)');

  // Dummy base64 signature for seed data
  const sampleSignatureUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  // 2. Create Vouchers across all states
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  const vouchersData = [
    {
      voucherNumber: 'VCH-20260725-0001',
      expenseDate: lastWeek,
      department: 'Engineering',
      expenseTitle: 'Cloud Server Infrastructure & AWS Production Cluster',
      expenseCategory: 'Software & Subscriptions',
      expenseDescription: 'AWS production server monthly infrastructure renewal fee for Q3 scaling.',
      amount: 1450.50,
      status: VoucherStatus.APPROVED,
      employeeId: employee1.id,
      employeeSignatureUrl: sampleSignatureUrl,
      directorId: director.id,
      directorSignatureUrl: sampleSignatureUrl,
      approvalDate: lastWeek,
    },
    {
      voucherNumber: 'VCH-20260728-0002',
      expenseDate: yesterday,
      department: 'Engineering',
      expenseTitle: 'Bengaluru Tech Summit 2026 Flight & Conveyance',
      expenseCategory: 'Travel & Conveyance',
      expenseDescription: 'Flight tickets (IndiGo 6E-504) and local taxi fares for attending Bengaluru Tech Summit 2026.',
      amount: 620.00,
      status: VoucherStatus.PENDING_APPROVAL,
      employeeId: employee1.id,
      employeeSignatureUrl: sampleSignatureUrl,
    },
    {
      voucherNumber: 'VCH-20260730-0003',
      expenseDate: today,
      department: 'Engineering',
      expenseTitle: 'Ergonomic Desk Chair & Dual Monitor Stand',
      expenseCategory: 'Hardware & Equipment',
      expenseDescription: 'Workstation ergonomic furniture for remote engineering setup.',
      amount: 349.99,
      status: VoucherStatus.DRAFT,
      employeeId: employee1.id,
    },
    {
      voucherNumber: 'VCH-20260720-0004',
      expenseDate: twoWeeksAgo,
      department: 'Engineering',
      expenseTitle: 'Cyber City Team Dinner after Q2 Release',
      expenseCategory: 'Meals & Entertainment',
      expenseDescription: 'Team dinner celebration with 8 engineering team members at Cyber Hub, Gurugram.',
      amount: 480.00,
      status: VoucherStatus.REJECTED,
      employeeId: employee1.id,
      employeeSignatureUrl: sampleSignatureUrl,
      directorId: director.id,
      rejectionReason: 'Exceeds team meal per-head budget policy (₹3,000/person max limit). Please revise bill breakdown.',
    },
    {
      voucherNumber: 'VCH-20260729-0005',
      expenseDate: yesterday,
      department: 'Sales & Marketing',
      expenseTitle: 'Mumbai Enterprise Client Prospect Meeting Lunch',
      expenseCategory: 'Meals & Entertainment',
      expenseDescription: 'Business client lunch meeting at BKC Mumbai with Reliance Retail decision makers.',
      amount: 185.75,
      status: VoucherStatus.PENDING_APPROVAL,
      employeeId: employee2.id,
      employeeSignatureUrl: sampleSignatureUrl,
    },
    {
      voucherNumber: 'VCH-20260722-0006',
      expenseDate: lastWeek,
      department: 'Sales & Marketing',
      expenseTitle: 'Figma Organization License Annual GST Renewal',
      expenseCategory: 'Software & Subscriptions',
      expenseDescription: 'Annual Figma organization license renewal for design and marketing collateral.',
      amount: 840.00,
      status: VoucherStatus.APPROVED,
      employeeId: employee2.id,
      employeeSignatureUrl: sampleSignatureUrl,
      directorId: director.id,
      directorSignatureUrl: sampleSignatureUrl,
      approvalDate: yesterday,
    },
    {
      voucherNumber: 'VCH-20260731-0007',
      expenseDate: today,
      department: 'Operations',
      expenseTitle: 'Delhi Head Office High-Speed Leased Line Internet Bill',
      expenseCategory: 'Utilities & Bills',
      expenseDescription: 'Monthly Airtel Enterprise high-speed fiber line for Delhi HQ.',
      amount: 299.00,
      status: VoucherStatus.PENDING_APPROVAL,
      employeeId: employee3.id,
      employeeSignatureUrl: sampleSignatureUrl,
    },
  ];

  for (const v of vouchersData) {
    await prisma.voucher.create({ data: v });
  }

  console.log(`✅ Seeded ${vouchersData.length} Indian vouchers across DRAFT, PENDING_APPROVAL, APPROVED, and REJECTED states.`);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
