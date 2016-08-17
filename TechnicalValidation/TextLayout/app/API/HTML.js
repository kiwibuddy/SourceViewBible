const HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Scripture</title>
    <meta charset="utf-8"/>
    <style type="text/css">
      html, body {
        overflow-x: hidden !important;
      }
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
      var ready = false;

      document.onreadystatechange = function() {
      	if (ready) return;
      	if (document.readyState == 'interactive' || document.readyState == 'complete') {
      		ready = true;

          document.addEventListener('touchstart', touchStarted, false);
          document.addEventListener('touchmove', move, false);
          document.addEventListener('touchend', touchEnded, false);

          function touchStarted(e) {
            document.getElementById('table').style.transform = 'translate3d(100pt, 0px, 0px)';
          }

          function move(e) {
            var x = e.touches[0].pageX;
            document.getElementById('table').style.transform = 'translate3d(' + x +'pt, 0px, 0px)';
          }

          function touchEnded(e) {
            // document.getElementById('table').style.transform = 'translate3d(0pt, 0px, 0px)';
          }
      	}
      };
    </script>
  </body>
</html>
`;

export default HTML;
