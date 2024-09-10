import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchLatestInvoices, fetchRevenue, } from '../lib/data';
import { promises } from 'dns';

export default async function Page() {

  // 收入数据
  // const revenue = await fetchRevenue();

  // 最新的5条发票
  // const latestInvoices= await fetchLatestInvoices();

  // 卡片大盘数据
  // const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices}= await fetchCardData();

  // 上面这种方式是瀑布式的请求(waterfalls),会比较慢, 如果三个请求之间没有先后依赖关系

  // 下面的写法并行处理,注意Promise.all返回的是数组,不是对象
  const [revenue, latestInvoices, cardData] = await Promise.all([ fetchRevenue(), fetchLatestInvoices(),  fetchCardData()  ]);
  
  const { numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices } = cardData;

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/*收入卡片 */}
        <RevenueChart revenue={revenue} />  
        {/*发票卡片 */}
        <LatestInvoices latestInvoices={latestInvoices} />  
      </div>
    </main>
  );
}