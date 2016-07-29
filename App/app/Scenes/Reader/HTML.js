module.exports = `
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <style type="text/css">
      body {
        font-family: georgia;
        font-size: 15pt;
        color: #323B43;
        line-height: 26pt;
      }
      table {
        margin:0;
        padding:0;
        border-spacing: 0;
        border-collapse: collapse;
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
        color: #323B43;
      }
      .sourceRed {
        color: #E8302C;
      }
      .sourceBlue {
        color: #1D99DF;
      }
      .sourceGreen {
        color: #16C658;
      }
      .sourceTitle {
        font-family: -apple-system, "Helvetica Neue", "Lucida Grande";
        font-size: 10pt;
        color: #9B9B9B;
        text-align: right;
        white-space: nowrap;
        padding-top: 2pt;
        padding-right: 15pt;
        text-transform: uppercase;
      }
      .textTitle {
        font-family: georgia;
        font-weight: bold;
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
  <body>
    {{BODY}}
  </body>
</html>
`;
