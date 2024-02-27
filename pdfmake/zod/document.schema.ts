import { z } from 'zod';

const ImageDefinition = z.union([z.string(), z.object({
  url: z.string(),
  headers: z.record(z.string())
})]);

const Node = z.union([z.string(), z.object({
  // 这里是对象的具体定义
})]);

const TDocumentInformation = z.object({
  // 在这里定义 TDocumentInformation 对象的结构，这里省略了具体的定义
});

const Style = z.object({
  // 在这里定义 Style 对象的结构，这里省略了具体的定义
});

const DynamicContent = z.union([Node, Style]);
const Content = z.union([Node, Style]);

const Margins = z.object({
  // 在这里定义 Margins 对象的结构，这里省略了具体的定义
});

const PageSize = z.string(); // 你可能需要根据实际情况定义 PageSize 类型

const PageOrientation = z.string(); // 你可能需要根据实际情况定义 PageOrientation 类型

const Watermark = z.union([z.string(), Style]); // 可能需要根据实际情况定义 Watermark 类型

const Pattern = z.object({
  // 在这里定义 Pattern 对象的结构，这里省略了具体的定义
});

const documentSchema = z.object({
  content:z.array( DynamicContent),
  background: z.union([DynamicContent, ImageDefinition]).optional(),
  compress: z.boolean().optional(),
  defaultStyle: Style.optional(),
  footer: z.union([DynamicContent, Content]).optional(),
  header: z.union([DynamicContent, Content]).optional(),
  images: z.record(ImageDefinition).optional(),
  info: TDocumentInformation.optional(),
  pageBreakBefore: z.function(z.tuple([Node, z.array(Node), z.array(Node), z.array(Node)]), z.boolean()).optional(),
  pageMargins: Margins.optional(),
  pageOrientation: PageOrientation.optional(),
  pageSize: PageSize.optional(),
  styles: z.record(Style).optional(),
  userPassword: z.string().optional(),
  ownerPassword: z.string().optional(),
  permissions: z.record(z.unknown()).optional(),
  version: z.number().optional(),
  watermark: Watermark.optional(),
  patterns: z.record(Pattern).optional(),
});
export { documentSchema}