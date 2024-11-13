# NextJS로 Notion 클론 사이트 만들기

## 🔧초기세팅   
`npx create-next-app@latest`   
`npx shadcn-ui init`   
`npm i @blocknote/core`   
`npm i @blocknote/react`   
`npm i @clerk/clerk-react`   
`npm i @edgestore/react`   
`npm i @edgestore/server`   
`npm i @radix-ui`   
`npm i cmdk`   
`npm i convex`   
`npm i emoji-picker-react`   
`npm i lucide-react`   
`npm i sonner`   
`npm i tailwind-merge`   
`npm i tailwindcss-animate`   
`npm i usehooks-ts`   
`npm i zod`   
`npm i zustand`   

## 🧾개념 정리   
- convex   
Convex는 현대적인 애플리케이션을 구축하는 데 도움을 주는 백엔드 플랫폼입니다. 주로 JavaScript와 TypeScript로 작성된   
애플리케이션에서 사용되며, 서버리스 아키텍터, 간편한 데이터 관리, 실시간 기능, TypeScript 지원 등의 기능을 제공합니다.   

- shadcn   
Shadcn은 사용자 인터페이스(UI) 구성 요소를 제공하는 오픈소스 라이브러리입니다. 주로 React와 함께 사용되며,   
사용자에게 빠르고 아름다운 UI를 구축하는 데 도움을 줍니다. 컴포넌트 기반, 디자인 시스템, 반응형 디자인 등의 기능을 제공함과 동시에   
기본 스타일과 기능을 사용자의 정의에 따라 쉽게 수정할 수 있기 떄문에, 개발자는 자신의 브랜드와 요구에 맞는 UI를 만들 수 있습니다.   

- zustand   
Zustand는 React 애플리케이션에서 상태 관리를 간편하게 할 수 있도록 도와주는 경량 상태 관리 라이브러리입니다. Zustand는 "상태"와 "작업"을 간단하게   
정의 할 수있는 API를 제공하여, 복잡한 상태 관리 로직을 쉽게 구현할 수 있도록 돕습니다.   

- clerk   
Clerk는 개발자가 애플리케이션에 사용자 인증 및 관리 기능을 쉽게 통합할 수 있도록 도와주는 서비스입니다. 주로 웹 애플리케이션에서 사용되며,   
사용자 관리, 세션 관리, 보안, 프론트엔드 및 백엔드 통합, 간편한 인증(구글, 페이스북 등)을 제공합니다.   

- lucid-react   
Lucid-react는 React 기반의 UI 컴포넌트 라이브러리로, 깔끔하고 현대적인 디자인의 UI 요소들을 제공합니다. 주로 데이터 시각화, 대시보드, 사용자 인터페이스   
구성 요소를 쉽게 만들 수 있도록 도와줍니다.   

- useMutation   
useMutation은 React의 훅 중 하나로, 서버에 데이터를 전송하거나 변경하는 요청을 처리하는 데 사용됩니다.   
일반적으로 GraphQL과 함께 사용되며, 클라이언트와 서버 간의 데이터 상호작용을 쉽게 해줍니다.  

- Edge store   
Edgestore은 클라우드 기반의 데이터 저장 및 관리 솔루션을 제공합니다.   


## 🔍주요 기능   
[회원가입 및 로그인]   

Clerk를 사용하여 회원가입 및 로그인 기능을 구현했습니다.   

<details>
  <summary>
  View Code
  </summary>

  ```js
  import { SignInButton, SignOutButton, useAuth, UserButton } from "@clerk/clerk-react";

  <SignInButton mode="modal">
    <Button variant="ghost" size="sm">
      Login
    </Button>
  </SignInButton>
  <SignInButton mode="modal">
    <Button size="sm">
      Get Zotion free
    </Button>
  </SignInButton>
  ```
</details>   

</br>

[노트 생성]   

useMutation 훅에서 가져온 create 함수를 이용해 새로운 문서를 생성합니다.   
문서 생성이 성공적으로 완료되면 새로운 문서 페이지로 리디렉션 합니다.   

<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  const onCreate = () => {
    const promise = create({ title: "Untitled" })
      .then((documentId) => router.push(`/documents/${documentId}`))

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note"
    });
  };

  <h2 className="text-lg font-medium">
    Welcome to {user?.firstName}&apos;s Zotion
  </h2>
  <Button onClick={onCreate}>
    <PlusCircle className="h-4 w-4 mr-2" />
    Create a note
  </Button>
  ```
</details>

</br>

[커버 이미지 추가 기능]   

Edgestore 저장소를 이용해 커버 이미지를 구현했습니다.   


<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  const useCoverImage = create<CoverImageStore>((set) => ({
    url: undefined,
    isOpen: false,
    onOpen: () => set({ isOpen: true, url: undefined }),
    onClose: () => set({ isOpen: false, url: undefined }),
    onReplace: (url: string) => set({ isOpen: true, url })
  }));        

  const coverImage = useCoverImage();

  <Button
    onClick={coverImage.onOpen}
    className="text-muted-foreground text-xs"
    variant="outline"
    size="sm"
  >
    <ImageIcon className="h-4 w-4 mr-2" />
    Add cover
  </Button>
  ```
</details>   

</br>   

[노트 블럭]   

Noteblock 라이브러리를 이용해 텍스트 기능을 간단하게 구현   

<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  (@/components/editor.tsx)

  "use client";

  import { useTheme } from "next-themes";
  import {
    BlockNoteEditor,
    PartialBlock
  } from "@blocknote/core";
  import {
    BlockNoteView,
    useBlockNote,
  } from "@blocknote/react";
  import "@blocknote/core/style.css";

  import { useEdgeStore } from "@/lib/edgestore";

  interface EditorProps {
    onChange: (value: string) => void;
    initialContent?: string;
    editable?: boolean;
  };

  export const Editor = ({
    onChange,
    initialContent,
    editable
  }: EditorProps) => {
    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    const handleUpload = async (file: File) => {
      const response = await edgestore.publicFiles.upload({
        file
      });

      return response.url;
    }

    const editor: BlockNoteEditor = useBlockNote({
      editable,
      initialContent:
        initialContent
          ? JSON.parse(initialContent) as PartialBlock[]
          : undefined,
      onEditorContentChange: (editor) => {
        onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
      },
      uploadFile: handleUpload,
    })

    return (
      <div>
        <BlockNoteView
          editor={editor}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
        />
      </div>
    )
  }

  export default Editor;
  ```   

  공식 문서를 참조해 손쉽게 구현 가능합니다.   
</details>   

[Publish 기능]   

<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  <Publish initialData={document} />   

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    })
      .finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note published",
      error: "Failed to publish note.",
    });
  };

  <Button
    size="sm"
    className="w-full text-xs"
    disabled={isSubmitting}
    onClick={onUnpublish}
  >
    Unpublish
  </Button>
  ```
</details>   

## 😋트러블슈팅   

<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  `[Error: UNKNOWN: unknown error, o
  pen 'C:\Users\[user]\Documents\notio
  n-clone\.next\static\chunks\app\(
  main)\layout.js'] {
    errno: -4094,
    code: 'UNKNOWN',
    syscall: 'open',
  s\\notion-clone\\.next\\static\\c
  hunks\\app\\(main)\\layout.js'   
  }`
  ```

- 문제 원인   
운영체제 문제, 캐시 문제   

- 문제 해결   
1. 프로젝트의 노드js 프로세스를 모두 종료   
2. vscode를 종료하고 다시 실행    
3. .next 폴더 삭제   
4. `npm cache clear --force` 실행
5. vscode를 종료하고 다시 실행   
6. `npm run dev` 실행   

</details>   

<details>
  <summary>
  View Code
  </summary>   
  
  ```js
  `EdgeStoreError: Failed to parse response. Make sure the api is correctly configured at http://localhost:3000/api/edgestore/init`  
  ```   

  - 문제 원인
  운영체제 문제   

  - 문제 해결   
  운영체제 재설치   
</details>

원인 및 해결방법: 버전을 0.1.4로 바꾸면 해결

## 📎사이트   
상태 관리 - [convex](https://www.convex.dev/)   
로그인 - [clerk](https://clerk.com/)   
배포 - [vercel](https://vercel.com/)   
참고 사이트 - [Fullstack Notion Clone: Next.js 13, React, Convex, Tailwind | Full Course 2023](https://www.youtube.com/watch?v=0OaDyjB9Ib8)   

## 📘스택   
<div>
  <a href="#"><img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=Next.js&logoColor=white"></a>
  <a href="#"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind CSS-06B6D4?logo=Tailwind CSS&logoColor=white"></a>
  <a href="#"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=white"></a>
  <a href="#"><img alt="Clerk" src="https://img.shields.io/badge/Clerk-6C47FF?logo=Clerk&logoColor=white"></a>
  <a href="#"><img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?logo=Vercel&logoColor=white"></a>
  <a href="#"><img alt="Radix UI" src="https://img.shields.io/badge/Radix UI-161618?logo=Radix UI&logoColor=white"></a>
</div>
