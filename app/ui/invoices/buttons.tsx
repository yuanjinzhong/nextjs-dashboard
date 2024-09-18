import { deleteInvoice } from '@/app/lib/action';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

/**
 * 路由到发票编辑页面
 * @param id
 * @constructor
 */
export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


/**
 * 删除的话,不需要路由的奥具体的页面,所以在当前按钮实现删除就行
 * @param param0 
 * @returns 
 */

export function DeleteInvoice({ id }: { id: string }) {

  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  // <form action={deleteInvoiceWithId}>    叫做 server action , 不过在spring boot 作为后端接口时,基本没啥用
  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
