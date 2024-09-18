import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {fetchCustomers, fetchInvoiceById} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({params}: { params:{id: string  }} ) {

    const id = params.id;

    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    // nextjs中文件名规范 :https://nextjs.org/docs/app/api-reference/file-conventions
    if(!invoice){
        notFound(); // 导航到not-fount 页面, 需要同页面下面有not-found.txs,这是nextjs 内置的约定
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Invoices', href: '/dashboard/invoices'},
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice}
                  customers={customers}/> {/*这个是edit-form，在创建页面是create-form*，这个edit-form需要数据预填充好*/}
        </main>
    );
}