# Worker Demo

This is a minimal demonstrations of [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) + [esbuild](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) + Rails 7 and Ruby 3+.
It is a proof of concept.

## Web Workers

If you need to keep the main client-side thread of a web app nimble and responsive but you have heavy tasks to perform
you have two options: offload the work back onto the server or offload it onto a parallel client-side thread. The former is
you best option if scaling isn't a concern, because the API of server-side background processes is simple and familiar.
But if you have many clients making use of this the queue can get long. In this case, you want to offload processing onto
the client, and Web Workers are really your only option. Their API is really simple:
- You give them their own chunk of code to run. Closures are not an option. No memory is shared.
- You communicate with the via message passing. You can [pass by reference](https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects), but only one thread can access a particular piece of memory at a time.

The Web Worker in this application demonstrates the worker loading different npm modules from the main thread. A problem
with Web Workers is that, though it is not terribly inconvenient to set them up within a web application, it is difficult to
set them up within a module used by an application, because it the workers need to collect *all* their dependencies within
the scope of a single function, and the facilities javascript provides for importing code from other modules require that the
importing happen outside the scope of a function. This means you need either to provide all the code a Web Worker needs as a string
to evaluate, which is the only mechanism available inside a module, or as a URL, which works only in the context of a web application.
So to use npm modules inside Web Workers inside another npm module one needs to configure one's build tools to compose everything
into a single function which can be stringified. So, Web Workers kind of suck as a general mechanism of parallelism within
javascript, but they are a good enough half-assed mechanism of parallelism within a web app. The app can use them. The modules
it depends on mostly can't.

## esbuild

In this demo I want to show Web Workers alongside other parts of what have come to be our standard stack: React, typescript, and Rails.
React and typescript require a transpiler to produce javascript. The typical transpiler is webpacker, but here I'm using esbuild.
Because esbuild is written in go, and because it has narrow ambitions, it is much, much faster than webpacker. It doesn't actually
provide the type checking typescript promises. For that you'll need to rely on other resources, tsc or whatever is built into
your IDE. But esbuild will convert your typescript into javascript like lightning.

I didn't look at this before I wrote this demo app, but I should have: [Chris Oliver's esbuild/Rails tutorial](https://gorails.com/episodes/esbuild-jsbundling-rails)

# Files of interest

The key files showing how it all goes toegether are:
- the Procfile, which sets up an esbuild process watching and compiling key typescript files. It should be run by foreman or overmind.
- the routes file, which you will see sets up a single route to a single controller to handle all requests and requests
- the layout, which installs the two javascript bundles built by esbuild
- the application.tsx file, which is the brains of the application
- the worker.ts file, which application.tsx communicates with

