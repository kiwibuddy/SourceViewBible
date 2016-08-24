const HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Scripture</title>
    <meta charset="utf-8"/>
    <style type="text/css">
      p, b {
        margin: 0;
        padding: 0;
        -webkit-margin-before: 0;
      }
      i {
        color: #323B43;
      }
      i + .footnoteIndicator {
        color: #323B43;
      }
      body {
        font-family: Georgia;
        font-size: 13pt;
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
        color: #4A4A4A;
      }
      .sourceRed {
        color: #fc3d39;
      }
      .sourceGreen {
        color: #19A555;
      }
      .sourceBlue {
        color: #218aff;
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
      .embeddedDocument {
        font-style: italic;
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
        color: #CF1E00;
        font-size: 1em;
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
      .textVerse span {
        padding-bottom: .4em;
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
      .footnoteOverlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: -3pt;
        left: 0;
        background-color: rgba(0,0,0,.15);
        z-index: 100;
      }
      .footnoteContainer {
        font-family: -apple-system, "Helvetica Neue", "Lucida Grande";
        font-size: 1em;
        line-height: 1.3em;
        color: #59626A;
        position: absolute;
        right: 5pt;
        bottom: 8pt;
        left: 5pt;
        background-color: white;
        box-shadow: 0 1pt 1pt rgba(0,0,0,.10);
        border-radius: 3pt;
      }
      .footnoteHeader {
        font-weight: 600;
        color: #59626A;
        padding: 6pt 8pt;
        border-bottom: 1pt solid rgba(0,0,0,.10);
      }
      .footnoteClose {
        font-weight: normal;
        color: #CF1E00;
        text-decoration: none;
        position: absolute;
        right: 10pt;
      }
      .footnoteContent {
        padding: 8pt;
      }
      .footnoteScroll {
        overflow: scroll;
        max-height: 250pt;
      }
      .footnoteIndicator {
        text-decoration: none;
      }
      .nonCanonicalText .footnoteIndicator {
        color: #323B43;
      }

.highlightFamily { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 100.0%); }
.highlightEconomics { background: linear-gradient(180deg, #FFEACC, #FFEACC 100.0%); }
.highlightGovernment { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 100.0%); }
.highlightReligion { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 100.0%); }
.highlightEducation { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 100.0%); }
.highlightCommunication { background: linear-gradient(180deg, #DEDEF7, #DEDEF7 100.0%); }
.highlightCelebration { background: linear-gradient(180deg, #F9DEEF, #F9DEEF 100.0%); }
.highlightFamily.highlightEconomics { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #FFEACC 50.0%, #FFEACC); }
.highlightFamily.highlightGovernment { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #FFF5CD 50.0%, #FFF5CD); }
.highlightFamily.highlightReligion { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.highlightFamily.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.highlightFamily.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.highlightFamily.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.highlightEconomics.highlightGovernment { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD); }
.highlightEconomics.highlightReligion { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.highlightEconomics.highlightEducation { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.highlightEconomics.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.highlightEconomics.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.highlightGovernment.highlightReligion { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE); }
.highlightGovernment.highlightEducation { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.highlightGovernment.highlightCommunication { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.highlightGovernment.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.highlightReligion.highlightEducation { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7); }
.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7); }
.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #DEDEF7, #DEDEF7 50.0%, #F9DEEF 50.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #FFF5CD 66.667%, #FFF5CD); }
.highlightFamily.highlightEconomics.highlightReligion { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.highlightFamily.highlightEconomics.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.highlightFamily.highlightEconomics.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFEACC 33.333%, #FFEACC 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightReligion { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.highlightFamily.highlightGovernment.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.highlightFamily.highlightGovernment.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightFamily.highlightGovernment.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightFamily.highlightReligion.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.highlightFamily.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightFamily.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightFamily.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightFamily.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightFamily.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightReligion { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #E8F4CE 66.667%, #E8F4CE); }
.highlightEconomics.highlightGovernment.highlightEducation { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.highlightEconomics.highlightGovernment.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightEconomics.highlightGovernment.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #FFF5CD 33.333%, #FFF5CD 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightEconomics.highlightReligion.highlightEducation { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.highlightEconomics.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightEconomics.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightEconomics.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightEconomics.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightEconomics.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightGovernment.highlightReligion.highlightEducation { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #D4F1F7 66.667%, #D4F1F7); }
.highlightGovernment.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightGovernment.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #E8F4CE 33.333%, #E8F4CE 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightGovernment.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightGovernment.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightGovernment.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #DEDEF7 66.667%, #DEDEF7); }
.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #D4F1F7 33.333%, #D4F1F7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #D4F1F7, #D4F1F7 33.333%, #DEDEF7 33.333%, #DEDEF7 66.666%, #F9DEEF 66.667%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #E8F4CE 75.0%, #E8F4CE); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #FFF5CD 50.0%, #FFF5CD 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightReligion.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.highlightFamily.highlightEconomics.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFEACC 25.0%, #FFEACC 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightReligion.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.highlightFamily.highlightGovernment.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightFamily.highlightGovernment.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightFamily.highlightGovernment.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightFamily.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #D4F1F7 75.0%, #D4F1F7); }
.highlightEconomics.highlightGovernment.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightEconomics.highlightGovernment.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightEconomics.highlightGovernment.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #FFF5CD 25.0%, #FFF5CD 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightEconomics.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightEconomics.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightEconomics.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightEconomics.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #DEDEF7 75.0%, #DEDEF7); }
.highlightGovernment.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightGovernment.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #E8F4CE 25.0%, #E8F4CE 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightGovernment.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #E8F4CE, #E8F4CE 25.0%, #D4F1F7 25.0%, #D4F1F7 50.0%, #DEDEF7 50.0%, #DEDEF7 75.0%, #F9DEEF 75.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #D4F1F7 80.0%, #D4F1F7); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #E8F4CE 60.0%, #E8F4CE 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #FFF5CD 40.0%, #FFF5CD 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFEACC 20.0%, #FFEACC 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.highlightFamily.highlightGovernment.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #DEDEF7 80.0%, #DEDEF7); }
.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #D4F1F7 60.0%, #D4F1F7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #E8F4CE 40.0%, #E8F4CE 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #FFF5CD 20.0%, #FFF5CD 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightEconomics.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFF5CD, #FFF5CD 20.0%, #E8F4CE 20.0%, #E8F4CE 40.0%, #D4F1F7 40.0%, #D4F1F7 60.0%, #DEDEF7 60.0%, #DEDEF7 80.0%, #F9DEEF 80.0%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #D4F1F7 66.667%, #D4F1F7 83.334%, #DEDEF7 83.333%, #DEDEF7); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #D4F1F7 66.667%, #D4F1F7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #E8F4CE 50.0%, #E8F4CE 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #FFF5CD 33.333%, #FFF5CD 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFEACC 16.667%, #FFEACC 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.highlightFamily.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 16.667%, #FFF5CD 16.667%, #FFF5CD 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFEACC, #FFEACC 16.667%, #FFF5CD 16.667%, #FFF5CD 33.334%, #E8F4CE 33.333%, #E8F4CE 50.0%, #D4F1F7 50.0%, #D4F1F7 66.667%, #DEDEF7 66.667%, #DEDEF7 83.334%, #F9DEEF 83.333%, #F9DEEF); }
.highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration { background: linear-gradient(180deg, #FFD8D6, #FFD8D6 14.286%, #FFEACC 14.286%, #FFEACC 28.572%, #FFF5CD 28.571%, #FFF5CD 42.857%, #E8F4CE 42.857%, #E8F4CE 57.143%, #D4F1F7 57.143%, #D4F1F7 71.429%, #DEDEF7 71.429%, #DEDEF7 85.715%, #F9DEEF 85.714%, #F9DEEF); }
    </style>
  </head>
  <body id="scripture">
    {{BODY}}

    <script type="text/javascript">
      var opened = false;
      var openedWidth = 140;
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

export default HTML;
