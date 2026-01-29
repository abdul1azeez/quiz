// import React from 'react';
// import {
//     useEditor,
//     EditorContent,
// } from '@tiptap/react';

// import StarterKit from '@tiptap/starter-kit';
// import Heading from '@tiptap/extension-heading';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import CodeBlock from '@tiptap/extension-code-block';
// import Blockquote from '@tiptap/extension-blockquote';
// import Placeholder from '@tiptap/extension-placeholder';
// import BulletList from '@tiptap/extension-bullet-list';
// import OrderedList from '@tiptap/extension-ordered-list';
// import ListItem from '@tiptap/extension-list-item';
// import Underline from '@tiptap/extension-underline';

// import { Undo2, Redo2, Bold, Italic, Strikethrough, Code, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Quote, MoreVertical } from 'lucide-react';

// export default function RichTextEditor() {

//     const editor = useEditor({
//         extensions: [
//             StarterKit.configure({}),
//             Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
//             Link.configure({
//                 openOnClick: true,
//                 autolink: true,
//                 HTMLAttributes: { class: 'text-blue-500 underline' },
//             }),
//             Image.configure({ inline: false }),
//             CodeBlock.configure(),
//             Blockquote.configure(),
//             BulletList.configure(),
//             OrderedList.configure(),
//             ListItem,
//             Underline,
//             Placeholder.configure({
//                 placeholder: 'Write your post content here...',
//             }),
//         ],
//         content: `
//       <h1>Post Title</h1>
//       <h3>Subtitle goes here</h3>
//       <p>Start writing your article...</p>
//     `,
//     });

//     if (!editor) return null;

//     return (
//         <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200">
//             {/* Toolbar */}
//             <div className="toolbar flex flex-wrap gap-2 border-b border-gray-300 pb-3 mb-3 items-center">

//                 {/* Undo/Redo */}
//                 <button onClick={() => editor.chain().focus().undo().run()}><Undo2 /></button>
//                 <button onClick={() => editor.chain().focus().redo().run()}><Redo2 /></button>

//                 {/* Heading dropdown */}
//                 <select
//                     onChange={(e) => {
//                         const level = e.target.value === 'paragraph' ? null : parseInt(e.target.value);
//                         editor.chain().focus().setParagraph().run();
//                         if (level) editor.chain().focus().toggleHeading({ level }).run();
//                     }}
//                     className="border rounded px-2 py-1"
//                 >
//                     <option value="paragraph">Paragraph</option>
//                     {[1, 2, 3, 4, 5, 6].map((lvl) => (
//                         <option key={lvl} value={lvl}>Heading {lvl}</option>
//                     ))}
//                 </select>

//                 {/* Basic formatting */}
//                 <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold' : ''}><Bold /></button>
//                 <button onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></button>
//                 <button onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough /></button>
//                 <button onClick={() => editor.chain().focus().toggleCode().run()}><Code /></button>

//                 {/* Links & Media */}
//                 <button onClick={() => {
//                     const url = prompt('Enter link URL');
//                     if (url) editor.chain().focus().setLink({ href: url }).run();
//                 }}><LinkIcon /></button>

//                 <button onClick={() => {
//                     const url = prompt('Enter image URL');
//                     if (url) editor.chain().focus().setImage({ src: url }).run();
//                 }}><ImageIcon /></button>

//                 {/* Lists */}
//                 <button onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></button>
//                 <button onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></button>

//                 {/* Quote */}
//                 <button onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></button>

//                 {/* Button dropdown */}
//                 <div className="relative group">
//                     <button className="border rounded px-2 py-1 flex items-center gap-1">Buttons <MoreVertical size={16} /></button>
//                     <div className="absolute hidden group-hover:flex flex-col bg-white border rounded shadow-md p-2 z-50 w-52 text-sm">
//                         {['Subscribe', 'Subscribe w/ caption', 'Share post', 'Share post w/ caption', 'Share publication', 'Leave a comment', 'Send a message', 'Custom...', 'More...', 'Get the app', 'Refer a writer', 'Link to survey'].map((label) => (
//                             <button
//                                 key={label}
//                                 onClick={() => editor.chain().focus().insertContent(`<button class="bg-blue-600 text-white rounded px-3 py-1">${label}</button>`).run()}
//                                 className="hover:bg-gray-100 text-left px-2 py-1"
//                             >
//                                 {label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* More dropdown */}
//                 <div className="relative group">
//                     <button className="border rounded px-2 py-1 flex items-center gap-1">More <MoreVertical size={16} /></button>
//                     <div className="absolute hidden group-hover:flex flex-col bg-white border rounded shadow-md p-2 z-50 w-60 text-sm">
//                         {[
//                             { name: 'Code block', action: () => editor.chain().focus().toggleCodeBlock().run() },
//                             { name: 'Divider', action: () => editor.chain().focus().setHorizontalRule().run() },
//                             { name: 'Financial chart', action: () => editor.chain().focus().insertContent('<div>[Financial Chart]</div>').run() },
//                             { name: 'Footnote', action: () => editor.chain().focus().insertContent('<sup>[1]</sup>').run() },
//                             { name: 'LaTeX', action: () => editor.chain().focus().insertContent('<div>$x^2 + y^2 = z^2$</div>').run() },
//                             { name: 'Poetry', action: () => editor.chain().focus().insertContent('<pre class="font-serif whitespace-pre">Poetry block...</pre>').run() },
//                             { name: 'Poll', action: () => editor.chain().focus().insertContent('<div>[Poll Component]</div>').run() },
//                         ].map((item) => (
//                             <button
//                                 key={item.name}
//                                 onClick={item.action}
//                                 className="hover:bg-gray-100 text-left px-2 py-1"
//                             >
//                                 {item.name}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Title + Subtitle */}
//             <input
//                 type="text"
//                 placeholder="Title"
//                 className="w-full text-3xl font-bold focus:outline-none"
//             />
//             <input
//                 type="text"
//                 placeholder="Subtitle"
//                 className="w-full text-xl text-gray-500 focus:outline-none"
//             />

//             {/* Editor */}
//             <div className="prose max-w-none min-h-[400px] focus:outline-none">
//                 <EditorContent editor={editor} />
//             </div>
//         </div>
//     );
// }

//-------- Hassan's Version ---------
// import React from 'react';
// import {
//     useEditor,
//     EditorContent,
// } from '@tiptap/react';

// import StarterKit from '@tiptap/starter-kit';
// import Heading from '@tiptap/extension-heading';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import CodeBlock from '@tiptap/extension-code-block';
// import Blockquote from '@tiptap/extension-blockquote';
// import Placeholder from '@tiptap/extension-placeholder';
// import BulletList from '@tiptap/extension-bullet-list';
// import OrderedList from '@tiptap/extension-ordered-list';
// import ListItem from '@tiptap/extension-list-item';
// import Underline from '@tiptap/extension-underline';

// import {
//     Undo2, Redo2, Bold, Italic, Strikethrough, Code,
//     Link as LinkIcon, Image as ImageIcon, List,
//     ListOrdered, Quote, MoreVertical
// } from 'lucide-react';

// export default function RichTextEditor() {

//     // ----------------------
//     // FORM STATE
//     // ----------------------
//     const [title, setTitle] = React.useState("");
//     const [subtitle, setSubtitle] = React.useState("");
//     const [sectionId, setSectionId] = React.useState("YOUR_SECTION_ID");
//     const [published, setPublished] = React.useState(false);

//     const yourJWTtoken = "REPLACE_WITH_JWT";

//     // ----------------------
//     // TIPTAP EDITOR
//     // ----------------------
//     const editor = useEditor({
//         extensions: [
//             StarterKit.configure({}),
//             Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
//             Link.configure({
//                 openOnClick: true,
//                 autolink: true,
//                 HTMLAttributes: { class: 'text-blue-500 underline' },
//             }),
//             Image.configure({ inline: false }),
//             CodeBlock.configure(),
//             Blockquote.configure(),
//             BulletList.configure(),
//             OrderedList.configure(),
//             ListItem,
//             Underline,
//             Placeholder.configure({
//                 placeholder: 'Write your post content here...',
//             }),
//         ],
//         content: `
//             <h1>Post Title</h1>
//             <h3>Subtitle goes here</h3>
//             <p>Start writing your article...</p>
//         `,
//     });

//     if (!editor) return null;

//     // ----------------------
//     // SAVE / PUBLISH HANDLERS
//     // ----------------------
//     const createContent = async (publishState) => {
//         const body = editor.getHTML();

//         try {
//             const res = await fetch("/api/content", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${yourJWTtoken}`
//                 },
//                 body: JSON.stringify({
//                     title,
//                     subtitle,
//                     sectionId,
//                     body,
//                     published: publishState
//                 })
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 alert("Error: " + (data?.message || "Failed to create content"));
//                 console.error("ERROR:", data);
//                 return;
//             }

//             alert(publishState ? "Published successfully!" : "Draft saved!");
//             console.log("Created:", data);

//         } catch (err) {
//             console.error(err);
//             alert("Network error");
//         }
//     };

//     const handleSaveDraft = () => createContent(false);
//     const handlePublish = () => createContent(true);

//     // ----------------------
//     // COMPONENT UI
//     // ----------------------
//     return (
//         <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-200">

//             {/* Toolbar */}
//             <div className="toolbar flex flex-wrap gap-2 border-b border-gray-300 pb-3 mb-3 items-center">

//                 <button onClick={() => editor.chain().focus().undo().run()}><Undo2 /></button>
//                 <button onClick={() => editor.chain().focus().redo().run()}><Redo2 /></button>

//                 <select
//                     onChange={(e) => {
//                         const level = e.target.value === 'paragraph' ? null : parseInt(e.target.value);
//                         editor.chain().focus().setParagraph().run();
//                         if (level) editor.chain().focus().toggleHeading({ level }).run();
//                     }}
//                     className="border rounded px-2 py-1"
//                 >
//                     <option value="paragraph">Paragraph</option>
//                     {[1, 2, 3, 4, 5, 6].map((lvl) => (
//                         <option key={lvl} value={lvl}>Heading {lvl}</option>
//                     ))}
//                 </select>

//                 <button onClick={() => editor.chain().focus().toggleBold().run()}>
//                     <Bold />
//                 </button>
//                 <button onClick={() => editor.chain().focus().toggleItalic().run()}>
//                     <Italic />
//                 </button>
//                 <button onClick={() => editor.chain().focus().toggleStrike().run()}>
//                     <Strikethrough />
//                 </button>
//                 <button onClick={() => editor.chain().focus().toggleCode().run()}>
//                     <Code />
//                 </button>

//                 <button
//                     onClick={() => {
//                         const url = prompt("Enter link URL");
//                         if (url) editor.chain().focus().setLink({ href: url }).run();
//                     }}
//                 >
//                     <LinkIcon />
//                 </button>

//                 <button
//                     onClick={() => {
//                         const url = prompt("Enter image URL");
//                         if (url) editor.chain().focus().setImage({ src: url }).run();
//                     }}
//                 >
//                     <ImageIcon />
//                 </button>

//                 <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
//                     <List />
//                 </button>
//                 <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
//                     <ListOrdered />
//                 </button>

//                 <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
//                     <Quote />
//                 </button>

//                 {/* Buttons dropdown */}
//                 <div className="relative group">
//                     <button className="border rounded px-2 py-1 flex items-center gap-1">
//                         Buttons <MoreVertical size={16} />
//                     </button>
//                     <div className="absolute hidden group-hover:flex flex-col bg-white border rounded shadow-md p-2 z-50 w-52 text-sm">
//                         {[
//                             'Subscribe', 'Subscribe w/ caption', 'Share post',
//                             'Share post w/ caption', 'Share publication',
//                             'Leave a comment', 'Send a message', 'Custom...',
//                             'More...', 'Get the app', 'Refer a writer', 'Link to survey'
//                         ].map((label) => (
//                             <button
//                                 key={label}
//                                 onClick={() =>
//                                     editor.chain().focus().insertContent(
//                                         `<button class="bg-blue-600 text-white rounded px-3 py-1">${label}</button>`
//                                     ).run()
//                                 }
//                                 className="hover:bg-gray-100 text-left px-2 py-1"
//                             >
//                                 {label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* More menu */}
//                 <div className="relative group">
//                     <button className="border rounded px-2 py-1 flex items-center gap-1">
//                         More <MoreVertical size={16} />
//                     </button>
//                     <div className="absolute hidden group-hover:flex flex-col bg-white border rounded shadow-md p-2 z-50 w-60 text-sm">
//                         {[
//                             { name: 'Code block', action: () => editor.chain().focus().toggleCodeBlock().run() },
//                             { name: 'Divider', action: () => editor.chain().focus().setHorizontalRule().run() },
//                             { name: 'Financial chart', action: () => editor.chain().focus().insertContent('<div>[Financial Chart]</div>').run() },
//                             { name: 'Footnote', action: () => editor.chain().focus().insertContent('<sup>[1]</sup>').run() },
//                             { name: 'LaTeX', action: () => editor.chain().focus().insertContent('<div>$x^2 + y^2 = z^2$</div>').run() },
//                             { name: 'Poetry', action: () => editor.chain().focus().insertContent('<pre class="font-serif whitespace-pre">Poetry block...</pre>').run() },
//                             { name: 'Poll', action: () => editor.chain().focus().insertContent('<div>[Poll Component]</div>').run() },
//                         ].map((item) => (
//                             <button
//                                 key={item.name}
//                                 onClick={item.action}
//                                 className="hover:bg-gray-100 text-left px-2 py-1"
//                             >
//                                 {item.name}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Title + Subtitle */}
//             <input
//                 type="text"
//                 placeholder="Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full text-3xl font-bold focus:outline-none"
//             />

//             <input
//                 type="text"
//                 placeholder="Subtitle"
//                 value={subtitle}
//                 onChange={(e) => setSubtitle(e.target.value)}
//                 className="w-full text-xl text-gray-500 focus:outline-none"
//             />

//             {/* ACTION BUTTONS */}
//             <div className="flex gap-4">
//                 <button
//                     onClick={handleSaveDraft}
//                     className="px-4 py-2 bg-gray-200 rounded-lg"
//                 >
//                     Save Draft
//                 </button>

//                 <button
//                     onClick={handlePublish}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg"
//                 >
//                     Publish
//                 </button>
//             </div>

//             {/* Editor */}
//             <div className="prose max-w-none min-h-[400px] focus:outline-none">
//                 <EditorContent editor={editor} />
//             </div>
//         </div>
//     );
// }


import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

import { 
  Undo2, Redo2, Bold, Italic, Strikethrough, Code, 
  Link as LinkIcon, Image as ImageIcon, Quote, 
  List, ListOrdered, ChevronLeft, ChevronDown, Plus, X 
} from 'lucide-react';

export default function RichTextEditor({ value, onChange }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // We configure heading manually below
        codeBlock: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: { class: 'text-blue-500 underline cursor-pointer' },
      }),
      Image.configure({ inline: false }),
      CodeBlock,
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: '',
    editorProps: {
        attributes: {
            class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px]',
        },
    },
  });
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor]);

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 1. TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Saved</span>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                Preview
            </button>
            <button className="px-4 py-2 bg-[#FF6719] text-white font-medium rounded-lg hover:bg-[#e55a14] transition-colors">
                Continue
            </button>
        </div>
      </nav>

      <div className="max-w-[720px] mx-auto pt-8 pb-20 px-4">
        
        {/* 2. TOOLBAR */}
        <div className="flex flex-wrap items-center gap-1 mb-8 pb-3 border-b border-gray-100 text-gray-600 sticky top-20 bg-white z-40">
            
            {/* History */}
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"><Undo2 size={18} /></button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"><Redo2 size={18} /></button>
            
            <div className="w-px h-5 bg-gray-200 mx-2"></div>

            {/* Styles Dropdown */}
            <div className="relative group flex items-center">
                {/* <select 
                    className="appearance-none bg-transparent hover:bg-gray-100 pl-2 pr-6 py-1 rounded cursor-pointer text-sm font-medium focus:outline-none"
                    onChange={(e) => {
                        const val = e.target.value;
                        if(val === 'p') editor.chain().focus().setParagraph().run();
                        else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
                    }}
                    value={editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : 'p'}
                >
                    <option value="p">Normal text</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                    <option value="3">Heading 4</option>
                    <option value="3">Heading 5</option>
                    <option value="3">Heading 6</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 pointer-events-none text-gray-400" /> */}
                <select
          onChange={(e) => {
            const lvl = e.target.value;
            if (lvl === "paragraph") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: Number(lvl) }).run();
          }}
          className="border rounded px-2 py-1"
        >
          <option value="paragraph">Paragraph</option>
          {[1, 2, 3, 4, 5, 6].map((l) => (
            <option key={l} value={l}>Heading {l}</option>
          ))}
        </select>
            </div>

            <div className="w-px h-5 bg-gray-200 mx-2"></div>

            {/* Formatting */}
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('bold') ? 'bg-gray-100 text-black' : ''}`}><Bold size={18} /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('italic') ? 'bg-gray-100 text-black' : ''}`}><Italic size={18} /></button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('strike') ? 'bg-gray-100 text-black' : ''}`}><Strikethrough size={18} /></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('underline') ? 'bg-gray-100 text-black' : ''}`}><span className="underline font-bold">U</span></button>
            
            {/* Code Block */}
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('codeBlock') ? 'bg-gray-100 text-black' : ''}`}><Code size={18} /></button>

            <div className="w-px h-5 bg-gray-200 mx-2"></div>

            {/* Inserts */}
            <button onClick={setLink} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('link') ? 'bg-gray-100 text-black' : ''}`}><LinkIcon size={18} /></button>
            <button onClick={addImage} className="p-2 hover:bg-gray-100 rounded"><ImageIcon size={18} /></button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('blockquote') ? 'bg-gray-100 text-black' : ''}`}><Quote size={18} /></button>

            <div className="w-px h-5 bg-gray-200 mx-2"></div>

            {/* Lists */}
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('bulletList') ? 'bg-gray-100 text-black' : ''}`}><List size={18} /></button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 hover:bg-gray-100 rounded ${editor.isActive('orderedList') ? 'bg-gray-100 text-black' : ''}`}><ListOrdered size={18} /></button>
        </div>

        {/* 3. CONTENT AREA */}
        <div className="space-y-4">
            {/* Title */}
            <input 
                type="text" 
                placeholder="Title" 
                className="w-full text-5xl font-serif font-bold text-gray-800 placeholder-gray-300 border-none outline-none focus:ring-0 p-0 bg-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            
            {/* Subtitle */}
            <input 
                type="text" 
                placeholder="Add a subtitle..." 
                className="w-full text-xl text-gray-500 font-serif placeholder-gray-400 border-none outline-none focus:ring-0 p-0 bg-transparent"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
            />

            {/* Author Pill (Hardcoded) */}
            <div className="flex items-center gap-2 py-4">
                <div className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full pl-3 pr-1 py-1 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Suhail</span>
                    <button className="p-0.5 hover:bg-gray-300 rounded-full text-gray-500">
                        <X size={14} />
                    </button>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Plus size={20} />
                </button>
            </div>

            {/* Editor Content */}
            <div className="min-h-[500px]">
                <EditorContent editor={editor} />
            </div>
        </div>
      </div>
    </div>
  );
}










// import React, { useCallback, useEffect } from "react";
// import { EditorContent, useEditor } from "@tiptap/react";

// import StarterKit from "@tiptap/starter-kit";
// import Heading from "@tiptap/extension-heading";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import CodeBlock from "@tiptap/extension-code-block";
// import Blockquote from "@tiptap/extension-blockquote";
// import Placeholder from "@tiptap/extension-placeholder";
// import BulletList from "@tiptap/extension-bullet-list";
// import OrderedList from "@tiptap/extension-ordered-list";
// import ListItem from "@tiptap/extension-list-item";
// import Underline from "@tiptap/extension-underline";

// export default function RichTextEditor({ value, onChange }) {

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
//       Link.configure({ openOnClick: true, autolink: true }),
//       Image,
//       CodeBlock,
//       Blockquote,
//       BulletList,
//       OrderedList,
//       ListItem,
//       Underline,
//       Placeholder.configure({
//         placeholder: "Write your story...",
//       }),
//     ],
//     autofocus: false,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//     editorProps: {
//       attributes: {
//         class:
//           "prose max-w-none focus:outline-none min-h-[300px] text-lg leading-relaxed",
//       },
//     },
//   });

  // useEffect(() => {
  //   if (editor && value && editor.getHTML() !== value) {
  //     editor.commands.setContent(value);
  //   }
  // }, [editor]);

//   const addImage = useCallback(() => {
//     const url = window.prompt("Image URL:");
//     if (url) editor.chain().focus().setImage({ src: url }).run();
//   }, [editor]);

//   if (!editor) return null;

//   return (
//     <div className="p-4 border rounded-xl shadow-sm bg-white space-y-4">

//       {/* Toolbar */}
//       <div className="flex items-center gap-2 border-b pb-3 mb-3 flex-wrap">
        
//         <button type="button" onClick={() => editor.chain().focus().undo().run()}>↶</button>
//         <button type="button" onClick={() => editor.chain().focus().redo().run()}>↷</button>

// <select
//   onChange={(e) => {
//     const lvl = e.target.value;
//     if (lvl === "paragraph") editor.chain().focus().setParagraph().run();
//     else editor.chain().focus().toggleHeading({ level: Number(lvl) }).run();
//   }}
//   className="border rounded px-2 py-1"
// >
//   <option value="paragraph">Paragraph</option>
//   {[1, 2, 3, 4, 5, 6].map((l) => (
//     <option key={l} value={l}>Heading {l}</option>
//   ))}
// </select>

//         <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
//         <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
//         <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
//         <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>

//         <button type="button" onClick={() => editor.chain().focus().toggleCode().run()}>
//           {"</>"}
//         </button>

//         <button
//           type="button"
//           onClick={() => {
//             const url = prompt("Enter link URL");
//             if (url) editor.chain().focus().setLink({ href: url }).run();
//           }}
//         >
//           Link
//         </button>

//         <button type="button" onClick={addImage}>Image</button>

//         <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
//           • List
//         </button>

//         <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
//           1.
//         </button>

//         <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
//           ❝
//         </button>
//       </div>

//       {/* Editor Area */}
//       <div className="border rounded-lg p-6 min-h-[300px]">
//         <EditorContent editor={editor} />
//       </div>
//     </div>
//   );
// }
