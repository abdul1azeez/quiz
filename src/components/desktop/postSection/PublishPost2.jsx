// import { useState } from "react";
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';

// import { EditorContent, useEditor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';


// import PublishPostNavbar from "../Navbar/PublishPostNavbar"

// const PublishPost = () => {
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");

//     const editor = useEditor({
//     extensions: [StarterKit],
//     content: '<p>Hello world!</p>',
//   });

//     const modules = {
//         toolbar: [
//             [{ header: [1, 2, 3, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             ["blockquote", "code-block"],
//             ["clean"],
//         ],
//     };

//     const handleImageUpload = () => {
//         // optional: custom image handler here
//     };

//     const formats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "blockquote",
//         "code-block",
//         "link",
//         "image",
//     ];

//     return (
//         <div className="w-full flex flex-col gap-2 items-center justify-center">
//             <PublishPostNavbar />
//             <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
//                 {/* Title Input */}
//                 <input
//                     type="text"
//                     placeholder="Enter title..."
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="p-3 border border-gray-300 rounded-lg font-bold text-xl"
//                 />

//                 {/* Rich Text Editor */}
//                 <ReactQuill
//                     value={content}
//                     onChange={setContent}
//                     modules={modules}
//                     formats={formats}
//                     theme="snow"
//                     className="bg-white rounded-lg"
//                 />

//                 <button
//                     onClick={() => console.log({ title, content })}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg self-end"
//                 >
//                     Save Post
//                 </button>
//             </div>

//             <EditorContent editor={editor} />
//         </div>
//     );
// }

// export default PublishPost



// import { useState, useRef, useCallback } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Link from '@tiptap/extension-link';
// import Image from '@tiptap/extension-image';
// import Placeholder from '@tiptap/extension-placeholder';
// import TextAlign from '@tiptap/extension-text-align';
// import Underline from '@tiptap/extension-underline';
// import {
//     Undo, Redo, Bold, Italic, Strikethrough, Code,
//     Link2, Image as ImageIcon, Mic, Video, Quote,
//     List, ListOrdered, ChevronDown, IndentDecrease, IndentIncrease,
//     Plus, MoreHorizontal, Type, X, Upload, Search, Play, Square
// } from 'lucide-react';
// import PublishPostNavbar from '../Navbar/PublishPostNavbar';

// // Custom Button Extension
// const CustomButton = {
//     name: 'customButton',
//     group: 'block',
//     content: 'inline*',
//     parseHTML() {
//         return [{ tag: 'button[data-type="custom-button"]' }];
//     },
//     renderHTML({ HTMLAttributes }) {
//         return ['button', { ...HTMLAttributes, 'data-type': 'custom-button', class: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer' }, 0];
//     },
// };

// // Custom extensions for special content
// const AudioEmbed = {
//     name: 'audioEmbed',
//     group: 'block',
//     atom: true,
//     parseHTML() {
//         return [{ tag: 'audio[data-type="audio-embed"]' }];
//     },
//     renderHTML({ HTMLAttributes }) {
//         return ['audio', { ...HTMLAttributes, 'data-type': 'audio-embed', controls: true, class: 'w-full my-4' }];
//     },
// };

// const VideoEmbed = {
//     name: 'videoEmbed',
//     group: 'block',
//     atom: true,
//     parseHTML() {
//         return [{ tag: 'video[data-type="video-embed"]' }];
//     },
//     renderHTML({ HTMLAttributes }) {
//         return ['video', { ...HTMLAttributes, 'data-type': 'video-embed', controls: true, class: 'w-full my-4 max-h-96' }];
//     },
// };

// const Divider = {
//     name: 'divider',
//     group: 'block',
//     parseHTML() {
//         return [{ tag: 'hr' }];
//     },
//     renderHTML() {
//         return ['hr', { class: 'my-4 border-gray-300' }];
//     },
// };

// const Poll = {
//     name: 'poll',
//     group: 'block',
//     content: 'block+',
//     parseHTML() {
//         return [{ tag: 'div[data-type="poll"]' }];
//     },
//     renderHTML({ HTMLAttributes }) {
//         return ['div', { ...HTMLAttributes, 'data-type': 'poll', class: 'border-2 border-blue-400 rounded p-4 my-4 bg-blue-50' }, 0];
//     },
// };

// const Poetry = {
//     name: 'poetry',
//     group: 'block',
//     content: 'text*',
//     parseHTML() {
//         return [{ tag: 'pre[data-type="poetry"]' }];
//     },
//     renderHTML({ HTMLAttributes }) {
//         return ['pre', { ...HTMLAttributes, 'data-type': 'poetry', class: 'whitespace-pre-wrap font-serif italic my-4 p-4 bg-gray-50' }, 0];
//     },
// };

// const PublishPost = () => {
//     const [title, setTitle] = useState('');
//     const [subtitle, setSubtitle] = useState('');
//     const [showLinkDialog, setShowLinkDialog] = useState(false);
//     const [showImageDialog, setShowImageDialog] = useState(false);
//     const [showAudioDialog, setShowAudioDialog] = useState(false);
//     const [showVideoDialog, setShowVideoDialog] = useState(false);
//     const [showButtonDialog, setShowButtonDialog] = useState(false);
//     const [showUnsplashDialog, setShowUnsplashDialog] = useState(false);
//     const [showPollDialog, setShowPollDialog] = useState(false);

//     const [linkUrl, setLinkUrl] = useState('');
//     const [linkText, setLinkText] = useState('');
//     const [linkNewTab, setLinkNewTab] = useState(false);

//     const [unsplashQuery, setUnsplashQuery] = useState('');
//     const [unsplashResults, setUnsplashResults] = useState([]);
//     const [unsplashLoading, setUnsplashLoading] = useState(false);

//     const [recording, setRecording] = useState(false);
//     const [videoRecording, setVideoRecording] = useState(false);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const videoPreviewRef = useRef(null);

//     const [pollQuestion, setPollQuestion] = useState('');
//     const [pollOptions, setPollOptions] = useState(['', '']);

//     const [textStyleDropdown, setTextStyleDropdown] = useState(false);
//     const [buttonDropdown, setButtonDropdown] = useState(false);
//     const [moreDropdown, setMoreDropdown] = useState(false);

//     const editor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 heading: {
//                     levels: [1, 2, 3, 4, 5, 6],
//                 },
//             }),
//             Link.configure({
//                 openOnClick: false,
//                 HTMLAttributes: {
//                     class: 'text-blue-600 underline cursor-pointer',
//                 },
//             }),
//             Image.configure({
//                 HTMLAttributes: {
//                     class: 'max-w-full h-auto rounded my-4',
//                 },
//             }),
//             Underline,
//             TextAlign.configure({
//                 types: ['heading', 'paragraph'],
//             }),
//             Placeholder.configure({
//                 placeholder: 'Start writing your content here...',
//             }),
//         ],
//         content: '',
//         editorProps: {
//             attributes: {
//                 class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] px-4 py-2',
//             },
//         },
//     });

//     // Unsplash API search
//     const searchUnsplash = async () => {
//         if (!unsplashQuery.trim()) return;

//         setUnsplashLoading(true);
//         try {
//             // Replace YOUR_ACCESS_KEY with actual Unsplash access key
//             const response = await fetch(
//                 `https://api.unsplash.com/search/photos?query=${encodeURIComponent(unsplashQuery)}&per_page=12`,
//                 {
//                     headers: {
//                         Authorization: 'Client-ID YOUR_UNSPLASH_ACCESS_KEY',
//                     },
//                 }
//             );
//             const data = await response.json();
//             setUnsplashResults(data.results || []);
//         } catch (error) {
//             console.error('Unsplash search error:', error);
//             alert('Error searching Unsplash. Please check your API key.');
//         }
//         setUnsplashLoading(false);
//     };

//     const insertUnsplashImage = (url) => {
//         if (editor) {
//             editor.chain().focus().setImage({ src: url }).run();
//             setShowUnsplashDialog(false);
//             setUnsplashQuery('');
//             setUnsplashResults([]);
//         }
//     };

//     // Voice recording
//     const startVoiceRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             mediaRecorderRef.current = new MediaRecorder(stream);
//             chunksRef.current = [];

//             mediaRecorderRef.current.ondataavailable = (e) => {
//                 chunksRef.current.push(e.data);
//             };

//             mediaRecorderRef.current.onstop = () => {
//                 const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
//                 const url = URL.createObjectURL(blob);
//                 insertAudio(url);
//                 stream.getTracks().forEach(track => track.stop());
//             };

//             mediaRecorderRef.current.start();
//             setRecording(true);
//         } catch (error) {
//             console.error('Error accessing microphone:', error);
//             alert('Could not access microphone');
//         }
//     };

//     const stopVoiceRecording = () => {
//         if (mediaRecorderRef.current && recording) {
//             mediaRecorderRef.current.stop();
//             setRecording(false);
//         }
//     };

//     // Video recording
//     const startVideoRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             if (videoPreviewRef.current) {
//                 videoPreviewRef.current.srcObject = stream;
//                 videoPreviewRef.current.play();
//             }

//             mediaRecorderRef.current = new MediaRecorder(stream);
//             chunksRef.current = [];

//             mediaRecorderRef.current.ondataavailable = (e) => {
//                 chunksRef.current.push(e.data);
//             };

//             mediaRecorderRef.current.onstop = () => {
//                 const blob = new Blob(chunksRef.current, { type: 'video/webm' });
//                 const url = URL.createObjectURL(blob);
//                 insertVideo(url);
//                 stream.getTracks().forEach(track => track.stop());
//                 if (videoPreviewRef.current) {
//                     videoPreviewRef.current.srcObject = null;
//                 }
//             };

//             mediaRecorderRef.current.start();
//             setVideoRecording(true);
//         } catch (error) {
//             console.error('Error accessing camera:', error);
//             alert('Could not access camera');
//         }
//     };

//     const stopVideoRecording = () => {
//         if (mediaRecorderRef.current && videoRecording) {
//             mediaRecorderRef.current.stop();
//             setVideoRecording(false);
//         }
//     };

//     const insertAudio = (url) => {
//         if (editor) {
//             editor.chain().focus().insertContent(`<audio src="${url}" controls data-type="audio-embed" class="w-full my-4"></audio>`).run();
//             setShowAudioDialog(false);
//         }
//     };

//     const insertVideo = (url) => {
//         if (editor) {
//             editor.chain().focus().insertContent(`<video src="${url}" controls data-type="video-embed" class="w-full my-4 max-h-96"></video>`).run();
//             setShowVideoDialog(false);
//         }
//     };

//     const handleImageUpload = (e) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const url = URL.createObjectURL(file);
//             editor?.chain().focus().setImage({ src: url }).run();
//             setShowImageDialog(false);
//         }
//     };

//     const handleAudioUpload = (e) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const url = URL.createObjectURL(file);
//             insertAudio(url);
//         }
//     };

//     const handleVideoUpload = (e) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const url = URL.createObjectURL(file);
//             insertVideo(url);
//         }
//     };

//     const insertLink = () => {
//         if (linkUrl) {
//             const attrs = linkNewTab ? { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' } : { href: linkUrl };

//             if (linkText) {
//                 editor?.chain().focus().insertContent(`<a href="${linkUrl}"${linkNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`).run();
//             } else {
//                 editor?.chain().focus().setLink(attrs).run();
//             }

//             setShowLinkDialog(false);
//             setLinkUrl('');
//             setLinkText('');
//             setLinkNewTab(false);
//         }
//     };

//     const insertButton = (type) => {
//         const buttonTexts = {
//             subscribe: 'Subscribe',
//             subscribeCaption: 'Subscribe',
//             share: 'Share post',
//             shareCaption: 'Share post',
//             sharePublication: 'Share publication',
//             comment: 'Leave a comment',
//             message: 'Send a message',
//             getApp: 'Get the app',
//             refer: 'Refer a writer',
//             survey: 'Link to survey',
//         };

//         const text = buttonTexts[type] || 'Custom Button';
//         editor?.chain().focus().insertContent(`<button data-type="custom-button" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer my-2">${text}</button>`).run();
//         setShowButtonDialog(false);
//         setButtonDropdown(false);
//     };

//     const insertPoll = () => {
//         if (pollQuestion && pollOptions.filter(o => o.trim()).length >= 2) {
//             const optionsHtml = pollOptions.filter(o => o.trim()).map((opt, i) =>
//                 `<div class="flex items-center gap-2 my-2"><input type="radio" name="poll" id="opt${i}"><label for="opt${i}">${opt}</label></div>`
//             ).join('');

//             editor?.chain().focus().insertContent(
//                 `<div data-type="poll" class="border-2 border-blue-400 rounded p-4 my-4 bg-blue-50">
//           <p class="font-bold mb-3">${pollQuestion}</p>
//           ${optionsHtml}
//         </div>`
//             ).run();

//             setShowPollDialog(false);
//             setPollQuestion('');
//             setPollOptions(['', '']);
//         }
//     };

//     const setHeading = (level) => {
//         if (level === 0) {
//             editor?.chain().focus().setParagraph().run();
//         } else {
//             editor?.chain().focus().setHeading({ level }).run();
//         }
//         setTextStyleDropdown(false);
//     };

//     const insertCodeBlock = () => {
//         editor?.chain().focus().setCodeBlock().run();
//         setMoreDropdown(false);
//     };

//     const insertDivider = () => {
//         editor?.chain().focus().setHorizontalRule().run();
//         setMoreDropdown(false);
//     };

//     const insertFootnote = () => {
//         const footnoteNum = Math.floor(Math.random() * 1000);
//         editor?.chain().focus().insertContent(`<sup><a href="#fn${footnoteNum}" id="ref${footnoteNum}">[${footnoteNum}]</a></sup>`).run();
//         setMoreDropdown(false);
//     };

//     const insertLatex = () => {
//         editor?.chain().focus().insertContent('<span class="px-2 py-1 bg-gray-100 font-mono">LaTeX: $E=mc^2$</span>').run();
//         setMoreDropdown(false);
//     };

//     const insertPoetry = () => {
//         editor?.chain().focus().insertContent('<pre data-type="poetry" class="whitespace-pre-wrap font-serif italic my-4 p-4 bg-gray-50">Your poetry here...</pre>').run();
//         setMoreDropdown(false);
//     };

//     const exportContent = () => {
//         if (!editor) return;

//         const html = editor.getHTML();
//         const json = editor.getJSON();

//         console.log('HTML:', html);
//         console.log('JSON:', json);

//         alert('Content exported to console! (HTML & JSON)');
//     };

//     const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
//         <button
//             onClick={onClick}
//             disabled={disabled}
//             title={title}
//             className={`p-2 rounded hover:bg-gray-100 transition-colors ${active ? 'bg-gray-200' : ''
//                 } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//             {children}
//         </button>
//     );

//     const Dropdown = ({ trigger, children, open, setOpen }) => (
//         <div className="relative">
//             <button
//                 onClick={() => setOpen(!open)}
//                 className="flex items-center gap-1 p-2 rounded hover:bg-gray-100"
//             >
//                 {trigger}
//             </button>
//             {open && (
//                 <>
//                     <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
//                     <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-1 z-20 min-w-[200px]">
//                         {children}
//                     </div>
//                 </>
//             )}
//         </div>
//     );

//     if (!editor) return null;

//     const isListActive = editor.isActive('bulletList') || editor.isActive('orderedList');

//     return (
//         <div className="w-full flex flex-col gap-2 items-center justify-center">
//             <PublishPostNavbar />
//             <div className="max-w-5xl mx-auto p-6 bg-white">
//                 <div className="mb-6">
//                     <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         placeholder="Title"
//                         className="w-full text-4xl font-bold border-none outline-none mb-2"
//                     />
//                     <input
//                         type="text"
//                         value={subtitle}
//                         onChange={(e) => setSubtitle(e.target.value)}
//                         placeholder="Subtitle"
//                         className="w-full text-xl text-gray-600 border-none outline-none"
//                     />
//                 </div>

//                 <div className="border rounded-lg">
//                     {/* Toolbar */}
//                     <div className="border-b p-2 flex flex-wrap gap-1 items-center bg-gray-50">
//                         <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
//                             <Undo size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
//                             <Redo size={18} />
//                         </ToolbarButton>

//                         <div className="w-px h-6 bg-gray-300 mx-1" />

//                         <Dropdown
//                             trigger={<><Type size={18} /><ChevronDown size={14} /></>}
//                             open={textStyleDropdown}
//                             setOpen={setTextStyleDropdown}
//                         >
//                             <button onClick={() => setHeading(0)} className="w-full px-4 py-2 text-left hover:bg-gray-100">Paragraph</button>
//                             <button onClick={() => setHeading(1)} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-3xl font-bold">Heading 1</button>
//                             <button onClick={() => setHeading(2)} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-2xl font-bold">Heading 2</button>
//                             <button onClick={() => setHeading(3)} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-xl font-bold">Heading 3</button>
//                             <button onClick={() => setHeading(4)} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-lg font-bold">Heading 4</button>
//                             <button onClick={() => setHeading(5)} className="w-full px-4 py-2 text-left hover:bg-gray-100 font-bold">Heading 5</button>
//                             <button onClick={() => setHeading(6)} className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm font-bold">Heading 6</button>
//                         </Dropdown>

//                         <div className="w-px h-6 bg-gray-300 mx-1" />

//                         <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
//                             <Bold size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
//                             <Italic size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
//                             <Strikethrough size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code">
//                             <Code size={18} />
//                         </ToolbarButton>

//                         <div className="w-px h-6 bg-gray-300 mx-1" />

//                         <ToolbarButton onClick={() => setShowLinkDialog(true)} title="Insert Link">
//                             <Link2 size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => setShowImageDialog(true)} title="Insert Image">
//                             <ImageIcon size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => setShowAudioDialog(true)} title="Insert Audio">
//                             <Mic size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => setShowVideoDialog(true)} title="Insert Video">
//                             <Video size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
//                             <Quote size={18} />
//                         </ToolbarButton>

//                         <div className="w-px h-6 bg-gray-300 mx-1" />

//                         <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
//                             <List size={18} />
//                         </ToolbarButton>
//                         <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
//                             <ListOrdered size={18} />
//                         </ToolbarButton>

//                         {isListActive && (
//                             <>
//                                 <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} title="Indent">
//                                     <IndentIncrease size={18} />
//                                 </ToolbarButton>
//                                 <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} title="Outdent">
//                                     <IndentDecrease size={18} />
//                                 </ToolbarButton>
//                             </>
//                         )}

//                         <div className="w-px h-6 bg-gray-300 mx-1" />

//                         <Dropdown
//                             trigger={<>Button<ChevronDown size={14} /></>}
//                             open={buttonDropdown}
//                             setOpen={setButtonDropdown}
//                         >
//                             <button onClick={() => insertButton('subscribe')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Subscribe</button>
//                             <button onClick={() => insertButton('subscribeCaption')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Subscribe w/ caption</button>
//                             <button onClick={() => insertButton('share')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Share post</button>
//                             <button onClick={() => insertButton('shareCaption')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Share post w/ caption</button>
//                             <button onClick={() => insertButton('sharePublication')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Share publication</button>
//                             <button onClick={() => insertButton('comment')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Leave a comment</button>
//                             <button onClick={() => insertButton('message')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Send a message</button>
//                             <div className="border-t my-1" />
//                             <button onClick={() => insertButton('getApp')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Get the app</button>
//                             <button onClick={() => insertButton('refer')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Refer a writer</button>
//                             <button onClick={() => insertButton('survey')} className="w-full px-4 py-2 text-left hover:bg-gray-100">Link to survey</button>
//                         </Dropdown>

//                         <Dropdown
//                             trigger={<>More<ChevronDown size={14} /></>}
//                             open={moreDropdown}
//                             setOpen={setMoreDropdown}
//                         >
//                             <button onClick={insertCodeBlock} className="w-full px-4 py-2 text-left hover:bg-gray-100">Code block</button>
//                             <button onClick={insertDivider} className="w-full px-4 py-2 text-left hover:bg-gray-100">Divider</button>
//                             <button onClick={() => { setShowPollDialog(true); setMoreDropdown(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-100">Poll</button>
//                             <button onClick={insertFootnote} className="w-full px-4 py-2 text-left hover:bg-gray-100">Footnote</button>
//                             <button onClick={insertLatex} className="w-full px-4 py-2 text-left hover:bg-gray-100">LaTeX</button>
//                             <button onClick={insertPoetry} className="w-full px-4 py-2 text-left hover:bg-gray-100">Poetry</button>
//                         </Dropdown>

//                         <div className="ml-auto">
//                             <button onClick={exportContent} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                                 Export
//                             </button>
//                         </div>
//                     </div>

//                     {/* Editor */}
//                     <EditorContent editor={editor} />
//                 </div>

//                 {/* Link Dialog */}
//                 {showLinkDialog && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-96">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">Insert Link</h3>
//                                 <button onClick={() => setShowLinkDialog(false)}><X size={20} /></button>
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Display text (optional)"
//                                 value={linkText}
//                                 onChange={(e) => setLinkText(e.target.value)}
//                                 className="w-full border rounded px-3 py-2 mb-3"
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="URL"
//                                 value={linkUrl}
//                                 onChange={(e) => setLinkUrl(e.target.value)}
//                                 className="w-full border rounded px-3 py-2 mb-3"
//                             />
//                             <label className="flex items-center gap-2 mb-4">
//                                 <input type="checkbox" checked={linkNewTab} onChange={(e) => setLinkNewTab(e.target.checked)} />
//                                 <span>Open in new tab</span>
//                             </label>
//                             <button onClick={insertLink} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
//                                 Insert Link
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Image Dialog */}
//                 {showImageDialog && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-96">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">Insert Image</h3>
//                                 <button onClick={() => setShowImageDialog(false)}><X size={20} /></button>
//                             </div>
//                             <div className="space-y-3">
//                                 <label className="block">
//                                     <span className="block mb-2 font-medium">Upload from device</span>
//                                     <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
//                                 </label>
//                                 <button
//                                     onClick={() => { setShowImageDialog(false); setShowUnsplashDialog(true); }}
//                                     className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
//                                 >
//                                     <Search size={18} />
//                                     Search Stock Photos
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Unsplash Dialog */}
//                 {showUnsplashDialog && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-auto">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">Search Unsplash</h3>
//                                 <button onClick={() => { setShowUnsplashDialog(false); setUnsplashResults([]); }}><X size={20} /></button>
//                             </div>
//                             <div className="flex gap-2 mb-4">
//                                 <input
//                                     type="text"
//                                     placeholder="Search photos..."
//                                     value={unsplashQuery}
//                                     onChange={(e) => setUnsplashQuery(e.target.value)}
//                                     onKeyPress={(e) => e.key === 'Enter' && searchUnsplash()}
//                                     className="flex-1 border rounded px-3 py-2"
//                                 />
//                                 <button onClick={searchUnsplash} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                                     Search
//                                 </button>
//                             </div>
//                             {unsplashLoading && <p className="text-center">Loading...</p>}
//                             <div className="grid grid-cols-3 gap-3">
//                                 {unsplashResults.map((photo) => (
//                                     <img
//                                         key={photo.id}
//                                         src={photo.urls.small}
//                                         alt={photo.alt_description}
//                                         className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
//                                         onClick={() => insertUnsplashImage(photo.urls.regular)}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Audio Dialog */}
//                 {showAudioDialog && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-96">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">Insert Audio</h3>
//                                 <button onClick={() => { setShowAudioDialog(false); setRecording(false); }}><X size={20} /></button>
//                             </div>
//                             <div className="space-y-3">
//                                 <label className="block">
//                                     <span className="block mb-2 font-medium">Upload audio file</span>
//                                     <input type="file" accept="audio/*" onChange={handleAudioUpload} className="w-full" />
//                                 </label>
//                                 <div className="border-t pt-3">
//                                     <span className="block mb-2 font-medium">Record audio</span>
//                                     {!recording ? (
//                                         <button
//                                             onClick={startVoiceRecording}
//                                             className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
//                                         >
//                                             <Mic size={18} />
//                                             Start Recording
//                                         </button>
//                                     ) : (
//                                         <button
//                                             onClick={stopVoiceRecording}
//                                             className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 flex items-center justify-center gap-2"
//                                         >
//                                             <Square size={18} />
//                                             Stop Recording
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Video Dialog */}
//                 {showVideoDialog && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-[500px]">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">Insert Video</h3>
//                                 <button onClick={() => { setShowVideoDialog(false); setVideoRecording(false); }}><X size={20} /></button>
//                             </div>
//                             <div className="space-y-3">
//                                 <label className="block">
//                                     <span className="block mb-2 font-medium">Upload video file</span>
//                                     <input type="file" accept="video/*" onChange={handleVideoUpload} className="w-full" />
//                                 </label>
//                                 <div className="border-t pt-3">
//                                     <span className="block mb-2 font-medium">Record video</span>
//                                     {videoRecording && (
//                                         <video ref={videoPreviewRef} className="w-full mb-3 rounded" autoPlay muted />
//                                     )}
//                                     {!videoRecording ? (
//                                         <button
//                                             onClick={startVideoRecording}
//                                             className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
//                                         >
//                                             <Video size={18} />
//                                             Start Recording
//                                         </button>
//                                     ) : (
//                                         <button
//                                             onClick={stopVideoRecording}
//                                             className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 flex items-center justify-center gap-2"
//                                         >
//                                             <Square size={18} />
//                                             Stop Recording
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Poll Dialog */}
//                 {showPollDialog && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-96">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">Create Poll</h3>
//                                 <button onClick={() => { setShowPollDialog(false); setPollQuestion(''); setPollOptions(['', '']); }}><X size={20} /></button>
//                             </div>
//                             <input
//                                 type="text"
//                                 placeholder="Poll question"
//                                 value={pollQuestion}
//                                 onChange={(e) => setPollQuestion(e.target.value)}
//                                 className="w-full border rounded px-3 py-2 mb-3"
//                             />
//                             {pollOptions.map((opt, i) => (
//                                 <div key={i} className="flex gap-2 mb-2">
//                                     <input
//                                         type="text"
//                                         placeholder={`Option ${i + 1}`}
//                                         value={opt}
//                                         onChange={(e) => {
//                                             const newOptions = [...pollOptions];
//                                             newOptions[i] = e.target.value;
//                                             setPollOptions(newOptions);
//                                         }}
//                                         className="flex-1 border rounded px-3 py-2"
//                                     />
//                                     {pollOptions.length > 2 && (
//                                         <button
//                                             onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
//                                             className="text-red-600 hover:text-red-800"
//                                         >
//                                             <X size={20} />
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                             <button
//                                 onClick={() => setPollOptions([...pollOptions, ''])}
//                                 className="w-full border border-dashed border-gray-400 py-2 rounded hover:bg-gray-50 mb-3"
//                             >
//                                 + Add Option
//                             </button>
//                             <button
//                                 onClick={insertPoll}
//                                 className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//                             >
//                                 Insert Poll
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PublishPost;

// -----------------

// import { useAuth } from "react-oidc-context";
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const PublishPost = () => {
//     const [postData, setPostData] = useState({
//         //  title: "",
//         // description: "",
//         // subject: "",
//         title: "",
//         subtitle: "",
//         section: "",
//         body: "",
//         authorId: "00000000-0000-0000-0000-000000000002", // static for now
//         published: true,
//     });

//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setPostData({ ...postData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const response = await axios.post(
//                 "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/content",
//                 postData,
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//             console.log("Post created:", response.data);

//             navigate(`/post/${response.data.id}`, {
//                 state: { post: response.data }
//             });

//         } catch (error) {
//             console.error("Error creating post:", error);
//             alert("Failed to create post.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex justify-center py-12">
//             <form
//                 onSubmit={handleSubmit}
//                 className="w-[clamp(22rem,90vw,40rem)] flex flex-col gap-4 bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-gray-100"
//             >
//                 <h1 className="text-2xl font-semibold text-center mb-2">Create Post</h1>

//                 <input
//                     type="text"
//                     name="title"
//                     placeholder="Post title"
//                     value={postData.title}
//                     onChange={handleChange}
//                     className="p-2 border rounded-md"
//                     required
//                 />

//                 <textarea
//                     name="body"
//                     placeholder="Write your post content..."
//                     value={postData.body}
//                     onChange={handleChange}
//                     rows="8"
//                     className="p-2 border rounded-md"
//                     required
//                 />

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-button-primary text-surface-base font-medium rounded-lg py-2 hover:opacity-90 disabled:opacity-50"
//                 >
//                     {loading ? "Publishing..." : "Publish"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default PublishPost; 

//---------------------- Hassans Code Below ------------------------
//---------------------- Final Code Below ------------------------


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "react-oidc-context";
// import axios from "axios";

// import RichTextEditor from "../editor/RichTextEditor";

// export default function PublishPost() {
//   const navigate = useNavigate();
//   const auth = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [cmsToken, setCmsToken] = useState(null);
//   const [postData, setPostData] = useState({
//     title: "",
//     subtitle: "",
//     sectionId: "",
//     body: "",
//   });

//   // Exchange Cognito ID token for CMS JWT token
//   useEffect(() => {
//     const exchangeToken = async () => {
//       if (!auth.isAuthenticated) return;

//       try {
//         const res = await axios.post(
//           "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/auth/cognito",
//           { cognitoToken: auth.user.id_token }
//         );
//         setCmsToken(res.data.token);
//         console.log("CMS token:", res.data.token);
//       } catch (err) {
//         console.error("Token exchange failed:", err);
//         alert("Failed to authenticate with backend.");
//       }
//     };

//     exchangeToken();
//   }, [auth]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPostData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!auth.isAuthenticated) {
//       return alert("You must be logged in.");
//     }

//     if (!cmsToken) {
//       return alert("Backend authentication not ready yet.");
//     }

//     if (!postData.title.trim()) return alert("Title is required.");
//     if (!postData.body.trim()) return alert("Body cannot be empty.");

//     setLoading(true);

//     try {
//       const payload = { ...postData, published: true };

//       const res = await axios.post(
//         "https://api.mine-cms.com/api/v1/content",
//         payload,
//         { headers: { Authorization: `Bearer ${cmsToken}` } }
//       );

//       navigate(`/post/${res.data.id}`, { state: { post: res.data } });
//     } catch (err) {
//       console.error(err);
//       alert("Error creating post.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <form onSubmit={handleSubmit} className="w-full p-8">
//         {/* Title */}
//         <input
//           name="title"
//           placeholder="Title"
//           value={postData.title}
//           onChange={handleChange}
//           className="w-full text-4xl font-bold outline-none"
//         />

//         {/* Subtitle */}
//         <input
//           name="subtitle"
//           placeholder="Add subtitle..."
//           value={postData.subtitle}
//           onChange={handleChange}
//           className="w-full mt-3 text-lg outline-none"
//         />

//         {/* Rich Text Editor */}
//         <div className="mt-10">
//           <RichTextEditor
//             value={postData.body}
//             onChange={(html) => setPostData({ ...postData, body: html })}
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading || !cmsToken}
//           className={`mt-10 px-6 py-2 rounded-md text-white ${
//             !cmsToken || loading ? "bg-gray-400 cursor-not-allowed" : "bg-black"
//           }`}
//         >
//           {loading ? "Publishing..." : !cmsToken ? "Authenticating..." : "Publish"}
//         </button>
//       </form>
//     </div>
//   );
// }
