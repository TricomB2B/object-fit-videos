# object-fit-videos

An open-source polyfill for CSS `object-fit` and `object-position` on videos. Supports IE9-11, Edge, and Safari. All other browsers support the properties by default.

At this time, only `object-fit` has been implemented.

Many thanks go to both the [object-fit-images](https://github.com/bfred-it/object-fit-images) and [fitie](https://github.com/jonathantneal/fitie) projects for doing a lot of work on their polyfills. Much of this project got its start by following their examples.

### Installation

```sh
$ npm install --save object-fit-videos
```

### Usage

Include the polyfill in your markup

```html
<script src="path/to/object-fit-videos/dist/object-fit-videos.min.js"></script>
```

Add a special font-family CSS property for targeting IE/Edge

```css
video {
  object-fit: cover;
  font-family: 'object-fit: cover;';
}
```

The polyfill will do the rest.

### License

Copyright (c) 2016 TricomB2B

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
