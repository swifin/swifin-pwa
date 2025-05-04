"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleVendorStatus = exports.getVendors = exports.getActivityLogs = exports.getTopContributors = exports.getAdminSummary = void 0;
const prisma_1 = require("../../lib/prisma");
const client_1 = require("@prisma/client");
const getAdminSummary = async (_req, res) => {
    try {
        const [users, wallets, transactions, sfncTotal, sfnlTotal] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.wallet.count(),
            prisma_1.prisma.transaction.count(),
            prisma_1.prisma.wallet.aggregate({ _sum: { sfnc_balance: true } }),
            prisma_1.prisma.wallet.aggregate({ _sum: { sfnl_balance: true } }),
        ]);
        return res.json({
            users,
            wallets,
            transactions,
            sfncTotal: sfncTotal._sum.sfnc_balance?.toNumber() || 0,
            sfnlTotal: sfnlTotal._sum.sfnl_balance?.toNumber() || 0,
        });
    }
    catch (error) {
        console.error('Admin Summary Error:', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
exports.getAdminSummary = getAdminSummary;
const getTopContributors = async (_req, res) => {
    try {
        const topContributors = await prisma_1.prisma.wallet.findMany({
            orderBy: { sfnl_balance: 'desc' },
            take: 5,
            include: { user: { select: { name: true, swifin_id: true } } },
        });
        return res.json(topContributors.map((wallet) => ({
            name: wallet.user?.name || 'Unnamed',
            swifinId: wallet.user?.swifin_id || 'Unknown',
            sfnl: wallet.sfnl_balance.toNumber(),
        })));
    }
    catch (err) {
        console.error('Top Contributors Error:', err);
        return res.status(500).json({ error: 'Could not fetch top contributors' });
    }
};
exports.getTopContributors = getTopContributors;
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
        return res.json(logs.map((tx) => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount_sfnc.toNumber(),
            time: tx.created_at,
            user: tx.user?.name || 'Unknown',
            swifinId: tx.user?.swifin_id || 'Unknown',
        })));
    }
    catch (err) {
        console.error('Activity Logs Error:', err);
        return res.status(500).json({ error: 'Could not fetch logs' });
    }
};
exports.getActivityLogs = getActivityLogs;
const getVendors = async (_req, res) => {
    try {
        const vendors = await prisma_1.prisma.vendor.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        swifin_id: true,
                    },
                },
                transactions: {
                    select: {
                        amount_sfnc: true,
                    },
                },
            },
        });
        const vendorList = vendors.map((vendor) => {
            const revenue = vendor.transactions.reduce((sum, tx) => {
                return sum + tx.amount_sfnc.toNumber();
            }, 0);
            return {
                id: vendor.id,
                type: vendor.vendor_type,
                active: vendor.status === client_1.$Enums.VendorStatus.active,
                name: vendor.user?.name || 'N/A',
                email: vendor.user?.email || '',
                swifinId: vendor.user?.swifin_id || '',
                revenue,
            };
        });
        return res.json(vendorList);
    }
    catch (error) {
        console.error('Get Vendors Error:', error);
        return res.status(500).json({ error: 'Could not fetch vendors' });
    }
};
exports.getVendors = getVendors;
const toggleVendorStatus = async (req, res) => {
    const { vendorId, active } = req.body;
    try {
        const updated = await prisma_1.prisma.vendor.update({
            where: { id: vendorId },
            data: { status: active ? client_1.$Enums.VendorStatus.active : client_1.$Enums.VendorStatus.suspended },
        });
        return res.json({ success: true, updated });
    }
    catch (err) {
        console.error('Toggle Vendor Status Error:', err);
        return res.status(500).json({ error: 'Could not update vendor status' });
    }
};
exports.toggleVendorStatus = toggleVendorStatus;
