// 引用项数据结构
export interface ReferenceItem {
  id: string;
  type: "file" | "file-snippet" | "global-snippet" | "comment";
  title: string;
  filePath?: string;
  snippet?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  targetFilePath?: string;
  groupId?: string; // 新增：所属标签组ID
}

// 标签组数据结构
export interface ReferenceGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}