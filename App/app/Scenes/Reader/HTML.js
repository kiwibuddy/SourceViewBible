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
        font-weight: normal;
        margin: 0;
        padding: 0;
        line-height: 24pt;
        -webkit-margin-before: 0;
      }
      body {
        font-family: Georgia;
        font-size: 13pt;
        color: #323B43;
        line-height: 24pt;
      }
      table {
        margin:0;
        padding:0;
        border-spacing: 0;
        border-collapse: collapse;
        overflow: hidden;
        margin-left: -220pt;
      }
      .showSource {
        margin-right: -135pt;
        margin-left: 0;
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
      }
      .textVerse {
        font-family: Gurmukhi MN;
        font-size: .65em;
        position: relative;
        top: -0.4em;
        color: #9B9B9B;
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
      var threshold = 30;
      var opened = false;
      var openedWidth = 220;
      var closedWidth = 0;
      var ready = false;
      var originalX = null;
      var originalY = null;

      document.onreadystatechange = function() {
      	if (ready) return;
      	if (document.readyState == 'interactive' || document.readyState == 'complete') {
      		ready = true;

          document.addEventListener('touchstart', handleTouchStart, false);
          document.addEventListener('touchmove', handleTouchMove, false);
          document.addEventListener('touchend', handleTouchEnd, false);
          document.addEventListener('touchcancel', handleTouchEnd, false);

          function handleTouchStart(e) {
            originalX = e.touches[0].clientX;
            originalY = e.touches[0].clientY;
            document.getElementById('table').style.transition = null;
          }

          function handleTouchMove(e) {
            if (!originalX || !originalY) return;

            var currentX = e.touches[0].clientX;
            var currentY = e.touches[0].clientY;

            var xDiff = originalX - currentX;
            var yDiff = originalY - currentY;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
              if (xDiff > 0) {
                  /* left swipe */
                  opened = false;
              } else {
                  /* right swipe */
                  opened = true;
              }
              document.getElementById('table').style.transform = 'translate3d(' + currentX + 'pt, 0px, 0px)';
            }
          }

          function handleTouchEnd(e) {
            if (!originalX || !originalY) return;
            originalX = null;
            originalY = null;

            var width = opened ? openedWidth : closedWidth;
            document.getElementById('table').style.transition = '.3s';
            document.getElementById('table').style.transform = 'translate3d(' + width + 'pt, 0px, 0px)';
          }
      	}
      };
    </script>
  </body>
</html>
`;
