import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import SyntaxHighlighter from "react-syntax-highlighter"
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom'

const AiGenerator = () => {
  const [text, setText] = useState("")
  const [data, setData] = useState()
  const [copy, setCopy] = useState(false)
  const [lang, setLang] = useState("python")
  const [file, setFile] = useState({
    filename: data?.name,
    code: data?.code,
    lang: data?.lang
  })
  const [loading, setLoading] = useState()
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch("https://codeeditor-w8wq.onrender.com/create-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text, lang: lang })
      });
      const hamData = await response.json();
      const data = JSON.parse(hamData)
      if(data.success) {
        toast.success(data.success)
      } else {
        toast.error(data.error)
      }
      setFile({
        filename: data?.name,
        code: data?.code,
        lang: data?.lang
      })
      setData(data);
      setCopy(true);
      setText("");
    } catch (error) {
      console.error(error);
      setCopy(false)
    } finally {
      setLoading(false);
    }
  };

  const handleNewFile = async () => {
    if (!user) {
      navigate("/signup")
    } else {
      const response = await fetch(`https://codeeditor-w8wq.onrender.com/${user?.username}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(file)
      })

      const data = await response.json()

      toast.promise(
        Promise.resolve(data),
        {
          loading: "Saving...",
          success: "Successfully Saved!",
          error: "Failed to Save!"
        },
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            padding: '10px',
            margin: '10px'
          }
        }
      )
    }
  }

  return (
    <div className='ai_body'>
      <Navbar />
      <div className='ai_content'>
        <h1 className='ai_title'>Text To Code</h1>
        <form onSubmit={handleSubmit} className="ai_input_body">
          <div className="ai_input_inputs">
          <select
          required
            className='ai_select_lang'
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          <input required className='ai_input_message' type="text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <button type='submit'
            className='ai_input_button' 
          >
          <svg className='send_svg' fill="##ffff" width="800px" height="800px" viewBox="0 0 24 24" id="send" xmlns="http://www.w3.org/2000/svg"><line id="secondary" x1="7" y1="12" x2="11" y2="12" ></line><path id="primary" d="M5.44,4.15l14.65,7a1,1,0,0,1,0,1.8l-14.65,7A1,1,0,0,1,4.1,18.54l2.72-6.13a1.06,1.06,0,0,0,0-.82L4.1,5.46A1,1,0,0,1,5.44,4.15Z"></path></svg>

          </button>
        </form>
        <div className="ai_res_detail">
          <p className='ai_res_detail_header'>AI Result</p>
          <button className='copy_button'
          disabled={!copy}
          style={{
            opacity: copy ? 1 : 0.5,
            cursor: copy ? "pointer" : "not-allowed",
          }}
            onClick={() => {
              if (data?.code) {
                navigator.clipboard.writeText(data.code)
                toast.success("Successfully Copied Code!", {
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  }
                })
              }
            }}
          >
            <ion-icon name="clipboard-outline" className="copy_icon" size="midium" />
            <span>Copy Code</span>
          </button>
        </div>
        {loading ? (
          <div className='loading_container'>
            <div className='loading'></div>
            <p className='loading_text'>loading
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </p>
          </div>
        ) : (
          <div className='ai_res_div' style={{
            position: "relative"
          }}>
            {data?.code &&
              <ion-icon onClick={() => handleNewFile()} name="save-outline"></ion-icon>}
            <SyntaxHighlighter language='python' style={atomOneDark} customStyle={{
              width: "750px",
              height: "500px",
              padding: "25px",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
              wrapLongLines={true}>
              {data?.code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiGenerator