/**
 * Object Fit Videos
 * Polyfill for object-fit and object-position CSS properties on video elements
 * Covers IE9, IE10, IE11, Edge, Safari
 *
 * Usage
 * In your CSS, add a special font-family tag for IE/Edge
 * video {
 *   object-fit: cover;
 *   font-family: 'object-fit: cover;';
 * }
 * All video elements with this property will be targeted
 *
 * @license  MIT (https://opensource.org/licenses/MIT)
 * @author   Todd Miller <todd.miller@tricomb2b.com>
 * @version  0.0.1
 *
 * @changelog 2016-08-19 - Initial release with object-fit support, and
 *                         object-position default 'center'
 */
(function () {
  'use strict';

  var testImg                = new Image();
  var supportsObjectFit      = 'object-fit' in testImg.style;
  var supportsObjectPosition = 'object-position' in testImg.style;
  var propRegex              = /(object-fit|object-position)\s*:\s*([-\w\s%]+)/g;

  if (!supportsObjectFit)
    window.addEventListener('load', initialize);

  /**
   * Parse the style and look for the special font-family tag
   * @param  {object} $el The element to parse
   * @return {object}     The font-family properties we're interested in
   */
  function getStyle ($el) {
    var style  = getComputedStyle($el).fontFamily,
        parsed = null,
        props  = {};

      while ((parsed = propRegex.exec(style)) !== null) {
        props[parsed[1]] = parsed[2];
      }

      return props;
  }

  /**
   * Initialize all the relevant video elements and get them fitted
   */
  function initialize () {
    var videos = document.querySelectorAll('video'),
        index  = -1;

    while (videos[++index]) {
      var style = getStyle(videos[index]);

      // only do work if the property is on the element
      if (style['object-fit']) {
        // set the default value just in case
        style['object-fit'] = style['object-fit'] || 'fill';
        fitIt(videos[index], style);
      }
    }
  }

  /**
   * Object Fit
   * @param  {object} $el Element to fit
   * @return {object}     The element's relevant properties
   */
  function fitIt ($el, style) {
    // fill is the default behavior, no action is necessary
    if (style['object-fit'] === 'fill')
      return;

    // convenience style properties on the source element
    var setCss = $el.style,
        getCss = window.getComputedStyle($el);

    // create and insert a wrapper element
    var $wrap = document.createElement('object-fit');
    $wrap.appendChild($el.parentNode.replaceChild($wrap, $el));

    // style the wrapper element to mostly match the source element
    var wrapCss = {
      height:    '100%',
      width:     '100%',
      boxSizing: 'content-box',
      display:   'inline-block',
      overflow:  'hidden'
    };

    'backgroundColor backgroundImage borderColor borderStyle borderWidth bottom fontSize lineHeight left opacity margin position right top visibility'.replace(/\w+/g, function (key) {
      wrapCss[key] = getCss[key];
    });

    for (var key in wrapCss)
      $wrap.style[key] = wrapCss[key];

    // give the source element some saner styles
    setCss.border  = setCss.margin = setCss.padding = 0;
    setCss.display = 'block';
    setCss.opacity = 1;

    // set up the event handlers
    $el.addEventListener('loadedmetadata', doWork);
    window.addEventListener('resize', doWork);

    // we may have missed the loadedmetadata event, so if the video has loaded
    // enough data, just drop the event listener and execute
    if ($el.readyState >= 1) {
      $el.removeEventListener('loadedmetadata', doWork);
      doWork();
    }

    /**
     * Do the actual sizing. Math.
     * @methodOf fitIt
     */
    function doWork () {
      // the actual size and ratio of the video
      // we do this here, even though it doesn't change, because
      // at this point we can be sure the metadata has loaded
      var videoWidth  = $el.videoWidth,
          videoHeight = $el.videoHeight,
          videoRatio  = videoWidth / videoHeight;

      var wrapWidth  = $wrap.clientWidth,
          wrapHeight = $wrap.clientHeight,
          wrapRatio  = wrapWidth / wrapHeight;

      var newSize = 0;
      setCss.marginLeft = setCss.marginTop = 0;

      // basically we do the opposite action for contain and cover,
      // depending on whether the video aspect ratio is less than or
      // greater than the wrapper's aspect ratio
      if (videoRatio < wrapRatio ?
          style['object-fit'] === 'contain' : style['object-fit'] === 'cover') {
        newSize = wrapHeight * videoRatio;

        setCss.width  = Math.round(newSize) + 'px';
        setCss.height = wrapHeight + 'px';
        setCss.marginLeft = Math.round((wrapWidth - newSize) / 2) + 'px';
      } else {
        newSize = wrapWidth / videoRatio;

        setCss.width     = wrapWidth + 'px';
        setCss.height    = Math.round(newSize) + 'px';
        setCss.marginTop = Math.round((wrapHeight - newSize) / 2) + 'px';
      }
    }
  }
})();
