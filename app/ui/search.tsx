'use client';

import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useDebouncedCallback} from "use-debounce";

export default function Search({placeholder}: { placeholder: string }) {

    const searchParams = useSearchParams(); // 这是一个nextjs提供的hook，用来获取url上的参数，当前Search组建作为一个客户端组建，你可以使用它，invoices/page.tsx组建是一个服务端组建，则不可以使用这个hook,转而使用searchParams属性，这是app路由的缺省属性
    const pathName = usePathname();//路由的当前路径
    const {replace} = useRouter(); //路由的替换方法，目的是为了替换路由

    //useDebouncedCallback 是 use-debounce库提供的防抖函数
    const handleSearch = useDebouncedCallback((term: string) => {

        console.log(`加$符号取值：${term}`)//这种字符串拼接方式比较友好
        console.log('加$符号取值：' + term)//普通的字符串拼接方式
        const params = new URLSearchParams(searchParams);
        params.set('page','1');// 每次查询都从第一个开始查询
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query')
        }
        console.log('当前路径:' + pathName.toString(), ',拼接的内容:' + params.toString()) // 日志：当前路径:/dashboard/invoices ,拼接的内容:query=ffffff
        replace(`${pathName}?${params.toString()}`);//用新参数替换当前路由，新参数是 ${pathName}?${params.toString()} 拼起来的内容
    }, 600)// 等到600ms,若用户停止输入则执行该函数，若用户继续输入则刷新这个时间，继续等待


    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value)
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />
            <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
        </div>
    );
}
