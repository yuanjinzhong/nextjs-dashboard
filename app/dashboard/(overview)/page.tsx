import CardWrapper, {Card} from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import {lusitana} from '@/app/ui/fonts';
import {fetchCardData, fetchLatestInvoices} from '../../lib/data';
import {Suspense} from 'react';
import {CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton} from '@/app/ui/skeletons';

export default async function Page() {

    // 收入数据
    // const revenue = await fetchRevenue();

    // 最新的5条发票
    // const latestInvoices= await fetchLatestInvoices();

    // 卡片大盘数据
    // const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices}= await fetchCardData();

    // 上面这种方式是瀑布式的请求(waterfalls),会比较慢, 如果三个请求之间没有先后依赖关系

    // 下面的写法并行处理,注意Promise.all返回的是数组,不是对象，不过这里都不需要了，因为数据获取移动到组建内部了
    // const [cardData] = await Promise.all([fetchLatestInvoices(), fetchCardData()]);

    // const {numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices} = cardData;

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/*Streaming is a data transfer technique,流式传输加载骨架屏*/}
                <Suspense fallback={<CardsSkeleton/>}>
                    <CardWrapper/>
                </Suspense>

            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">

                {/* 实现流式加载组建,也就是部分加载,该组建在加载期间,给用户展示骨架屏 */}
                <Suspense fallback={<RevenueChartSkeleton/>}>
                    <RevenueChart/> {/*收入卡片 */}
                </Suspense>

                <Suspense fallback={<LatestInvoicesSkeleton/>}>
                    <LatestInvoices/> {/*发票卡片 */}
                </Suspense>

            </div>
        </main>
    );
}