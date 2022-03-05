# start Rails on the standard port

web: bin/rails server -p 3000

# use esbuild to compile typescript into javascript
# it will compile *everything* in app/javascript/ and put the results in app/assets/builds/
# Why does this work? Look in app/assets/config/manifest.js

js: esbuild app/javascript/*.* --bundle --sourcemap --outdir=app/assets/builds --watch
