# object-fit-videos

An open-source polyfill for CSS `object-fit` and `object-position` on videos. Supports IE9-11, Edge, and Safari <10 (and more?). Does nothing on browsers that support these properties.

### Installation

```sh
$ npm install --save object-fit-videos
```

Or [yarn](https://yarnpkg.com/)!

```sh
$ yarn add object-fit-videos
```

### Usage

Include the polyfill in your markup

```html
<script src="path/to/object-fit-videos/dist/object-fit-videos.min.js"></script>
```

Add a special font-family CSS property for targeting IE/Edge or Safari

```css
video {
  object-fit: cover;
  font-family: 'object-fit: cover;';
}
```

`object-position` can be used similarly. Note that `object-position` only supports keyword positioning at this time. That's `top`, `bottom`, `left`, `right`, and `center`

```css
video {
  object-fit: cover;
  object-position: left top;
  font-family: 'object-fit: cover; object-position: left top;';
}
```

Make the JavaScript call to initialize the videos with the special CSS property

```js
objectFitVideos();
```

You can make the call before the closing `</body>` tag or whenever the DOM is ready. The polyfill will do the rest.

### Polyfilling Specific Elements

You can also pass elements to the `objectFitVideos()` function to only polyfill specific videos. A couple examples:

```js
objectFitVideos(document.querySelectorAll('.videos'));
```

```js
objectFitVideos(document.getElementById('vid'));
```

So on and so forth.

### Contributions

Feel free to open Pull Requests, bug reports, feature requests.

Special thanks to these folks to who have contributed code:

[msorensson](https://github.com/msorensson)  
[oncode](https://github.com/oncode)  
[richtr](https://github.com/richtr)

### License

Copyright (c) 2016 TricomB2B

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
