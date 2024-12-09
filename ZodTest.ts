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
