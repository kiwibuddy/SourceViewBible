/* @flow */
'use strict';

import {
  Colors,
  StyleSheet,
} from '../../Common';

const CSS = require('./CSS');

module.exports = `
<!DOCTYPE html>
<html>
  <head>
    <title>Scripture</title>
    <meta charset="utf-8"/>
    <style type="text/css">
      p, b {
        margin: 0;
        padding: 0;
        line-height: 24pt;
        -webkit-margin-before: 0;
      }
      i {
        color: #323B43;
      }
      body {
        font-family: Georgia;
        font-size: {{FONT_SIZE}}pt;
        color: #323B43;
        line-height: 24pt;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      table {
        margin:0;
        padding:0;
        border-spacing: 0;
        border-collapse: collapse;
        overflow: hidden;
        margin-left: -220pt;
      }
      tr {
        margin:0;
        padding:0;
      }
      td {
        margin:0;
        padding:0;
        vertical-align: top;
        margin-top: -10pt;
      }
      .sourceBlack {
        color: ${Colors.sources.narrator.tint};
      }
      .sourceRed {
        color: ${Colors.sources.god.tint};
      }
      .sourceGreen {
        color: ${Colors.sources.lead.tint};
      }
      .sourceBlue {
        color: ${Colors.sources.support.tint};
      }
      .sourceTitle {
        font-family: -apple-system, "Helvetica Neue", "Lucida Grande";
        font-size: .8em;
        line-height: 1em;
        color: #9B9B9B;
        text-align: right;
        white-space: nowrap;
        padding-right: 15pt;
        margin-top: 8pt;
        text-transform: uppercase;
        width: 210pt;
        display: block;
      }
      .sourceText {
        padding: 0 5pt;
      }
      .textTitle {
        font-family: Georgia;
        font-weight: bold;
        font-size: 1em;
        line-height: 3em;
        color: #323B43;
        text-align: Center;
      }
      .textSubTitle {
        color: #323B43;
        font-style: italic;
      }
      .textSection {
        font-family: Georgia;
        font-style: italic;
        font-size: 1.5em;
        color: #323B43;
        text-align: Center;
      }
      .textChapter {
        font-family: Gurmukhi MN;
        color: #CF1E00;
        font-size: 1em;
        position: relative;
        top: 0;
        font-weight: normal;
        {{NUMBER_DISPLAY}}
      }
      .textVerse {
        font-family: Gurmukhi MN;
        font-size: 0.65em;
        position: relative;
        top: -0.4em;
        {{NUMBER_DISPLAY}}
      }
      .textIndent, .textPoetryStanzaFirst {
        text-indent: 2em;
      }
      .textPoetryFirst {
        margin-left: 2em;
      }
      .textPoetry {
        margin-left: 2em;
      }
      ${CSS}
    </style>
  </head>
  <body id="scripture">
    {{BODY}}

    <script type="text/javascript">
      var opened = false;
      var openedWidth = 160;
      var closedWidth = 0;
      var ready = false;
      var startingPosition = 0;
      var previousPosition = 0;
      var originalX = null;
      var originalY = null;

      document.onreadystatechange = function() {
      	if (ready) return;
      	if (document.readyState == 'interactive' || document.readyState == 'complete') {
      		ready = true;

          document.addEventListener('touchstart', onTouchStart, false);
          document.addEventListener('touchmove', onTouchMove, false);
          document.addEventListener('touchend', onTouchEnd, false);
          document.addEventListener('touchcancel', onTouchEnd, false);

          function onTouchStart(e) {
            originalX = e.touches[0].clientX;
            originalY = e.touches[0].clientY;
            document.getElementById('table').style.transition = null;
          }

          function onTouchMove(e) {
            if (!originalX || !originalY) return;

            var currentX = e.touches[0].clientX;
            var currentY = e.touches[0].clientY;
            var xDiff = originalX - currentX;
            var yDiff = originalY - currentY;

            if (Math.abs(xDiff) > Math.abs(yDiff) + 10) {
              opened = currentX > previousPosition;
              var position = Math.min(openedWidth * 1.5, Math.max(0, startingPosition - xDiff));
              document.getElementById('table').style.transform = 'translate3d(' + position + 'pt, 0px, 0px)';
              e.preventDefault();
            }

            previousPosition = currentX;
          }

          function onTouchEnd(e) {
            if (!originalX || !originalY) return;
            originalX = null;
            originalY = null;

            var position = opened ? openedWidth : closedWidth;
            document.getElementById('table').style.transition = '.3s';
            document.getElementById('table').style.transform = 'translate3d(' + position + 'pt, 0px, 0px)';

            startingPosition = position;
          }
      	}
      };
    </script>
  </body>
</html>
`;
