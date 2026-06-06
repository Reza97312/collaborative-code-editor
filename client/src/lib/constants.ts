import { Language } from "@/types";

export const LANGUAGES: Language[] = [
  {
    id: "javascript",
    label: "JavaScript",
    defaultCode: '// JavaScript\nconsole.log("Hello, World!");\n',
  },
  {
    id: "typescript",
    label: "TypeScript",
    defaultCode:
      '// TypeScript\nconst msg: string = "Hello, World!";\nconsole.log(msg);\n',
  },
  {
    id: "python",
    label: "Python",
    defaultCode: '# Python\nprint("Hello, World!")\n',
  },
  {
    id: "java",
    label: "Java",
    defaultCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  },
  {
    id: "cpp",
    label: "C++",
    defaultCode:
      '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n',
  },
  {
    id: "go",
    label: "Go",
    defaultCode:
      'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
  },
  {
    id: "rust",
    label: "Rust",
    defaultCode: 'fn main() {\n    println!("Hello, World!");\n}\n',
  },
  {
    id: "html",
    label: "HTML",
    defaultCode:
      "<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>\n",
  },
  {
    id: "css",
    label: "CSS",
    defaultCode:
      "body {\n    font-family: sans-serif;\n    background: #1e1e1e;\n    color: white;\n}\n",
  },
  {
    id: "json",
    label: "JSON",
    defaultCode: '{\n    "message": "Hello, World!",\n    "version": 1\n}\n',
  },
];

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";
export const MAX_USERNAME_LENGTH = 20;
export const MAX_CODE_SIZE = 100_000;
