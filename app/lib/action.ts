"use server";

import {z} from "zod";
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {signIn} from '@/auth';
import {AuthError} from 'next-auth';


/**
 * 类型转换,服务端参数校验
 */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer.",
    }),
    amount: z.coerce
        .number()
        .gt(0, {message: "Please enter an amount greater than $0."}),
    status: z.enum(["pending", "paid"], {
        invalid_type_error: "Please select an invoice status.",
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});

const UpdateInvoice = FormSchema.omit({id: true, date: true});

/**
 * form 表单直接调用这个接口
 * @param formData
 * @param preState- contains the state passed from the useActionState hook. You won't be using it in the action in this example, but it's a required prop.
 */
export async function createInvoice(prevState: State, formData: FormData) {


    console.log('createInvoice这个server action 接受的参数->prevState:' + JSON.stringify(prevState))

    const formDataObject: { [key: string]: string } = {};
    // 遍历 FormData 并将其转换为普通对象
    for (const [key, value] of formData.entries()) {
        formDataObject[key] = value as string;
    }
    console.log("创建发票数据", formDataObject);


    // const { customerId, amount, status } = CreateInvoice.parse({
    //  使用 Zod 参数校验，类型转换
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    // Prepare data for insertion into the database
    const {customerId, amount, status} = validatedFields.data;

    const amountInCents = amount * 100;

    const date = new Date().toISOString().split("T")[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: "Database Error: Failed to Create Invoice.",
        };
    }

    /**
     * nextjs 做`路由预获取`的时候,会缓存路由信息在用户浏览器（一段时间），这是为了用户可以快速的在各种路由之间导航，避免每次导航都去请求nodejs 服务端
     *
     * 但是我们现在插入的数据，则需要手动刷新这个`路由缓存`
     */
    revalidatePath("/dashboard/invoices");

    /**
     * 重定向回发票列表页，因为我们现在`/invoice/create`页面
     */
    redirect("/dashboard/invoices");
}

/**
 * 更新发票
 */
export async function updateInvoice(id: string, preState: State, formData: FormData) {

    const formDataObject: { [key: string]: string } = {};
    // 遍历 FormData 并将其转换为普通对象
    for (const [key, value] of formData.entries()) {
        formDataObject[key] = value as string;
    }
    console.log("更新发票数据", formDataObject);


    // 类型转换,参数校验
    // const { customerId, amount, status } = UpdateInvoice.parse({
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const {customerId, amount, status} = validatedFields.data;


    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId},
                amount      = ${amountInCents},
                status      = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return {message: "Database Error: Failed to Update Invoice."};
    }

    /**
     * nextjs 做`路由预获取`的时候,会缓存路由信息在用户浏览器（一段时间），这是为了用户可以快速的在各种路由之间导航，避免每次导航都去请求nodejs 服务端
     *
     * 但是我们现在插入的数据，则需要手动刷新这个`路由缓存`
     */
    revalidatePath("/dashboard/invoices");

    /**
     * 重定向回发票列表页，因为我们现在`/invoice/create`页面
     */
    redirect("/dashboard/invoices");
}

/**
 * 删除发票
 */
export async function deleteInvoice(id: string) {
    throw new Error("Failed to Delete Invoice");

    try {
        await sql`DELETE
                  FROM invoices
                  WHERE id = ${id}`;

        /**
         * 刷新数据(通过刷新路由缓存来刷新数据)
         */
        revalidatePath("/dashboard/invoices");

        // 由于路由没有变,所以不需要重定向路由,一直在发票列表页面
    } catch (error) {
        return {message: "Database Error: Failed to Delete Invoice."};
    }
}


export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};


/**
 * 登录认证
 * @param prevState
 * @param formData
 */
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const formDataObject: { [key: string]: string } = {};
        // 遍历 FormData 并将其转换为普通对象
        for (const [key, value] of formData.entries()) {
            formDataObject[key] = value as string;
        }
        console.log("服务端认证数据", formDataObject);

        await signIn('credentials', formData);

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

