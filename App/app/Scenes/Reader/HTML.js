/* @flow */
'use strict';

import {
  Colors,
  StyleSheet,
} from '../../Common';

module.exports = `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <style type="text/css">
      body {
        font-family: georgia;
        font-size: 13pt;
        color: #323B43;
        line-height: 26pt;
      }
      table {
        padding:0;
        border-spacing: 0;
        border-collapse: collapse;
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
        font-size: 10pt;
        color: #9B9B9B;
        text-align: right;
        white-space: nowrap;
        padding-top: 13pt;
        padding-right: 15pt;
        text-transform: uppercase;
        width: 210pt;
        display: block;
      }
      .sourceText {
        padding: 0 5pt;
      }
      .textTitle {
        font-family: georgia;
        font-weight: bold;
        font-style: italic;
        font-size: 15pt;
        color: #323B43;
        text-align: Center;
      }
      .textSection {
        font-family: georgia;
        font-style: italic;
        font-size: 15pt;
        color: #323B43;
        text-align: Center;
      }
      .textChapter {
        font-family: charter;
        color: #CF1E00;
        font-size: 16pt;
        position: relative;
        top: -0.05em;
      }
      .textVerse {
        font-size: 11pt;
        position: relative;
        top: -0.4em;
      }
      .textIndent {
        padding-left: 2em;
      }
    </style>
  </head>
  <body id="scripture">
    {{BODY}}
  </body>
</html>
`;
