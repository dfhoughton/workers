import { regex, qw } from "list-matcher"

// behold the special "self" keyword used in the worker
// this is the worker's outermost scope; it has no document or window
self.onmessage = function (e) {
  self.postMessage(regex(qw("" + e.data), { flags: "i" }))
}
