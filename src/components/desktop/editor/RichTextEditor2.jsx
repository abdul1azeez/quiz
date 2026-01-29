import { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronDown,
  List,
  ListOrdered,
  MonitorPlay,
  Upload,
  Globe,
  X,
  Check
} from "lucide-react";
import { useAuth } from "react-oidc-context";

const API_BASE = "https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1";

// --- Custom Extension for Local/HTML5 Videos ---
const VideoExtension = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      style: { default: 'width: 100%; height: auto;' }
    }
  },

  parseHTML() { return [{ tag: 'video' }] },
  renderHTML({ HTMLAttributes }) { return ['video', mergeAttributes(HTMLAttributes), 0] },

  addCommands() {
    return {
      setVideo: options => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: options })
      },
    }
  },
});

const Toolbar = ({ editor }) => {

  const auth = useAuth();
  const uploadMedia = async (file, type) => {
    const token =
      auth.user?.id_token || localStorage.getItem("cognito_jwt");

    if (!token) throw new Error("Not authenticated");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${API_BASE}/media/upload?type=${type}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.fullUrl;
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  // State for Link Input Fields
  const [linkForm, setLoginForm] = useState({ text: "", href: "" });

  const toolbarRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
        // We don't close the modal here automatically to avoid frustrating misclicks,
        // user must click "Cancel" or X.
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  // --- LINK HANDLERS (New Modal Logic) ---

  const openLinkModal = useCallback(() => {
    // 1. Get current selection details
    const previousUrl = editor.getAttributes("link").href;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    // 2. Pre-fill form
    setLoginForm({
      href: previousUrl || "",
      text: selectedText || "" // If nothing selected, empty string
    });

    setShowLinkModal(true);
    setActiveDropdown(null); // Close other menus
  }, [editor]);

  const saveLink = () => {
    if (!linkForm.href) {
      // If URL empty, remove link
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      // If user typed specific text, we insert/replace
      if (linkForm.text) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .insertContent({
            type: 'text',
            text: linkForm.text,
            marks: [{ type: 'link', attrs: { href: linkForm.href } }]
          })
          .run();
      } else {
        // Just apply link to whatever is selected
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkForm.href }).run();
      }
    }
    setShowLinkModal(false);
    setLoginForm({ text: "", href: "" });
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkModal(false);
  };

  // --- IMAGE & VIDEO HANDLERS ---
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // const url = URL.createObjectURL(file);
      // editor.chain().focus().setImage({ src: url }).run();
      ///////////////////////////////////////////////////////////////////////
      /////// HASSANS CODE BLOCK -- DO NOT CHANGE! ⚠️‼️ ////////////////////
      const imageUrl = await uploadMedia(file, "IMAGE");
      editor.chain().focus().setImage({ src: imageUrl }).run();
      /////////////////////////////////////////////////////////////////////
    }
    event.target.value = "";
    setActiveDropdown(null);
  };

  const addImageLink = () => {
    const url = window.prompt("Enter Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
    setActiveDropdown(null);
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // const url = URL.createObjectURL(file);
      // editor.chain().focus().setVideo({ src: url }).run();
      ///////////////////////////////////////////////////////////////////////
      /////// HASSANS CODE BLOCK -- DO NOT CHANGE! ⚠️‼️ ////////////////////
      const videoUrl = await uploadMedia(file, "VIDEO");
      editor.chain().focus().setVideo({ src: videoUrl }).run();
      /////////////////////////////////////////////////////////////////////
    }
    event.target.value = "";
    setActiveDropdown(null);
  };

  const addVideoLink = () => {
    const url = window.prompt("Enter YouTube or Video URL");
    if (url) {
      if (url.includes('youtube') || url.includes('youtu.be')) {
        editor.commands.setYoutubeVideo({ src: url });
      } else {
        editor.chain().focus().setVideo({ src: url }).run();
      }
    }
    setActiveDropdown(null);
  };

  // Helper classes
  const buttonClass = (isActive) =>
    `p-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-center ${isActive ? "text-black bg-gray-100" : "text-gray-500"}`;

  const Divider = () => <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block" />;

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setShowLinkModal(false); // Close link modal if opening menu
  };

  return (
    <div
      ref={toolbarRef}
      className="relative flex flex-wrap items-center rounded-full justify-center gap-1 py-3 mb-2 sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-2 sm:px-0 transition-all duration-300"
    >

      {/* Hidden Inputs */}
      <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={handleImageUpload} />
      <input type="file" accept="video/*" ref={videoInputRef} className="hidden" onChange={handleVideoUpload} />

      {/* --- 1. HISTORY --- */}
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"><Undo2 size={18} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"><Redo2 size={18} /></button>

      <Divider />

      {/* --- 2. STYLE --- */}
      <div className="relative">
        <button onClick={() => toggleDropdown('heading')} className="flex items-center gap-1 p-2 rounded hover:bg-gray-100 text-sm font-medium text-gray-700">
          <span className="hidden sm:inline">Style</span><span className="sm:hidden">H</span><ChevronDown size={14} className="text-gray-500" />
        </button>
        {activeDropdown === 'heading' && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-xl flex flex-col p-1 z-50">
            <button onClick={() => { editor.chain().focus().setParagraph().run(); setActiveDropdown(null); }} className="text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700">Paragraph</button>
            <button onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setActiveDropdown(null); }} className="text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700 font-bold">Heading 1</button>
            <button onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setActiveDropdown(null); }} className="text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700 font-semibold">Heading 2</button>
          </div>
        )}
      </div>

      <Divider />

      {/* --- 3. FORMATTING --- */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive("bold"))}><Bold size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive("italic"))}><Italic size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive("strike"))}><Strikethrough size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={`${buttonClass(editor.isActive("code"))} hidden sm:flex`}><Code size={18} /></button>

      <Divider />

      {/* --- 4. MEDIA --- */}

      {/* Link Button (Triggers Modal) */}
      <div className="relative">
        <button
          onClick={openLinkModal}
          className={buttonClass(editor.isActive("link"))}
          title="Link"
        >
          <LinkIcon size={18} />
        </button>

        {/* --- CUSTOM LINK MODAL --- */}
        {showLinkModal && (
          <div className="absolute top-full left-0 mt-2 w-[300px] bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase text-gray-400">Add Link</span>
                <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </div>

              {/* Text Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">Text to display</label>
                <input
                  value={linkForm.text}
                  onChange={(e) => setLoginForm({ ...linkForm, text: e.target.value })}
                  className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Click here"
                />
              </div>

              {/* URL Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium">URL</label>
                <input
                  value={linkForm.href}
                  onChange={(e) => setLoginForm({ ...linkForm, href: e.target.value })}
                  className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://google.com"
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={saveLink}
                  className="flex-1 bg-black text-white text-sm font-bold py-1.5 rounded hover:bg-gray-800 transition flex justify-center items-center gap-1"
                >
                  <Check size={14} /> Apply
                </button>
                {editor.isActive('link') && (
                  <button
                    onClick={removeLink}
                    className="px-3 bg-red-50 text-red-500 text-sm font-bold py-1.5 rounded hover:bg-red-100 transition"
                    title="Remove Link"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Dropdown */}
      <div className="relative">
        <button onClick={() => toggleDropdown('image')} className={`flex items-center gap-0.5 ${buttonClass(editor.isActive("image"))}`}>
          <ImageIcon size={18} />
          <ChevronDown size={12} className="opacity-50" />
        </button>
        {activeDropdown === 'image' && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-xl flex flex-col p-1 z-50">
            <button onClick={() => imageInputRef.current.click()} className="flex items-center gap-2 text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700"><Upload size={14} /> Upload from Device</button>
            <button onClick={addImageLink} className="flex items-center gap-2 text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700"><Globe size={14} /> Embed Link</button>
          </div>
        )}
      </div>

      {/* Video Dropdown */}
      <div className="relative">
        <button onClick={() => toggleDropdown('video')} className={`flex items-center gap-0.5 ${buttonClass(editor.isActive("youtube") || editor.isActive("video"))}`}>
          <MonitorPlay size={18} />
          <ChevronDown size={12} className="opacity-50" />
        </button>
        {activeDropdown === 'video' && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-xl flex flex-col p-1 z-50">
            <button onClick={() => videoInputRef.current.click()} className="flex items-center gap-2 text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700"><Upload size={14} /> Upload from Device</button>
            <button onClick={addVideoLink} className="flex items-center gap-2 text-left px-3 py-2 text-sm rounded hover:bg-gray-50 text-gray-700"><Globe size={14} /> YouTube / Link</button>
          </div>
        )}
      </div>

      <Divider />

      {/* --- 5. LISTS --- */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive("bulletList"))}><List size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive("orderedList"))}><ListOrdered size={18} /></button>
    </div>
  );
};

const RichTextEditor2 = ({ content, onChange }) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none cursor-text flex flex-col min-h-[300px] sm:min-h-[500px] w-full px-4 sm:px-10 py-6 sm:py-10 prose max-w-none",
      },
    },
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }),
      Youtube.configure({ controls: false, nocookie: true }),
      VideoExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full flex justify-center bg-[#f9fafb]">
      <div className="w-full max-w-4xl sm:py-6 flex flex-col justify-center">
        <Toolbar editor={editor} />
        <style>{`
          .ProseMirror iframe { width: 100%; height: auto; aspect-ratio: 16/9; border-radius: 8px; margin: 1rem 0; }
          .ProseMirror video { 
            max-width: 100%;      
            width: auto;          
            max-height: 80vh;     
            height: auto; 
            border-radius: 8px; 
            margin: 1rem auto;    
            display: block;
          }
          .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; }
          .ProseMirror { min-height: 300px; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor2;