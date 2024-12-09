import { z } from "zod";
import {SafeParseReturnType} from "zod/lib/types";

// 定义模式
const userSchema = z.object({
    name: z.string(),
    age: z.number().int().positive(),
    email: z.string().email(),
});

// 测试数据
const testValidData = () => {
    const userData = {
        name: "Alice",
        age: 25,
        email: "alice@example.com",
    };

    const result = userSchema.parse(userData); // 验证通过时返回数据
    console.log("验证成功：", result);
};

const testInvalidData = () => {
    try {
        userSchema.parse({
            name: "Bob",
            age: -5,
            email: "not_an_email",
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            console.error("验证失败：", err.errors); // 输出错误信息
        }
    }
};

const testInvalidDataSafe = () => {
   const userData={
       name: "Bob",
       age: -5,
       email: "not_an_email",
   }
   const safeParse:SafeParseReturnType = userSchema.safeParse(userData);
   if (!safeParse.success){
       console.log("验证失败-安全的：",safeParse.error.issues)
   }

};

// 调用测试函数
testValidData();
testInvalidData();
testInvalidDataSafe()




// 定义 Zod 模式
const userSchema2 = z.object({
    name: z.string(),
    age: z.number().int().positive(),
    email: z.string().email(),
    isActive: z.boolean().optional(), // 可选字段
});

// 使用 z.infer 推断类型
type User = z.infer<typeof userSchema2>;

// 示例：在 TypeScript 中验证类型
const validUser: User = {
    name: "Alice",
    age: 30,
    email: "alice@example.com",
    isActive: true, // 这是可选的，可以省略
};

const invalidUser: User = {
    name: "Bob",
    age: 25,
    email: "bob@example", // 错误：无效邮箱格式
};

console.log("Valid user:", validUser);
console.log("Invalid user:", invalidUser); // 这行代码会导致编译报错
