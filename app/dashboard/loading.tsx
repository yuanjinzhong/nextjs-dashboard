// 这是流式传输的逻辑
// 在 Next.js 中，有两种实现流式传输的方式：
// 在页面级别，使用 loading.tsx 文件。
// 对于特定组件，使用 <Suspense>。
//当/dashboard下的page.tsx还在渲染无法提供给用户时,这个loading.tsx文件提供一个fallback UI(过渡性的UI)
import DashboardSkeleton from '@/app/ui/skeletons';
export default function Loading() {
    //这就是一般网站见的比较多的龙骨屏幕
    return <DashboardSkeleton />;
  }