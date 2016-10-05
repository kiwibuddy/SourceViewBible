/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native'

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

type Props = {
  title: string,
  navigate: Function,
};

const Note = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationHeader
        navigate={props.navigate}
        title={props.title}
        renderLeftComponent={(props: Object) => (<NavigationBarButton
          title={Localizable.t('back')}
          onPress={() => props.navigate(BACK)}
        />)}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.aboutContainer}>
          <Text style={styles.contentH2}>Translation Philosophy and Methodology.</Text>
          <Text style={styles.contentBody}>English Bible translations tend to be governed by one of two general translation theories. The first theory has been called “formal-equivalence,” “literal,” or “word-for-word” translation. According to this theory, the translator attempts to render each word of the original language into English and seeks to preserve the original syntax and sentence structure as much as possible in translation. The second theory has been called “dynamic-equivalence,” “functional-equivalence,” or “thought-for-thought” translation. The goal of this translation theory is to produce in English the closest natural equivalent of the message expressed by the original-language text, both in meaning and in style.</Text>
          <Text style={styles.contentBody}>Both of these translation theories have their strengths. A formal-equivalence translation preserves aspects of the original text—including ancient idioms, term consistency, and original-language syntax—that are valuable for scholars and professional study. It allows a reader to trace formal elements of the original-language text through the English translation. A dynamic-equivalence translation, on the other hand, focuses on translating the message of the original-language text. It ensures that the meaning of the text is readily apparent to the contemporary reader. This allows the message to come through with immediacy, without requiring the reader to struggle with foreign idioms and awkward syntax. It also facilitates serious study of the text’s message and clarity in both devotional and public reading.</Text>
          <Text style={styles.contentBody}>The pure application of either of these translation philosophies would create translations at opposite ends of the translation spectrum. But in reality, all translations contain a mixture of these two philosophies. A purely formal-equivalence translation would be unintelligible in English, and a purely dynamic-equivalence translation would risk being unfaithful to the original. That is why translations shaped by dynamic-equivalence theory are usually quite literal when the original text is relatively clear, and the translations shaped by formal-equivalence theory are sometimes quite dynamic when the original text is obscure.</Text>
          <Text style={styles.contentBody}>The translators of the New Living Translation set out to render the message of the original texts of Scripture into clear, contemporary English. As they did so, they kept the concerns of both formal-equivalence and dynamic-equivalence in mind. On the one hand, they translated as simply and literally as possible when that approach yielded an accurate, clear, and natural English text. Many words and phrases were rendered literally and consistently into English, preserving essential literary and rhetorical devices, ancient metaphors, and word choices that give structure to the text and provide echoes of meaning from one passage to the next.</Text>
          <Text style={styles.contentBody}>On the other hand, the translators rendered the message more dynamically when the literal rendering was hard to understand, was misleading, or yielded archaic or foreign wording. They clarified difficult metaphors and terms to aid in the reader’s understanding. The translators first struggled with the meaning of the words and phrases in the ancient context; then they rendered the message into clear, natural English. Their goal was to be both faithful to the ancient texts and eminently readable. The result is a translation that is both exegetically accurate and idiomatically powerful.</Text>
          <Text style={styles.contentH2}>Translation Process and Team.</Text>
          <Text style={styles.contentBody}>necessary to enter into the thought patterns of the ancient authors and then to render their ideas, connotations, and effects into clear, contemporary English. To begin this process, qualified biblical scholars were needed to interpret the meaning of the original text and to check it against our base English translation. In order to guard against personal and theological biases, the scholars needed to represent a diverse group of Evangelicals who would employ the best exegetical tools. Then to work alongside the scholars, skilled English stylists were needed to shape the text into clear, contemporary English.</Text>
          <Text style={styles.contentBody}>With these concerns in mind, the Bible Translation Committee recruited teams of scholars that represented a broad spectrum of denominations, theological perspectives, and backgrounds within the worldwide Evangelical community. (These scholars are listed at the end of this introduction.) Each book of the Bible was assigned to three different scholars with proven expertise in the book or group of books to be reviewed. Each of these scholars made a thorough review of a base translation and submitted suggested revisions to the appropriate Senior Translator. The Senior Translator then reviewed and summarized these suggestions and proposed a first-draft revision of the base text. This draft served as the basis for several additional phases of exegetical and stylistic committee review. Then the Bible Translation Committee jointly reviewed and approved every verse of the final translation.</Text>
          <Text style={styles.contentBody}>Throughout the translation and editing process, the Senior Translators and their scholar teams were given a chance to review the editing done by the team of stylists. This ensured that exegetical errors would not be introduced late in the process and that the entire Bible Translation Committee was happy with the final result. By choosing a team of qualified scholars and skilled stylists and by setting up a process that allowed their interaction throughout the process, the New Living Translation has been refined to preserve the essential formal elements of the original biblical texts, while also creating a clear, understandable English text.</Text>
          <Text style={styles.contentBody}>The New Living Translation was first published in 1996. Shortly after its initial publication, the Bible Translation Committee began a process of further committee review and translation refinement. The purpose of this continued revision was to increase the level of precision without sacrificing the text’s easy-to-understand quality. This second-edition text was completed in 2004, and an additional update with minor changes was subsequently introduced in 2007. This printing of the New Living Translation reflects the updated 2007 text.</Text>
          <Text style={styles.contentH2}>Written to Be Read Aloud.</Text>
          <Text style={styles.contentBody}>It is evident in Scripture that the biblical documents were written to be read aloud, often in public worship (see Nehemiah 8; Luke 4:16-20; 1 Timothy 4:13; Revelation 1:3). It is still the case today that more people will hear the Bible read aloud in church than are likely to read it for themselves. Therefore, a new translation must communicate with clarity and power when it is read publicly. Clarity was a primary goal for the NLT translators, not only to facilitate private reading and understanding, but also to ensure that it would be excellent for public reading and make an immediate and powerful impact on any listener.</Text>
          <Text style={styles.contentH2}>The Texts behind the New Living Translation.</Text>
          <Text style={styles.contentBody}>The Old Testament translators used the Masoretic Text of the Hebrew Bible as represented in Biblia Hebraica Stuttgartensia (1977), with its extensive system of textual notes; this is an update of Rudolf Kittel’s Biblia Hebraica (Stuttgart, 1937). The translators also further compared the Dead Sea Scrolls, the Septuagint and other Greek manuscripts, the Samaritan Pentateuch, the Syriac Peshitta, the Latin Vulgate, and any other versions or manuscripts that shed light on the meaning of difficult passages.</Text>
          <Text style={styles.contentBody}>The New Testament translators used the two standard editions of the Greek New Testament: the Greek New Testament, published by the United Bible Societies (UBS, fourth revised edition, 1993), and Novum Testamentum Graece, edited by Nestle and Aland (NA, twenty-seventh edition, 1993). These two editions, which have the same text but differ in punctuation and textual notes, represent, for the most part, the best in modern textual scholarship. However, in cases where strong textual or other scholarly evidence supported the decision, the translators sometimes chose to differ from the UBS and NA Greek texts and followed variant readings found in other ancient witnesses. Significant textual variants of this sort are always noted in the textual notes of the New Living Translation.</Text>
          <Text style={styles.contentH2}>Translation Issues.</Text>
          <Text style={styles.contentBody}>The translators have made a conscious effort to provide a text that can be easily understood by the typical reader of modern English. To this end, we sought to use only vocabulary and language structures in common use today. We avoided using language likely to become quickly dated or that reflects only a narrow sub-dialect of English, with the goal of making the New Living Translation as broadly useful and timeless as possible.</Text>
          <Text style={styles.contentBody}>But our concern for readability goes beyond the concerns of vocabulary and sentence structure. We are also concerned about historical and cultural barriers to understanding the Bible, and we have sought to translate terms shrouded in history and culture in ways that can be immediately understood. To this end:</Text>
          <Text style={styles.contentBody}>• We have converted ancient weights and measures (for example, “ephah” [a unit of dry volume] or “cubit” [a unit of length]) to modern English (American) equivalents, since the ancient measures are not generally meaningful to today’s readers. Then in the textual footnotes we offer the literal Hebrew, Aramaic, or Greek measures, along with modern metric equivalents.</Text>
          <Text style={styles.contentBody}>• Instead of translating ancient currency values literally, we have expressed them in common terms that communicate the message. For example, in the Old Testament, “ten shekels of silver” becomes “ten pieces of silver” to convey the intended message. In the New Testament, we have often translated the “denarius” as “the normal daily wage” to facilitate understanding. Then a footnote offers: “Greek a denarius, the payment for a full day’s wage.” In general, we give a clear English rendering and then state the literal Hebrew, Aramaic, or Greek in a textual footnote.</Text>
          <Text style={styles.contentBody}>• Since the names of Hebrew months are unknown to most contemporary readers, and since the Hebrew lunar calendar fluctuates from year to year in relation to the solar calendar used today, we have looked for clear ways to communicate the time of year the Hebrew months (such as Abib) refer to. When an expanded or interpretive rendering is given in the text, a textual note gives the literal rendering. Where it is possible to define a specific ancient date in terms of our modern calendar, we use modern dates in the text. A textual footnote then gives the literal Hebrew date and states the rationale for our rendering. For example, Ezra 6:15 pinpoints the date when the post-exilic Temple was completed in Jerusalem: “the third day of the month Adar.” This was during the sixth year of King Darius’s reign (that is, 515 b.c.). We have translated that date as March 12, with a footnote giving the Hebrew and identifying the year as 515 b.c.</Text>
          <Text style={styles.contentBody}>• Since ancient references to the time of day differ from our modern methods of denoting time, we have used renderings that are instantly understandable to the modern reader. Accordingly, we have rendered specific times of day by using approximate equivalents in terms of our common “o’clock” system. On occasion, translations such as “at dawn the next morning” or “as the sun was setting” have been used when the biblical reference is more general.</Text>
          <Text style={styles.contentBody}>• When the meaning of a proper name (or a wordplay inherent in a proper name) is relevant to the message of the text, its meaning is often illuminated with a textual footnote. For example, in Exodus 2:10 the text reads: “The princess named him Moses, for she explained, ‘I lifted him out of the water.’” The accompanying footnote reads: “Moses sounds like a Hebrew term that means ‘to lift out.’ ”</Text>
          <Text style={styles.contentBody}>• Sometimes, when the actual meaning of a name is clear, that meaning is included in parentheses within the text itself. For example, the text at Genesis 16:11 reads: “You are to name him Ishmael (which means ‘God hears’), for the Lord has heard your cry of distress.” Since the original hearers and readers would have instantly understood the meaning of the name “Ishmael,” we have provided modern readers with the same information so they can experience the text in a similar way.</Text>
          <Text style={styles.contentBody}>• Many words and phrases carry a great deal of cultural meaning that was obvious to the original readers but needs explanation in our own culture. For example, the phrase “they beat their breasts” (Luke 23:48) in ancient times meant that people were very upset, often in mourning. In our translation we chose to translate this phrase dynamically for clarity: “They went home in deep sorrow.” Then we included a footnote with the literal Greek, which reads: “Greek went home beating their breasts.” In other similar cases, however, we have sometimes chosen to illuminate the existing literal expression to make it immediately understandable. For example, here we might have expanded the literal Greek phrase to read: “They went home beating their breasts in sorrow.” If we had done this, we would not have included a textual footnote, since the literal Greek clearly appears in translation.</Text>
          <Text style={styles.contentBody}>• Metaphorical language is sometimes difficult for contemporary readers to understand, so at times we have chosen to translate or illuminate the meaning of a metaphor. For example, the ancient poet writes, “Your neck is like the tower of David” (Song of Songs 4:4). We have rendered it “Your neck is as beautiful as the tower of David” to clarify the intended positive meaning of the simile. Another example comes in Ecclesiastes 12:3, which can be literally rendered: “Remember him . . . when the grinding women cease because they are few, and the women who look through the windows see dimly.” We have rendered it: “Remember him before your teeth—your few remaining servants—stop grinding; and before your eyes—the women looking through the windows—see dimly.” We clarified such metaphors only when we believed a typical reader might be confused by the literal text.</Text>
          <Text style={styles.contentBody}>• When the content of the original language text is poetic in character, we have rendered it in English poetic form. We sought to break lines in ways that clarify and highlight the relationships between phrases of the text. Hebrew poetry often uses parallelism, a literary form where a second phrase (or in some instances a third or fourth) echoes the initial phrase in some way. In Hebrew parallelism, the subsequent parallel phrases continue, while also furthering and sharpening, the thought expressed in the initial line or phrase. Whenever possible, we sought to represent these parallel phrases in natural poetic English.</Text>
          <Text style={styles.contentBody}>• The Greek term hoi Ioudaioi is literally translated “the Jews” in many English translations. In the Gospel of John, however, this term doesn’t always refer to the Jewish people generally. In some contexts, it refers more particularly to the Jewish religious leaders. We have attempted to capture the meaning in these different contexts by using terms such as “the people” (with a footnote: Greek the Jewish people) or “the religious leaders,” where appropriate.</Text>
          <Text style={styles.contentBody}>• One challenge we faced was how to translate accurately the ancient biblical text that was originally written in a context where male-oriented terms were used to refer to humanity generally. We needed to respect the nature of the ancient context while also trying to make the translation clear to a modern audience that tends to read male-oriented language as applying only to males. Often the original text, though using masculine nouns and pronouns, clearly intends that the message be applied to both men and women. A typical example is found in the New Testament letters, where the believers are called “brothers” (adelphoi). Yet it is clear from the content of these letters that they were addressed to all the believers—male and female. Thus, we have usually translated this Greek word as “brothers and sisters” in order to represent the historical situation more accurately.</Text>
          <Text style={styles.contentBody}>We have also been sensitive to passages where the text applies generally to human beings or to the human condition. In some instances we have used plural pronouns (they, them) in place of the masculine singular (he, him). For example, a traditional rendering of Proverbs 22:6 is: “Train up a child in the way he should go, and when he is old he will not turn from it.” We have rendered it: “Direct your children onto the right path, and when they are older, they will not leave it.” At times, we have also replaced third person pronouns with the second person to ensure clarity. A traditional rendering of Proverbs 26:27 is: “He who digs a pit will fall into it, and he who rolls a stone, it will come back on him.” We have rendered it: “If you set a trap for others, you will get caught in it yourself. If you roll a boulder down on others, it will roll back and crush you.”</Text>
          <Text style={styles.contentBody}>We should emphasize, however, that all masculine nouns and pronouns used to represent God (for example, “Father”) have been maintained without exception. All decisions of this kind have been driven by the concern to reflect accurately the intended meaning of the original texts of Scripture.</Text>
          <Text style={styles.contentH2}>Lexical Consistency in Terminology.</Text>
          <Text style={styles.contentBody}>For the sake of clarity, we have translated certain original-language terms consistently, especially within synoptic passages and for commonly repeated rhetorical phrases, and within certain word categories such as divine names and non-theological technical terminology (e.g., liturgical, legal, cultural, zoological, and botanical terms). For theological terms, we have allowed a greater semantic range of acceptable English words or phrases for a single Hebrew or Greek word. We have avoided some theological terms that are not readily understood by many modern readers. For example, we avoided using words such as “justification” and “sanctification,” which are carryovers from Latin translations. In place of these words, we have provided renderings such as “made right with God” and “made holy.”</Text>
          <Text style={styles.contentH2}>The Spelling of Proper Names.</Text>
          <Text style={styles.contentBody}>Many individuals in the Bible, especially the Old Testament, are known by more than one name (e.g., Uzziah/Azariah). For the sake of clarity, we have tried to use a single spelling for any one individual, footnoting the literal spelling whenever we differ from it. This is especially helpful in delineating the kings of Israel and Judah. King Joash/Jehoash of Israel has been consistently called Jehoash, while King Joash/Jehoash of Judah is called Joash. A similar distinction has been used to distinguish between Joram/Jehoram of Israel and Joram/Jehoram of Judah. All such decisions were made with the goal of clarifying the text for the reader. When the ancient biblical writers clearly had a theological purpose in their choice of a variant name (e.g., Esh-baal/Ishbosheth), the different names have been maintained with an explanatory footnote.</Text>
          <Text style={styles.contentBody}>For the names Jacob and Israel, which are used interchangeably for both the individual patriarch and the nation, we generally render it “Israel” when it refers to the nation and “Jacob” when it refers to the individual. When our rendering of the name differs from the underlying Hebrew text, we provide a textual footnote, which includes this explanation: “The names ‘Jacob’ and ‘Israel’ are often interchanged throughout the Old Testament, referring sometimes to the individual patriarch and sometimes to the nation.”</Text>
          <Text style={styles.contentH2}>The Rendering of Divine Names.</Text>
          <Text style={styles.contentBody}>All appearances of ’el, ’elohim, or ’eloah have been translated “God,” except where the context demands the translation “god(s).” We have generally rendered the tetragrammaton (YHWH) consistently as “the Lord,” utilizing a form with small capitals that is common among English translations. This will distinguish it from the name—adonai, which we render “Lord.” When—adonai and YHWH appear together, we have rendered it “Sovereign Lord.” This also distinguishes—adonai YHWH from cases where YHWH appears with—elohim, which is rendered “Lord God.” When YH (the short form of YHWH) and YHWH appear together, we have rendered it “Lord God.” When YHWH appears with the term tseba’oth, we have rendered it “Lord of Heaven’s Armies” to translate the meaning of the name. In a few cases, we have utilized the transliteration, Yahweh, when the personal character of the name is being invoked in contrast to another divine name or the name of some other god (for example, see Exodus 3:15; 6:2-3).</Text>
          <Text style={styles.contentBody}>In the New Testament, the Greek word christos has been translated as “Messiah” when the context assumes a Jewish audience. When a Gentile audience can be assumed, christos has been translated as “Christ.” The Greek word kurios is consistently translated “Lord,” except that it is translated “Lord” wherever the New Testament text explicitly quotes from the Old Testament, and the text there has it in small capitals.</Text>
          <Text style={styles.contentH2}>Textual Footnotes.</Text>
          <Text style={styles.contentBody}>The New Living Translation provides several kinds of textual footnotes, all designated in the text with an asterisk:</Text>
          <Text style={styles.contentBody}>• When for the sake of clarity the NLT renders a difficult or potentially confusing phrase dynamically, we generally give the literal rendering in a textual footnote. This allows the reader to see the literal source of our dynamic rendering and how our translation relates to other more literal translations. These notes are prefaced with “Hebrew,” “Aramaic,” or “Greek,” identifying the language of the underlying source text. For example, in Acts 2:42 we translated the literal “breaking of bread” (from the Greek) as “the Lord’s Supper” to clarify that this verse refers to the ceremonial practice of the church rather than just an ordinary meal. Then we attached a footnote to “the Lord’s Supper,” which reads: “Greek the breaking of bread.”</Text>
          <Text style={styles.contentBody}>• Textual footnotes are also used to show alternative renderings, prefaced with the word “Or.” These normally occur for passages where an aspect of the meaning is debated. On occasion, we also provide notes on words or phrases that represent a departure from long-standing tradition. These notes are prefaced with “Traditionally rendered.” For example, the footnote to the translation “serious skin disease” at Leviticus 13:2 says: “Traditionally rendered leprosy. The Hebrew word used throughout this passage is used to describe various skin diseases.”</Text>
          <Text style={styles.contentBody}>• When our translators follow a textual variant that differs significantly from our standard Hebrew or Greek texts (listed earlier), we document that difference with a footnote. We also footnote cases when the NLT excludes a passage that is included in the Greek text known as the Textus Receptus (and familiar to readers through its translation in the King James Version). In such cases, we offer a translation of the excluded text in a footnote, even though it is generally recognized as a later addition to the Greek text and not part of the original Greek New Testament.</Text>
          <Text style={styles.contentBody}>• All Old Testament passages that are quoted in the New Testament are identified by a textual footnote at the New Testament location. When the New Testament clearly quotes from the Greek translation of the Old Testament, and when it differs significantly in wording from the Hebrew text, we also place a textual footnote at the Old Testament location. This note includes a rendering of the Greek version, along with a cross-reference to the New Testament passage(s) where it is cited (for example, see notes on Psalms 8:2; 53:3; Proverbs 3:12).</Text>
          <Text style={styles.contentBody}>• Some textual footnotes provide cultural and historical information on places, things, and people in the Bible that are probably obscure to modern readers. Such notes should aid the reader in understanding the message of the text. For example, in Acts 12:1, “King Herod” is named in this translation as “King Herod Agrippa” and is identified in a footnote as being “the nephew of Herod Antipas and a grandson of Herod the Great.”</Text>
          <Text style={styles.contentBody}>• When the meaning of a proper name (or a wordplay inherent in a proper name) is relevant to the meaning of the text, it is either illuminated with a textual footnote or included within parentheses in the text itself. For example, the footnote concerning the name “Eve” at Genesis 3:20 reads: “Eve sounds like a Hebrew term that means ‘to give life.’ ” This wordplay in the Hebrew illuminates the meaning of the text, which goes on to say that Eve “would be the mother of all who live.”</Text>
          <Text style={styles.contentBody}>As we submit this translation for publication, we recognize that any translation of the Scriptures is subject to limitations and imperfections. Anyone who has attempted to communicate the richness of God’s Word into another language will realize it is impossible to make a perfect translation. Recognizing these limitations, we sought God’s guidance and wisdom throughout this project. Now we pray that he will accept our efforts and use this translation for the benefit of the church and of all people.</Text>
          <Text style={styles.contentBody}>We pray that the New Living Translation will overcome some of the barriers of history, culture, and language that have kept people from reading and understanding God’s Word. We hope that readers unfamiliar with the Bible will find the words clear and easy to understand and that readers well versed in the Scriptures will gain a fresh perspective. We pray that readers will gain insight and wisdom for living, but most of all that they will meet the God of the Bible and be forever changed by knowing him.</Text>
          <Text style={styles.contentBody}>— The Bible Translation Committee, October 2007</Text>
          <Text style={styles.contentHeader}>Bible Translation Team</Text>
          <Text style={styles.contentH2}>PENTATEUCH</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Daniel I. Block, General Reviewer</Text>
          <Text style={styles.contentBody}>The Southern Baptist Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>GENESIS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Allan Ross, Trinity Episcopal Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>John Sailhamer, Northwestern College</Text>
          <Text style={styles.contentBody}>Gordon Wenham, Trinity Theological College, Bristol</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>EXODUS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Robert Bergen, Hannibal-LaGrange College</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Daniel I. Block, The Southern Baptist Theological Seminary</Text>
          <Text style={styles.contentBody}>Eugene Carpenter, Bethel College, Mishawaka, Indiana</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>LEVITICUS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>David Baker, Ashland Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Victor Hamilton, Asbury College</Text>
          <Text style={styles.contentBody}>Kenneth Mathews, Beeson Divinity School, Samford University</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>NUMBERS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Dale A. Brueggemann, Assemblies of God Division of Foreign Missions</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Roland K. Harrison (deceased), Wycliffe College</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Paul R. House, Beeson Divinity School, Samford University</Text>
          <Text style={styles.contentBody}>Gerald L. Mattingly, Johnson Bible College</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>DEUTERONOMY</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>J. Gordon McConville, The Cheltenham and Gloucester College of Higher Education</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Eugene H. Merrill, Dallas Theological Seminary</Text>
          <Text style={styles.contentBody}>John A. Thompson, University of Melbourn</Text>
          <Text style={styles.contentH2}>HISTORICAL BOOKS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Barry J. Beitzel, General Reviewer</Text>
          <Text style={styles.contentBody}>Trinity Evangelical Divinity School</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>JOSHUA/JUDGES</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Carl E. Armerding, Schloss Mittersill Study Centre</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Barry J. Beitzel, Trinity Evangelical Divinity School</Text>
          <Text style={styles.contentBody}>Lawson Stone, Asbury Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>1 & 2 SAMUEL</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Barry J. Beitzel, Trinity Evangelical Divinity School</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>V. Philips Long, Covenant Theological Seminary</Text>
          <Text style={styles.contentBody}>J. Robert Vannoy, Biblical Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>1 & 2 KINGS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Bill T. Arnold, Asbury Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>William H. Barnes, Southeastern College of the Assemblies of God</Text>
          <Text style={styles.contentBody}>Frederic W. Bush, Fuller Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>1 & 2 CHRONICLES</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Raymond B. Dillard (deceased), Westminster Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>David A. Dorsey, Evangelical School of Theology</Text>
          <Text style={styles.contentBody}>Terry Eves, Calvin College</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>EZRA/NEHEMIAH/ESTHER/RUTH</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>William C. Williams, Southern California College</Text>
          <Text style={styles.contentBody}>Hugh G. M. Williamson, Oxford University</Text>
          <Text style={styles.contentH2}>PROPHETS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>John N. Oswalt, General Reviewer</Text>
          <Text style={styles.contentBody}>Asbury Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>ISAIAH</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>John N. Oswalt, Asbury Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Gary Smith, Bethel Theological Seminary</Text>
          <Text style={styles.contentBody}>John Walton, Moody Bible Institute</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>JEREMIAH/LAMENTATIONS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>G. Herbert Livingston, Asbury Theological Seminary</Text>
          <Text style={styles.contentBody}>Elmer A. Martens, Mennonite Brethren Biblical Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>EZEKIEL</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Daniel I. Block, The Southern Baptist Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>David H. Engelhard, Calvin Theological Seminary</Text>
          <Text style={styles.contentBody}>David Thompson, Asbury Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>DANIEL/HAGGAI/ZECHARIAH/MALACHI</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Joyce Baldwin Caine (deceased), Trinity College, Bristol</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Douglas Gropp, Catholic University of America</Text>
          <Text style={styles.contentBody}>Roy Hayden, Oral Roberts School of Theology</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>HOSEA–ZEPHANIAH</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Joseph Coleson, Nazarene Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Andrew Hill, Wheaton College</Text>
          <Text style={styles.contentBody}>Richard Patterson, Professor Emeritus, Liberty University</Text>
          <Text style={styles.contentH2}>GOSPELS AND ACTS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Grant R. Osborne, General Reviewer</Text>
          <Text style={styles.contentBody}>Trinity Evangelical Divinity School</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>MARK</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Robert Guelich (deceased), Fuller Theological Seminary</Text>
          <Text style={styles.contentBody}>Grant R. Osborne, Trinity Evangelical Divinity School</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>LUKE</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Darrel Bock, Dallas Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Scot McKnight, North Park College</Text>
          <Text style={styles.contentBody}>Robert Stein, Bethel Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>JOHN</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Gary M. Burge, Wheaton College</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Philip W. Comfort, Wheaton College</Text>
          <Text style={styles.contentBody}>Marianne Meye Thompson, Fuller Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>ACTS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>D. A. Carson, Trinity Evangelical Divinity School</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>William J. Larkin, Columbia Biblical Seminary</Text>
          <Text style={styles.contentBody}>Roger Mohrlang, Whitworth College</Text>
          <Text style={styles.contentH2}>LETTERS AND REVELATION</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Norman R. Ericson, General Reviewer</Text>
          <Text style={styles.contentBody}>Wheaton College</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>ROMANS/GALATIANS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Gerald Borchert, The Southern Baptist Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Douglas J. Moo, Trinity Evangelical Divinity School</Text>
          <Text style={styles.contentBody}>Thomas R. Schreiner, Bethel Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>1 & 2 CORINTHIANS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Joseph Alexanian, Trinity International University</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Linda Belleville, North Park Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Douglas A. Oss, Central Bible College</Text>
          <Text style={styles.contentBody}>Robert Sloan, Houston Baptist University</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>EPHESIANS–PHILEMON</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Harold W. Hoehner (deceased), Dallas Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Moises Silva, Gordon-Conwell Theological Seminary</Text>
          <Text style={styles.contentBody}>Klyne Snodgrass, North Park Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>EPHESIANS–PHILEMON</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Harold W. Hoehner (deceased), Dallas Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Moises Silva, Gordon-Conwell Theological Seminary</Text>
          <Text style={styles.contentBody}>Klyne Snodgrass, North Park Theological Seminary</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>HEBREWS/JAMES/1 & 2 PETER/JUDE</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Peter Davids, St. Stephen’s University</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Norman R. Ericson, Wheaton College</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>William Lane, Seattle Pacific University</Text>
          <Text style={styles.contentBody}>J. Ramsey Michaels, S.W. Missouri State University</Text>
          <Text style={[styles.contentBody, {fontWeight: 'bold', marginBottom: 0}]}>1–3 JOHN/REVELATION</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Greg Beale, Westminster Theological Seminary</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Robert Mounce, Whitworth College</Text>
          <Text style={styles.contentBody}>M. Robert Mulholland Jr., Asbury Theological Seminary</Text>
          <Text style={styles.contentH2}>SPECIAL REVIEWERS</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>F. F. Bruce (deceased), University of Manchester</Text>
          <Text style={styles.contentBody}>Kenneth N. Taylor, Tyndale House Publishers</Text>
          <Text style={styles.contentH2}>COORDINATING TEAM</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Mark R. Norton, Managing Editor and O.T. Coordinating Editor</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Philip W. Comfort, N.T. Coordinating Editor</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Ronald A. Beers, Executive Director and Stylist</Text>
          <Text style={[styles.contentBody, {marginBottom: 0}]}>Mark D. Taylor, Director and Chief Stylist</Text>
          <Text style={styles.contentBody}>Daniel W. Taylor, Consultant</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  aboutContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  contentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#323B43',
    marginBottom: 5,
  },
  contentH2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#323B43',
    marginTop: 5,
    marginBottom: 5,
  },
  contentBody: {
    fontSize: 17,
    lineHeight: 24,
    color: '#59626A',
    marginBottom: 10,
  },
  separator: {
    ...StyleSheet.styles.separator,
      marginRight: -15,
      marginVertical: 10,
  },
});

export default Note;
