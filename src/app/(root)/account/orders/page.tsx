import { Metadata } from 'next'
import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatId } from '@/lib/utils'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import {getMyOrders} from "@/lib/api/order";
import {Order} from "@/lib/response/order";
import {PAGE_SIZE} from "@/lib/constants";

const PAGE_TITLE = 'Your Orders'
export const metadata: Metadata = {
    title: PAGE_TITLE,
}
export default async function OrdersPage(props: {
    searchParams: Promise<{ page: string }>
}) {
    const searchParams = await props.searchParams
    const page = Number(searchParams.page) || 1
    const orders = await getMyOrders({
        page,
    })
    return (
        <div>
            <div className='flex gap-2'>
                <Link href='/account'>Your Account</Link>
                <span>›</span>
                <span>{PAGE_TITLE}</span>
            </div>
            <h1 className='h1-bold pt-4'>{PAGE_TITLE}</h1>
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Paid</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(typeof orders === "string" || orders.length === 0)&& (
                            <TableRow>
                                <TableCell colSpan={6} className=''>
                                    You have no orders.
                                </TableCell>
                            </TableRow>
                        )}
                        {typeof orders!== "string" && orders.map((order: Order) => (
                            <TableRow key={order.orderId}>
                                <TableCell>
                                    <Link href={`/account/orders/${order.orderId}`}>
                                        {order.orderId}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {formatDateTime(order.createdAt!).dateTime}
                                </TableCell>
                                <TableCell>
                                    <ProductPrice price={order.totalPrice} plain />
                                </TableCell>
                                <TableCell>
                                    {order.totalPayment <= 0?
                                        'Yes'
                                        : 'No'}
                                </TableCell>
                                <TableCell>
                                    {order.status.statusName}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/account/orders/${order.orderId}`}>
                                        <span className='px-2'>Details</span>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {orders.length / PAGE_SIZE >1 && (
                    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                    <Pagination page={page} totalPages={ Math.ceil(orders.length / PAGE_SIZE)!} />
                )}
            </div>
            <BrowsingHistoryList className='mt-16' />
        </div>
    )
}