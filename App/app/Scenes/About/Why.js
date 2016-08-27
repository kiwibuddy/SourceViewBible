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

const Why = (props: Props) => {
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
        <Text style={styles.contentBody}>In your hands you hold a fresh, innovative way to read God’s Word. A half millennium has passed since a new way to format the biblical text has been presented to the Body of Christ. This new way to format the Scriptures subdivides the text along natural lines shaped by the dramatic development of the narrative. It allows you to see the story of redemption emerge with a clarity and intensity that will revitalize your hunger for God’s Word. It is an innovation which fundamentally recaptures and restores the dynamic of the original biblical text, a dynamic rich in conversation and action. So, what has led to the development of the Bible with SourceView™ format?</Text>
        <View style={styles.separator} />
        <Text style={styles.contentH2}>How It All Began.</Text>
        <Text style={styles.contentBody}>When the original biblical texts were composed, each was written as a whole, undivided document. They looked quite different from what we are accustomed to holding in our hands as the Word of God. Whether written on animal skins or parchment each book was a complete unit, with no subdivisions. The original scrolls had no chapter or verse breaks, no editor’s subtitles or explanatory footnotes, and no cross-references in the margins. It was just the text.</Text>
        <Text style={styles.contentH2}>Quoting the Old Testament.</Text>
        <Text style={styles.contentBody}>When the gospel writers made reference to the Hebrew Scriptures, known to us today as the Old Testament, they did not quote the chapter and verse, because chapters and verses did not exist. There are several ways the gospel writers used to refer to the original text. Some quotations were made with no specific reference to the original text at all.</Text>
        <Text style={styles.contentBody}>When the gospel writers made reference to the Hebrew Scriptures, known to us today as the Old Testament, they did not quote the chapter and verse, because chapters "and verses did not exist. There are several ways the gospel writers used to refer to the original text. Some quotations were made with no specific reference to the original text at all.</Text>
        <Text style={styles.contentBody}>At other times the gospel writers simply state, “the Scriptures say” (or “declare” or “refer”) to indicate that the Hebrew Scriptures are being quoted. There are several variations of this. Besides declaring “it is written” we see references made in question form, past tense, in connection with the law, the prophets in general or a specific prophet or author. Of course, that which is written can be read, and thus the gospel writers frequently refer to the reading of Scripture.</Text>
        <Text style={styles.contentBody}>The gospels quote the Old Testament by also stating, “our ancestors were told,” or “the commandment/law says” or “the Scriptures record.” Sometimes the reference is made to who spoke, said, allowed, commanded, or declared in the Old Testament passage, either God, the prophets in general, or some specific person.</Text>
        <Text style={styles.contentBody}>Still at other times the gospel writers quote the Old Testament by referring to it as “this prophecy,” the “Scriptures,” the “writings,” the “book,” the “scroll,” the “law,” or the “prophets.” Philip referred to the whole of the Hebrew Scriptures as “Moses and the prophets.” Jesus likewise spoke of “the law and the prophets” or a similar phrase to refer to the Scriptures as a whole On at least one occasion he pointed to the Old Testament as “the law of Moses and the prophets and … the psalms,” employing the traditional Hebrew tri-partite division of the Scriptures.</Text>
        <Text style={styles.contentH2}>Read and Read Some More.</Text>
        <Text style={styles.contentBody}>All of these ways of referring to the Old Testament are general and non-specific because there were no subdivisions within the ancient books. If the reader wanted to verify the correctness and context of the quotation as did the Bereans, they would have had to read great portions of Scripture to even locate the specific passage under discussion.</Text>
        <Text style={styles.contentBody}>The best that could be done in the New Testament era was to help the hearer narrow down their search by limiting the search area to one of the three Hebrew divisions of the Scripture, such as the law or the prophets; or by reducing the amount of text to be searched by identifying the original Old Testament author. Even so, the reader would still have an enormous amount to read to locate a specific passage.</Text>
        <Text style={styles.contentH2}>Quoting Specific Authors.</Text>
        <Text style={styles.contentBody}>So the gospel writers at times identify a quotation as being from Isaiah. In order to locate the quotation one would have to remember if it is at the beginning of the scroll, in the middle or towards the end. It would take some time to locate it, because there was no precise way to reference the given passage. In Luke 4:16-17 we read that Jesus “stood up to read the Scriptures. The scroll of Isaiah the prophet was handed to him. He unrolled the scroll and found the place where this was written.” Today we refer to the passage Jesus read as Isaiah 61:1-2. But in his day, no such specific reference existed.</Text>
        <Text style={styles.contentBody}>To add to the scope of the task, we must remember that when seeking to locate a passage referred to as Isaiah’s it would not be sufficient to look in the book of Isaiah alone, because Isaiah is also quoted in 2 Kings and 2 Chronicles. So to locate a passage authored by Isaiah involved quite a treasure hunt. And in the hunt you could come across some unexpected surprises. For example, Mark begins his gospel stating, “just as the prophet Isaiah had written,” but then proceeds to quote both Isaiah and Malachi!</Text>
        <Text style={styles.contentBody}>When gospel references are made to Jeremiah, the reader would have to search both the book of Jeremiah and Lamentations for the prophet’s words, and be aware that comments about Jeremiah are made in 2 Chronicles, Ezra, and Daniel. The search could be long and once again sprinkled with surprises. For when Matthew compares the events of Jesus’ final hours to the prophetic words about the Messiah he states that it “fulfilled the prophecy of Jeremiah,” but then proceeds to weave together two quotations, one from Jeremiah and another from Zechariah.</Text>
        <Text style={styles.contentBody}>The range of the search is even greater when trying to locate a quotation attributed to Moses. He is regarded as the author of the first five books of the Bible: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. But that is just the beginning. His words can be found in Joshua and Psalm 90. Numerous references to him are made in Judges, 1 Samuel, 1 and 2 Kings, 1 and 2 Chronicles, Ezra, Nehemiah, Psalms, Isaiah, Jeremiah, Daniel, Micah, and Malachi. No wonder Jesus tried to narrow down the search range when responding to the Sadducees in the temple by saying, “But now, as to whether the dead will be raised—haven’t you ever read about this in the writings of Moses, in the story of the burning bush? Long after Abraham, Isaac, and Jacob had died, God said to Moses, ‘I am the God of Abraham, the God of Isaac, and the God of Jacob.’"</Text>
        <Text style={styles.contentBody}>When the gospel writers quote David, the serious reader would have to check out 1 and 2 Samuel, 1 Kings, 1 Chronicles, and the Psalms. Luke obviously sought to help out the inquisitive reader when he quotes Jesus as saying, “David himself wrote in the book of Psalms.” Still the search would be no small task if one was not familiar with the Hebrew psalter.</Text>
        <Text style={styles.contentBody}>Besides the aforementioned Isaiah, Jeremiah, Moses, and David, the only other Old Testament author mentioned by name in the gospels is Daniel. Although only these five authors of the Hebrew Scriptures are named, eighteen Old Testament books are quoted by the gospel writers. So it is clear that the challenge was great for the reader in antiquity to discover the original passage as the scriptural documents had no handy or convenient way to reference a particular portion of the text.</Text>
        <Text style={styles.contentH2}>Finding A Better Way.</Text>
        <Text style={styles.contentBody}>Some kind of reference tool was needed. As more and more people wanted to study God’s Word, a way had to be created to easily and quickly refer to a given portion of the text. The search was on to find such a tool to facilitate the quick and accurate study of the Scriptures. Several attempts were made which did not result in universal acceptance.</Text>
        <Text style={styles.contentBody}>The first subdivision of the scriptural text was done by Jewish rabbis before the time of Christ. The purpose was liturgical and devotional in nature. They divided the five books of the Torah into parshiot (“portions”) ranging from 54 to 167. The number that came to prevail was 154, as one “portion” could be read each Sabbath in the synagogue, thus reading through the five books of Moses in a three-year cycle. This custom is noted by James in his speech at the Council of Jerusalem, in which he acknowledges that “these laws of Moses have been preached in Jewish synagogues in every city on every Sabbath for many generations.”</Text>
        <Text style={styles.contentH2}>Early Innovations.</Text>
        <Text style={styles.contentBody}>A groundbreaking innovation would be introduced by the remarkable Stephen Langton. Born in England in the latter part of the twelfth century, Langton was named the forty-seventh Archbishop of Canterbury in 1207 by Pope Innocent III, but was not allowed to enter England by King John until 1213. Though the pope had excommunicated King John in 1209 for his opposition to Rome, Langton absolved him as his first episcopal act in 1213. Langton was a popular preacher and authored many Bible commentaries and other Christian works. Together with Saire de Quincey, he wrote one of the foundational documents of democracy, the Magna Carta, which was signed in Runnymede on June 15, 1215.</Text>
        <Text style={styles.contentBody}>In 1205 Langton divided the Bible into 1189 chapters, the same divisions with only slight variations which are still used to this day. The main reason was to facilitate the quick referencing of any given text. It would take some time before Langton’s innovation gained acceptance. The first Bible to be printed with these 1189 chapter divisions was the Wycliffe English Bible of 1382. It appears that the division of the Bible into precisely this number of chapters may have had more to do with some of Langton’s mathematical interests than it did with the natural divisions of biblical narrative. “The chapters were at first subdivided into seven portions (not paragraphs), marked in the margin by the letters A, B, C, D, E, F, G, reference being made by the chapter number and the letter under which the passage occurred.”</Text>
        <Text style={styles.contentH2}>Other Efforts.</Text>
        <Text style={styles.contentBody}>After Langton’s invention, but prior to its universal acceptance and use, other systems of subdividing the Bible were also attempted. Perhaps the best known is that of Cardinal Hugo of Saint Cher. Together with his students and some five hundred fellow Dominicans, he developed an alternative means of dividing the text in order to create the first Bible concordance in Latin. This extensive work was completed around 1240. Obviously, no concordance would be possible without first devising a way to reference every portion of the biblical text. This innovation led to the creation of Bible tools which have since then become a mainstay of biblical studies.</Text>
        <Text style={styles.contentBody}>Another initiative was that of the Jewish scholar, Rabbi Mordecai Nathan. He divided the Old Testament into chapters and after ten years of labor completed the first concordance to the Hebrew Scriptures.</Text>
        <Text style={styles.contentH2}>On to Verses.</Text>
        <Text style={styles.contentBody}>Then came Robert Stephanus (also known as Robert Estienne), who was born only fifty years after Gutenberg printed his famous Bible. He was a contemporary of fellow Frenchman John Calvin, and inherited the family printing press in 1524 at a time when the Catholic Church prohibited the printing of Bibles. Undaunted by the church’s opposition, he printed three editions of the Greek New Testament in Paris, in 1546, 1549, and 1550. Shortly thereafter, he emigrated to Geneva to escape persecution. His fourth Greek New Testament he printed in Calvin’s Geneva in 1551, as the Reformation was in full swing. In this edition he introduced a new innovation. He took Langton’s chapter breaks and added his own verse numbers. Tradition has it that these verses inserts were added somewhat randomly as he traveled on horseback to and from his print shop. Four years later, in 1555, Stephanus published the first complete Bible in Latin with chapter and verse numbers. Within a few generations this new editorial format would become the standard for all future publications of God’s Word.</Text>
        <Text style={styles.contentH2}>Helps and Hindrances.</Text>
        <Text style={styles.contentBody}>In many ways the Langton/Stephanus legacy has been a great aid to biblical studies. Without a quick, easy, and consistent way to reference a particular passage of the Scriptures we could not have the classic concordances like Strong’s and Young’s, nor could we do digital word searches with the help of our latest computer software. General biblical literacy among the people of God has been enhanced by the ability to target a specific passage without logistical hassle. The work of producing a Sunday sermon, of creating a Bible memorization club, and holding a home Bible study group has been facilitated by the commonly accepted framework of “chapters and verses which evolved from the creativity of the archbishop and the printer.</Text>
        <Text style={styles.contentBody}>However, the Langton/Stephanus legacy has also created hindrances for the study of the Word of God, by creating artificially-imposed divisions upon the natural flow of the text of Scripture. Frequently, the chapters and verses are not only used as a quick means of referring to the text, but as a common framework for reading, memorizing and studying the text. This results in the unfortunate dissection of the text. The chapters and verses have become more than textual markers; they shape the parameters of study often times in a way that hinders us from seeing the natural and life-giving integrity of the text.</Text>
        <Text style={styles.contentH2}>John 3:16?</Text>
        <Text style={styles.contentBody}>Consider this well-known verse to see both the positive and the negative impact that the Langton/Stephanus versification has had upon us. First the positive. Being able to refer directly to John 3:16 is a boon. Imagine how imprecise it would be to say, “Jesus said. . .” or, “In the gospels it is written. . .” or “Have you not read in John’s gospel, in the passage about Nicodemus. . .” Before Langton/Stephanus these would have been our options. How laborious to try to lead a whole group of eager students to the same text without chapters and verses!</Text>
        <Text style={styles.contentBody}>However, here’s the downside. Though many have memorized John 3:16, how many have memorized John 3:15 or 3:17? When Jesus first spoke to Nicodemus, there was an uninterrupted flow in his thought process, a process that is dissected by the versification of the Scriptures. And like all things dissected, life is lost in the dissection process.</Text>
        <Text style={styles.contentBody}>Certainly when John recorded for us Jesus’ words he did not think, “Some day people will lift this one phrase out of context and memorize and repeat it myriads of times.” The whole of Jesus’ argument was a logically coherent unit that must be understood as a whole. The first word in this famous verse—for—should be a clear clue that it was never spoken as a stand-alone phrase, but as a thought that built on what was spoken before. “And as Moses lifted up the bronze snake on a pole in the wilderness, so the Son of Man must be lifted up, so that everyone who believes in him will have eternal life. For God loved the world so much that he gave his one and only Son . . .” (Joh 3:14-16a, emphasis added). “How many never link the words Jesus spoke in what has come to be known as “John 3:16” with the Old Testament story found in Numbers 21? If we fail to do so, we miss the point Jesus was trying to make, because he clearly intended for us to make this connection! Because of the versification many have lost sight of the coherent integrity of Jesus’ argument.</Text>
        <Text style={styles.contentH2}>The Love What?</Text>
        <Text style={styles.contentBody}>Let us press on to consider what has come to be known as the “love chapter”—1 Corinthians 13. When Paul penned this letter, he did not stop after verse 31 of what we now refer to us as “chapter 12” and say. “Now I am going to write the love chapter.” In his thinking it was not a separate literary piece, but an integral part of his ministry to the Corinthian believers. It was the conceptual glue that held together his ideas in “chapter” 12 and “chapter” 14. When “we lift this passage out of the inspired literary flow as a distinct “chapter” it creates an unnatural perspective and does damage to the integrity of the text.</Text>
        <Text style={styles.contentH2}>Jesus Excluded from the “Faith Chapter”.</Text>
        <Text style={styles.contentBody}>The author of Hebrews never imagined that the reader would stop reading at the end of what today we call the “faith chapter”—such a chapter never existed in the original. The whole purpose of “this brief exhortation” is to exalt Jesus as better. He’s better than the angels (“chapters” 1 and 2), better than Moses (“chapter” 3) or Joshua (“chapter” 4), indeed he is better than any high priest be it Melchizedek or Aaron or the Levitical priesthood (“chapters” 5 through 10), for he is the author of a “far superior” ministry, because “he is the one who mediates for us a far better covenant with God, based on better promises” built upon the “better sacrifices” of “the sprinkled blood, which speaks of forgiveness” resulting in “a better hope, through which we draw near to God."</Text>
        <Text style={styles.contentBody}>The many historical Old Testament references are utilized to point the reader not to the past but to the supreme excellency of Jesus. Therefore, when “chapter” 11 makes mention of the faith of Abel, Enoch, Noah, Abraham, Sarah, Isaac, Jacob, Joseph, Moses, Rahab, Gideon, Barak, Samson, Jephthah, David, Samuel, the prophets, women, and others who “were too good for this world,” the point was not to look to these heroes of the past, but to Jesus, “the champion who initiates and perfects our faith.” Clearly the author’s train of thought was not complete until Jesus was lifted up as the culminating paradigm.</Text>
        <Text style={styles.contentBody}>However, because this climactic statement is found in the “next chapter,” the natural connection is lost due to the interruption caused by the artificial chapter division. How many Sunday School classes study a chapter a week? When these artificial divisions become a framework for study they can become a hindrance to understanding the natural flow of God’s Word.</Text>
        <Text style={styles.contentH2}>A New Paradigm: SourceView™.</Text>
        <Text style={styles.contentBody}>Dividing the text is not wrong, but as illustrated, dividing it into artificial segments of thought that disrupt the natural flow of the text can become a hindrance to understanding. The key is to discover a better way to divide the Word, a way which reflects the natural divisions in each book.</Text>
        <Text style={styles.contentBody}>This book allows you to read the Bible focused on the natural flow of ideas and events in the story format of the original text. Because much of the Bible is a dramatic narrative in which a narrator sets the stage and various actors contribute to the development of the text with their words and actions, any divisions should rightly reflect these interchanging contributions. The reader would then see the natural story line, and much like a movie script, be able to easily follow the unfolding drama with no artificial breaks. This innovative format is introduced here.</Text>
        <Text style={styles.contentBody}>The benefits of this fresh format of the biblical text are numerous:</Text>
        <Text style={styles.contentBody}>Artificial divisions are eliminated. Natural breaks in the text are noted as the verbal participation of various persons changes, thus making for an easy referencing system.</Text>
        <Text style={styles.contentBody}>One can clearly see who is saying what at a glance.</Text>
        <Text style={styles.contentBody}>The stories within the Bible recover their natural dramatic clarity and conceptual immediacy.</Text>
        <Text style={styles.contentBody}>Readers can see the text with new eyes as they read familiar passages.</Text>
        <Text style={styles.contentBody}>One is able to do word studies not only within boundaries determined by chapter and verse parameters, but in relation to who is the source of any given phrase. So now we can do not only a word study of “love” in the Bible, we can do a word study of “love” as it was used by Peter in the 17 times he speaks in Matthew, the 10 times in Mark, the 13 times in Luke, the 17 times in John, the 29 times in Acts, and all of his writings in 1 and 2 Peter. This new tool thus gives new research possibilities never before available to the student of God’s word. Just like the invention of chapters and verses birthed the concordance, this innovation births multi-dimensional research tools that will further the study of the biblical text.</Text>
        <Text style={styles.contentBody}>The natural literary law of principality is clearly evident with SourceView™. So the three longest passages containing Jesus’ words in Matthew, or the five longest statements by the narrator in Mark, or the two longest speeches by someone else in Luke, become immediately apparent. Thus the author’s main ideas in selecting material for the book becomes very clear.</Text>
        <Text style={styles.contentBody}>The SourceView™ framework makes it easier for literate learners to recover the skills of Bible storying and see its importance if we are to reach the unreached of the world with the gospel story. Is it not inter“esting that nearly 70 percent of the unreached of the world are oral learners who prefer a narrative exposition over a propositional explanation, and that nearly 70 percent of the Bible is naturally in narrative form? Certainly when God revealed his Word he understood how the people he had created best learned. Using the SourceView™ format allows us to restore the natural story form of the biblical text and make it more accessible to the unreached of the world, aiding in both the evangelism of the lost and the discipleship of the believer.</Text>
        <Text style={styles.contentH2}>Final Recommendations.</Text>
        <Text style={styles.contentBody}>My journey that led to the development of the SourceView™ format began in 1997. I was leading a group of eager students in Youth With A Mission’s University of the Nations. We were studying the whole of the Bible in Richmond, Virginia, as part of the three-month Bible Core Course. On a particular day we were scheduled to read three of the four gospels aloud together. Each one took a turn reading a chapter out loud while the others in the group listened. That’s how I had always seen people read the Bible corporately. It took us about two and a half hours to make it through Matthew. A similar time frame was needed to read through John. I could tell that the group was wearying from the exercise. I knew that something had to be done to add some spark to the process or people would be checking out before we made it through the nearly three hours it would take to read Luke.</Text>
        <Text style={styles.contentBody}>How could I make the reading more interesting, more dynamic, more alive? As I thought of that question, a new idea popped into my mind: Divide the students into groups of three and assign to each a “particular role to read. I would have one read the words of Jesus. Another would read the words of the gospel writer. The third would read everything else. As students began reading Luke with this new set of instructions, a renewed interest and excitement began to be evident among them. As students got into their roles, the inflections of their voices changed and the dramatic nature of the narrative took on fresh vigor! It was exciting to observe the change that came over them. Reading chapter by chapter had led them into a droning cadence; but as they began to shift voices to reflect each new character in the gospel story, a fresh enthusiasm in the Word was released.</Text>
        <Text style={styles.contentBody}>This experience led me over the next many years to develop the SourceView™ format of the Bible, which is here presented for the first time. In each book of the Bible, the words of the narrator are in black, those of God are in red, those of the lead character (or characters) are in green, and every one else is in blue. Every time a person intervenes in the text of a given book their participation is referenced with a sequential number. So, God’s first words to Abraham (in what we know as Gen 12:1-3) are identified as God 39, because this is the 39th time God speaks in the book of Genesis. Similarly, Abraham’s initial intercession before God on behalf of Sodom and Gomorrah (Gen 18:23-25) is referenced as Abraham 14 because his words here represent the fourteenth time Abraham speaks in the book.</Text>
        <Text style={styles.contentBody}>With this understanding, my recommendation is that you get into the text of the Scriptures and start reading through God’s Word in a fresh way. If you read alone, observe the dramatic interchanges between the different characters involved in the story. If you want company, my suggestion is to find three other people and have each one read a different color of text: black, red, green, or blue. Allow the story to come alive as you read your respective parts with the appropriate tone of voice! Maybe you can do this with colleagues at work over lunch break, or with friends as you gather for a Bible study at your favorite café, or with your children as you gather around the breakfast table for family devotions. As Paul encouraged Timothy, I encourage you—whether alone or in a group—to “focus on reading the Scriptures” (1Ti 4:13) and allow the Word of God to have a renewed impact on your life.</Text>
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

export default Why;
