// Entry point for the build script in your package.json
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import * as ReactDOM from "react-dom"

const App: React.FC = () => {
  const [input, setInput] = useState("Mary had a little lamb")
  const [received, setReceived] = useState("nothing yet")
  const worker = useRef<null | Worker>(null)
  useEffect(() => {
    // find the worker source URL stashed in the layout
    const src = (document.getElementById("worker") as any).src as string
    // build the worker
    worker.current = new Worker(src)
    // give it its first work order
    worker.current.postMessage(input)
    // establish what we do with its output
    worker.current.onmessage = (e) => {
      setReceived("" + e.data)
    }
    // dismiss the worker when we leave
    return () => worker.current?.terminate()
  }, [])
  return (
    <div style={{ margin: "5rem 10rem" }}>
      <h1>Hello, Rails 7!</h1>
      <p style={{ maxWidth: "60rem" }}>
        This is a silly proof-of-concept web app. You type stuff into the input
        below. With every change what you've typed gets sent to the web worker,
        which uses list-matcher to split your text on whitespace into words and
        compile the resulting list into a regular expression.
      </p>
      <label>
        words converted to regex:
        <br />
        <input
          name="input"
          value={input}
          style={{ width: "60rem" }}
          type="text"
          onChange={(e) => {
            // no debounce!
            const v = e.target.value
            setInput(v)
            worker.current?.postMessage(v)
          }}
        />
      </label>
      <br />
      <br />
      <label>
        regex:
        <pre>{received}</pre>
      </label>
    </div>
  )
}

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("app")
  ReactDOM.render(<App />, rootEl)
})
