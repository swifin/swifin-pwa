"use strict";
// apps/backend/src/controllers/admin/adminController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleVendorStatus = exports.getVendors = exports.getActivityLogs = exports.getTopContributors = exports.getAdminSummary = void 0;
const prisma_1 = require("../../lib/prisma");
const client_1 = require("@prisma/client");
/**
 * GET /admin/summary
 * Returns counts and totals for users, wallets, transactions.
 */
const getAdminSummary = async (_req, res) => {
    try {
        const [usersCount, walletsCount, transactionsCount, sfncAgg, sfnlAgg] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.wallet.count(),
            prisma_1.prisma.transaction.count(),
            prisma_1.prisma.wallet.aggregate({ _sum: { sfnc_balance: true } }),
            prisma_1.prisma.wallet.aggregate({ _sum: { sfnl_balance: true } }),
        ]);
        const sfncTotal = sfncAgg._sum.sfnc_balance?.toNumber() ?? 0;
        const sfnlTotal = sfnlAgg._sum.sfnl_balance?.toNumber() ?? 0;
        return res.json({
            users: usersCount,
            wallets: walletsCount,
            transactions: transactionsCount,
            sfncTotal,
            sfnlTotal,
        });
    }
    catch (error) {
        console.error('Admin Summary Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAdminSummary = getAdminSummary;
/**
 * GET /admin/top-contributors
 * Returns top 5 wallets by SFNL balance.
 */
const getTopContributors = async (_req, res) => {
    try {
        const top = await prisma_1.prisma.wallet.findMany({
            orderBy: { sfnl_balance: 'desc' },
            take: 5,
            include: { user: { select: { name: true, swifin_id: true } } },
        });
        const result = top.map((w) => ({
            name: w.user?.name ?? 'Unknown',
            swifinId: w.user?.swifin_id ?? '',
            sfnl: w.sfnl_balance.toNumber(),
        }));
        return res.json(result);
    }
    catch (error) {
        console.error('Top Contributors Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTopContributors = getTopContributors;
/**
 * GET /admin/activity-logs
 * Returns the 10 most recent transactions.
 */
const getActivityLogs = async (_req, res) => {
    try {
        const logs = await prisma_1.prisma.transaction.findMany({
            orderBy: { created_at: 'desc' },
            take: 10,
            select: {
                id: true,
                type: true,
                amount_sfnc: true,
                created_at: true,
                user: { select: { name: true, swifin_id: true } },
            },
        });
        const result = logs.map((tx) => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount_sfnc.toNumber(),
            time: tx.created_at,
            user: tx.user?.name ?? 'Unknown',
            swifinId: tx.user?.swifin_id ?? '',
        }));
        return res.json(result);
    }
    catch (error) {
        console.error('Activity Logs Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getActivityLogs = getActivityLogs;
/**
 * GET /admin/vendors
 * Returns vendor details, including total revenue.
 */
const getVendors = async (_req, res) => {
    try {
        const vendors = await prisma_1.prisma.vendor.findMany({
            include: {
                user: { select: { name: true, email: true, swifin_id: true } },
                transactions: { select: { amount_sfnc: true } },
            },
        });
        const list = vendors.map((v) => {
            const revenue = v.transactions.reduce((sum, tx) => sum + tx.amount_sfnc.toNumber(), 0);
            return {
                id: v.id,
                type: v.vendor_type,
                active: v.status === client_1.VendorStatus.active,
                name: v.user?.name ?? '',
                email: v.user?.email ?? '',
                swifinId: v.user?.swifin_id ?? '',
                revenue,
            };
        });
        return res.json(list);
    }
    catch (error) {
        console.error('Get Vendors Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getVendors = getVendors;
/**
 * POST /admin/vendors/toggle-status
 * Body: { vendorId: string, active: boolean }
 */
const toggleVendorStatus = async (req, res) => {
    const { vendorId, active } = req.body;
    try {
        const updated = await prisma_1.prisma.vendor.update({
            where: { id: vendorId },
            data: {
                status: active ? client_1.VendorStatus.active : client_1.VendorStatus.suspended,
            },
        });
        return res.json({ success: true, vendor: updated });
    }
    catch (error) {
        console.error('Toggle Vendor Status Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.toggleVendorStatus = toggleVendorStatus;
