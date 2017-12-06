/**
 * Object Fit Videos
 * Polyfill for object-fit and object-position CSS properties on video elements
 * Covers IE9, IE10, IE11, Edge, Safari <10
 *
 * Usage
 * In your CSS, add a special font-family tag for IE/Edge
 * video {
 *   object-fit: cover;
 *   font-family: 'object-fit: cover;';
 * }
 *
 * Before the closing body tag, or whenever the DOM is ready,
 * make the JavaScript call
 * objectFitVideos();
 *
 * All video elements with the special CSS property will be targeted
 *
 * @license  MIT (https://opensource.org/licenses/MIT)
 * @author   Todd Miller <todd.miller@tricomb2b.com>
 * @version  1.0.2
 * @changelog
 * 2016-08-19 - Adds object-position support.
 * 2016-08-19 - Add throttle function for more performant resize events
 * 2016-08-19 - Initial release with object-fit support, and
 *              object-position default 'center'
 * 2016-10-14 - No longer relies on window load event, instead requires a specific
 *              function call to initialize the videos for object fit and position.
 * 2016-11-28 - Support CommonJS environment, courtesy of @msorensson
 * 2016-12-05 - Refactors the throttling function to support IE
 * 2017-09-26 - Fix an issue with autplay not working on polyfilled videos
 *            - Adds the capability to specify elements to polyfill,
 *              instead of just checking every video element for the
 *              CSS property. Slight performance gain in most usecases,
 *              and a bigger gain in a few usecases.
 * 2017-10-24 - Add user agent check to enable polyfill for all Edge browsers.
 *              object-fit is supported on Edge >= 16, but currently just for images.
 */
var objectFitVideos = function (videos) {
  'use strict';

  var isEdge = navigator.userAgent.indexOf('Edge/') >= 0;

  var testImg                = new Image(),
      supportsObjectFit      = 'object-fit' in testImg.style && !isEdge,
      supportsObjectPosition = 'object-position' in testImg.style && !isEdge,
      propRegex              = /(object-fit|object-position)\s*:\s*([-\w\s%]+)/g;

  if (!supportsObjectFit || !supportsObjectPosition) {
    initialize(videos);
    throttle('resize', 'optimizedResize');
  }

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

      if (props['object-position'])
        return parsePosition(props);

      return props;
  }

  /**
   * Initialize all the relevant video elements and get them fitted
   */
  function initialize (videos) {
    var index = -1;

    if (!videos) {
      // if no videos given, query all video elements
      videos = document.querySelectorAll('video');
    } else if (!('length' in videos)) {
      // convert to an array for proper looping if an array or NodeList
      // was not given
      videos = [videos];
    }

    while (videos[++index]) {
      var style = getStyle(videos[index]);

      // only do work if the property is on the element
      if (style['object-fit'] || style['object-position']) {
        // set the default values
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
    window.addEventListener('optimizedResize', doWork);

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

      var newHeight = 0,
          newWidth  = 0;
      setCss.marginLeft = setCss.marginTop = 0;

      // basically we do the opposite action for contain and cover,
      // depending on whether the video aspect ratio is less than or
      // greater than the wrapper's aspect ratio
      if (videoRatio < wrapRatio ?
          style['object-fit'] === 'contain' : style['object-fit'] === 'cover') {
        newHeight = wrapHeight * videoRatio;
        newWidth  = wrapWidth / videoRatio;

        setCss.width  = Math.round(newHeight) + 'px';
        setCss.height = wrapHeight + 'px';

        if (style['object-position-x'] === 'left')
          setCss.marginLeft = 0;
        else if (style['object-position-x'] === 'right')
          setCss.marginLeft = Math.round(wrapWidth - newHeight) + 'px';
        else
          setCss.marginLeft = Math.round((wrapWidth - newHeight) / 2) + 'px';
      } else {
        newWidth = wrapWidth / videoRatio;

        setCss.width     = wrapWidth + 'px';
        setCss.height    = Math.round(newWidth) + 'px';

        if (style['object-position-y'] === 'top')
          setCss.marginTop = 0;
        else if (style['object-position-y'] === 'bottom')
          setCss.marginTop = Math.round(wrapHeight - newWidth) + 'px';
        else
          setCss.marginTop = Math.round((wrapHeight - newWidth) / 2) + 'px';
      }

      // play the video if autoplay is set
      if ($el.autoplay)
        $el.play();
    }
  }

  /**
   * Split the object-position property into x and y position properties
   * @param  {object} style Relevant element styles
   * @return {object}       The style object with the added x and y props
   */
  function parsePosition (style) {
    if (~style['object-position'].indexOf('left'))
      style['object-position-x'] = 'left';
    else if (~style['object-position'].indexOf('right'))
      style['object-position-x'] = 'right';
    else
      style['object-position-x'] = 'center';

    if (~style['object-position'].indexOf('top'))
      style['object-position-y'] = 'top';
    else if (~style['object-position'].indexOf('bottom'))
      style['object-position-y'] = 'bottom';
    else
      style['object-position-y'] = 'center';

    return style;
  }

  /**
   * Throttle an event with RequestAnimationFrame API for better performance
   * @param  {string} type The event to throttle
   * @param  {string} name Custom event name to listen for
   * @param  {object} obj  Optional object to attach the event to
   */
  function throttle (type, name, obj) {
    obj = obj || window;
    var running = false,
        evt     = null;

    // IE does not support the CustomEvent constructor
    // so if that fails do it the old way
    try {
      evt = new CustomEvent(name);
    } catch (e) {
      evt = document.createEvent('Event');
      evt.initEvent(name, true, true);
    }

    var func = function () {
      if (running) return;

      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(evt);
        running = false;
      });
    };

    obj.addEventListener(type, func);
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = objectFitVideos;
