import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import {CreateInvoice} from '@/app/ui/invoices/buttons';
import {lusitana} from '@/app/ui/fonts';
import {InvoicesTableSkeleton} from '@/app/ui/skeletons';
import {Suspense} from 'react';
import {fetchInvoicesPages} from "@/app/lib/data";

// 每个app目录下的路由组建（page组建）都是缺省有一个searchParams参数的，表示当前的路由参数，官方文档：https://nextjs.org/docs/app/api-reference/file-conventions/page
export default async function Page({searchParams}: { searchParams?: { query?: string, page?: string } }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query);// 在服务端组建查询数据库，将得到的数据传给客户端组建：totalPages
    console.log(`服务端显示invoice的totalPage等于:${totalPages}`)
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..."/>
                <CreateInvoice/>
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton/>}>
                <Table query={query} currentPage={currentPage}/>
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                 <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}