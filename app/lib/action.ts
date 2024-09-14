'use server';

import { z } from 'zod';
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

/**
 * 类型转换
 */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });


/**
 * form 表单直接调用这个接口
 * @param formData
 */
export async function createInvoice(formData: FormData) {

    // 类型转换
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const  amountInCents=amount*100;

    const date = new Date().toISOString().split("T")[0];


    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

    /**
     * nextjs 做`路由预获取`的时候,会缓存路由信息在用户浏览器（一段时间），这是为了用户可以快速的在各种路由之间导航，避免每次导航都去请求nodejs 服务端
     *
     * 但是我们现在插入的数据，则需要手动刷新这个`路由缓存`
     */
    revalidatePath('/dashboard/invoices');


    /**
     * 重定向回发票列表页，因为我们现在`/invoice/create`页面
     */
    redirect('/dashboard/invoices');


}