'use client';

import {ArrowLeftIcon, ArrowRightIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import {generatePagination} from '@/app/lib/utils';
import {usePathname, useSearchParams} from "next/navigation";

export default function Pagination({totalPages}: { totalPages: number }) {
    // NOTE: Uncomment this code in Chapter 11

    //当前路由参数
    const pathname = usePathname();
    // nextjs的hook,返回Url里的查询参数,例如当前URL:http://localhost:3000/dashboard/invoices?page=3,则searchParams是: page=3
    const searchParams = useSearchParams();
    console.log(`分页组建里面获取的searchParams：${searchParams}，它的类型是 ${typeof searchParams}`)
    const currentPage = Number(searchParams.get('page')) || 1;

    // 返回分页的字面量页面，长这样:[1,2,3,....8]，后面这个类型（: (number | string)[]）是我手动加的
    const allPages: (number | string)[] = generatePagination(currentPage, totalPages);

    // new URLSearchParams(searchParams) 是page=2，可以看到和useSearchParams()的返回值一样，但是类型不一样
    console.log(` new URLSearchParams(searchParams)的返回值是：${ new URLSearchParams(searchParams)},它的类型是 ${typeof new URLSearchParams(searchParams)}`)

    //将查询参数与路由路径拼接起来，形成一个新的路由
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);//浏览器的原生api
        params.set('page',pageNumber.toString());
        return `${pathname}?${params.toString()}`; //pageNumber.toString 不加括号表示对`tostring`方法的引用
    };


    return (
        <>
            {/*NOTE: Uncomment this code in Chapter 11*/}
             {/*分页按钮的左箭头*/}
            <div className="inline-flex">
                <PaginationArrow
                    direction="left"
                    href={createPageURL(currentPage - 1)} /*导航到当前路由,也就是/invoices/page.tsx，并且这个路由组建会接受查询参数*/
                    isDisabled={currentPage <= 1}
                />

                {/*分页按钮的页码*/}
                <div className="flex -space-x-px">
                    {allPages.map((page, index) => {
                        let position: 'first' | 'last' | 'single' | 'middle'= 'middle' ;

                        if (index === 0) position = 'first';
                        if (index === allPages.length - 1) position = 'last';
                        if (allPages.length === 1) position = 'single';
                        if (page === '...') position = 'middle';

                        return (
                            <PaginationNumber
                                key={page}
                                href={createPageURL(page)}
                                page={page}
                                position={position}
                                isActive={currentPage === page}
                            />
                        );
                    })}
                </div>

                {/*分页按钮的右边箭头*/}
                <PaginationArrow
                    direction="right"
                    href={createPageURL(currentPage + 1)}
                    isDisabled={currentPage >= totalPages}
                />
            </div>
        </>
    );
}

function PaginationNumber({
                              page,
                              href,
                              isActive,
                              position,
                          }: {
    page: number | string;
    href: string;
    position?: 'first' | 'last' | 'middle' | 'single';
    isActive: boolean;
}) {
    const className = clsx(
        'flex h-10 w-10 items-center justify-center text-sm border',
        {
            'rounded-l-md': position === 'first' || position === 'single',
            'rounded-r-md': position === 'last' || position === 'single',
            'z-10 bg-blue-600 border-blue-600 text-white': isActive,
            'hover:bg-gray-100': !isActive && position !== 'middle',
            'text-gray-300': position === 'middle',
        },
    );

    return isActive || position === 'middle' ? (
        <div className={className}>{page}</div>
    ) : (
        <Link href={href} className={className}>
            {page}
        </Link>
    );
}

function PaginationArrow({
                             href,
                             direction,
                             isDisabled,
                         }: {
    href: string;
    direction: 'left' | 'right';
    isDisabled?: boolean;
}) {
    const className = clsx(
        'flex h-10 w-10 items-center justify-center rounded-md border',
        {
            'pointer-events-none text-gray-300': isDisabled,
            'hover:bg-gray-100': !isDisabled,
            'mr-2 md:mr-4': direction === 'left',
            'ml-2 md:ml-4': direction === 'right',
        },
    );

    const icon =
        direction === 'left' ? (
            <ArrowLeftIcon className="w-4"/>
        ) : (
            <ArrowRightIcon className="w-4"/>
        );

    return isDisabled ? (
        <div className={className}>{icon}</div>
    ) : (
        <Link className={className} href={href}>
            {icon}
        </Link>
    );
}
