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

const Acknowledgments = (props: Props) => {
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
        <Text style={styles.contentH2}>Acknowledgments for the SourceView and SphereView Bible Digital Development</Text>
        <Text style={styles.contentBody}>After publishing the first edition of the SourceView Bible on paper I began to realize that there was much more that could be done in this digital age. We had the beginnings of a new data set which would allow the reader to experience the Word of God like never before. With that in mind we assembled a vast team that would help us search the Scriptures in depth from multiple angles creating observational data that makes this unique app a reality. Over 200 people from more than 40 countries contributed more than 40,000 hours of work in order to bring to you what you hold in your hand. To each and every one of them I wish to express my heartfelt gratitude for their significant contribution to this project.</Text>
        <Text style={styles.contentBody}>The team represented a wonderful breadth of diversity for they came from Australia, Bangladesh, Belgium, Cambodia, Cameroon, Canada, Chile, China, Denmark, England, Estonia, Finland, France, Germany, Ghana, Hong Kong, India, Indonesia, Ireland, Italy, Japan, Malaysia, Martinique, Mexico, Morocco, Netherlands, New Zealand, Norway, Papua New Guinea, Reunion Island, Scotland, Singapore, Slovakia, South Africa, South Korea, South Sudan, Sweden, Switzerland, Taiwan, Uganda, United States, Venezuela, Zambia, and Zimbabwe.</Text>
        <Text style={styles.contentBody}>Those who contributed to the enhancing the original SourceView framework for this digital expression are: Stephanie Armbruster, Nathaniel Baldock, David Joel Hamilton, Christine Hamilton, April Diane Harper, Kristen Jensen, Morgan Keach, Jackson Ambe Ndecheck, Ulrik Sandborg-Petersen, Joshua Seykora, Jonathan Spainhour, Rob Wiebe, Cy Wiebe, and Sara Zacarias. They made it possible for us to integrate hundreds of improvements over the first print edition of the SourceView Bible, incorporating enhancements that enable greater functionality on a digital platform.</Text>
        <Text style={styles.contentBody}>Those who gave of their time to read through the Bible and assist with the initial observation to identify the specific sphere-related passages are: Brittany Abrego, Sigve Amundal, Mitch Anderson, Paul Baker, Nathaniel Baldock, Maria Teresa Blay, Gary Boyd, Melissa Brandes, Mark Brokenshire, Luke Brown, Peter Brownhill, Solveig Brudeli, Shannon Buchbach, Zhou (Joanna) Chan, Peter Clemison, John Elhardt, Tammy Fisher, Keri Fishlock, Magna Fossan, Vegard Furuskjeg, Philip Goldney, Li Guan, Garth Gustafson, Oyvind Gustavsen, David Joel Hamilton, Marilynn Hamilton, Matthew Hamilton, April Diane Harper, Helge Haugland, Caleb Heidegger, John Herbert, Allana Hiha, Kima Hmar, Trisha Hooper, Xavie Jean-Bourgeault, Kristen Jensen, Shirley Jones, Kjetil Karlsen, Sat Khmer, Youngshin Kim, Sokunthea Koeung, Pamela Kudiwa, Heather Kuhl, John LaDue, Naomi Lloyd, Anya Looper, Donna MacGowan, Andy Matson, Amy McCoy, Christen McGee, Dan McKoy, Joyce Meade, David Mercadante, Laura Meyers, Michelle Meyers, James Alex Miller, Laura Morales, Fola Mosolasaya, Nick Muriro, Brittany Namowicz, Jackson Ambe Ndecheck, Bryan Neal, Stephanie Ng, Joanna Overall, Gjermund Øystese, William Pang, Bronwyn Payton, Ethan Perez, Piseth Pich, Whitney Pittman, Sage Prigge, Tia Rakadrudru, Esther Rich, Merja Roukonen, Florian Rubli, Faby Ruesga, Frank Ruesga, Jesse Ruiz, Michael Schlender, Patrick Senn, Joshua Seykora, Bonny Shim, James Sivalon, Joakim Skavern, Janice Spainhour, Jonathan Spainhour, Julie Spence, Mark Spence, Nathan Sperry, Lucie Sperry, Jonathan Stock, Melody Strauss, Matthew Thompson, Carl Tinnion, Jorunn Valbø, Yassina van Wageningen, Tracy van Veen, Øyvind Vassli, Dominika (Nika) Velebir, Helina Voogne, Emily Vugutsa, Cy Weibe, Rob Weibe, Diane Wigstone, Ji Yon Lee, and Sara Zacarias.</Text>
        <Text style={styles.contentBody}>Those who gathered together in intensive, focused one-week-long SphereSurges to review and edit the initial observations made by the prior group were: Simon Aberg, Jewel Anita, Stephanie Armbruster, John Ashworth, Steve Ashworth, Nathaniel Baldock, Larry Baldock, Emma Blake, Maria Teresa Blay, Mark Brokenshire, Leah Broomfield, Hannah Brownell, Peter Brownhill, Oliver Brune, Moses Castano, Jennie Chapin, Joseph Chean, Tessa Choo, Joanne Chuah, Anne Cochrane, Sue Cole, Steven Copsey, Linda Cowie, Julie Dawson, John Dawson, Brian Diehl, Mandi Dreyer, Fiona Elvin, Graham Elvin, Emmanuel Entee, Josh Escaravage, James Featherby, Edwin Fillies, Keri Fishlock, Judy Foo, Kathy Gooch, Shannon Graybill, Michael Green, Sarah Grunder, Oyvind Gustavsen, Christine Hamilton, David Joel Hamilton, Danielle Hancock, Geok Har, April Diane Harper, Allana Hiha, Cameron Hodgson, Sung Pyo Hong, Nick Holding, Kristen Jensen, Shirley Jones, Lisa Jones, Lai Kai Ming, Morgan Keach, William Kingwell, Toby Knoblauch, Rebecca Koenig, Heather Kuhl, Conrad Kusel, Joal Lam, Lindsey Lautsbauch, Dan Leafblad, Philip Leage, Maverick Leong, Melody Lim, Alan Lim, Al Ling, Naomi Lloyd, Ivan Maximiliano Saldaño, Jenny Miln, Laura Morales, Nick Muriro, Jackson Ambe Ndecheck, Vivian Ngan, Lunga Nomongo, Elizabeth Norris, Robert Norsworthy, Janine Nowicki, Hans Oines, Lisa Orvis, Joanna Overall, Mariah Page, John Peachey, Xochicel Espinosa Perez, Julie Pfau, Nathalie Picteur, Sage Prigge, Alex Quayson, Alistar Reese, Bryan Riley, Jesse Ruiz, Peter Scott, Joshua Seykora, Joseph Shaw, Ivy Sheaves, Teng Si Jai, Jonathan Spainhour, Julie Spence, Stephane Tan, William Teo, Patrena Teo, Jill Thornton, Carl Tinnion, Chisako Tominaga, Allard van Donk, Tracy van Veen, Petra Verreth, Nicola Wilkinson, Felipe Zamora, and Thomas Zulu. Thanks also to the staff and students of the School of Biblical Studies in Muizenberg, South Africa for participating in this review process.</Text>
        <Text style={styles.contentBody}>The seven SphereSurges were hosted by different YWAM bases around the world. For all the financial, logistical and prayer support they provided, facilitating these key research events, we give thanks to the YWAM ministries Marine Reach Tauranga, New Zealand (Family); Harpenden, England (Economics); Muizenberg, South Africa (Government); Singapore (Religion); Kona UofN Campus, Hawaii (Education); Los Angeles, California (Media/Communication); and Perth, Australia (Celebration).</Text>
        <Text style={styles.contentBody}>The next major research stage involved a six week SphereViewathon event which vetted and harmonized our prior discoveries. This event was hosted by YWAM Ships Kona, Hawaii – to them we are very grateful indeed for the support and encouragement received. A special word of gratitude for Brett and Karen Curtis, and Jim and Nico Walker for their leadership at Port YWAM for generously facilitating this stage of development. Thanks also to Jeremy and Havilah Pyrc who graciously kept us deliciously caffeinated throughout the long work hours! Those involved in this stage of the app development were: Nathaniel Baldock, Maria Teresa Blay, Christine Hamilton, David Joel Hamilton, April Diane Harper, Kristen Jensen, Rebecca Koenig, Corey Passehl, Ray Pieratt, Jonathan Spainhour, Chris Toney, Tracy van Veen, and Rob Weibe. To each of them a special thanks is warranted for their tireless and diligent labor of love.</Text>
        <Text style={styles.contentBody}>Following these three stages of research there was a lot of time needed for final SphereView data compilation and verification. This was made possible by the persevering work of the following individuals: Stephanie Armbruster, Nathaniel Baldock, Ti-Hsien Chen, Michael DiMarco, Mickiel Doketah, Lisi Fredriksen, David Joel Hamilton, Christine Hamilton, April Diane Harper, Kristen Jensen, Joshua Seykora, Rachael Smith, Jonathan Spainhour, Chris Toney, Tracy van Veen, Rob Wiebe, Sara Zacarias, and Vanessa Zebo. This was no small job as the Scriptures have now been tagged with more than sixteen million data points, allowing us to experience the Bible as never before in this digital age.</Text>
        <Text style={styles.contentBody}>Throughout this multi-year process we have benefitted from the technical assistance, advice, and encouragement we received from the gifted people at the American Bible Society (John Mark Mitchell), Code for the Kingdom (Chris Armas), YWAM Amsterdam (Joshua de Lange), YWAM Kona (Chongho Won), and YWAM Lausanne (Vince Licari). We have also greatly benefitted from the design, media and marketing contributions of: Crosssection (Kris Hull, Doug Martinez and Jason Pearson), Global Virtual Studio (David Bruce, David Getter, Nikki Nietz, and Felipe Zamora), Innovision (Jeff Rogers and Joel Rogers), Refresh Media (Kris Couch), and Viking Studios (Timothy S Hamilton). Thanks also to Wendy Viscuglia of the Newman Family Foundation for all the logistical support. With all of this preporatory support we were able to assemble an incredible team to then actually develop this app. They included Ulrik Sandborg-Petersen of Scripture Systems, Harold Emsheimer and Jonathan Younger from Overcommitted, and Nathaniel Baldock, Robert Norsworthy, and Gus Svendsen from the SourceView Bible team. They have all helped in making the dream come true. Thank you.</Text>
        <Text style={styles.contentBody}>And of course none of this would have been possible without the prayer and financial support of myriads of people. Thank you to the Youth With A Mission staff and leadership who have given in so many ways to support this project as one of many ways to help end Bible poverty in our time. Special thanks to Loren and Darlene Cunningham, YWAM’s co-founders, for creating a platform in which creativity is encouraged and dreams are championed. It would not have been possible without you and the many whom you have inspired. Thanks to the many YWAMers who interacted with me at various stages of the development giving their feedback as they heard message after message. In this regard special thanks to YWAM Kona which has nurtured this project from the start, the members of the UofN Advisory Board, and the first cohort of the University of the Nations’ Executive Masters in Leadership.</Text>
        <Text style={styles.contentBody}>Thanks also to The Seed Company, the Newman Family Foundation, Barry Hon, and H Lee Martin for your generous support, without which there would be no app. Thank you for your partnership, standing with us to see this new way of experiencing the Bible come to light. Together we hope to see a new passion to engage with God’s Word in our generation. The investment made by these friends has been complemented by the generous posture of Tyndale Publishing House, whose New Living Translation we are delighted to present as the launch language of the SourceView Bible app. Thanks to Doug Knox and all the leadership team at Tyndale for the amazing support you have given to us. It has been such a delight to work with you.</Text>
        <Text style={styles.contentBody}>As we close there are two names that need to be underlined in a special way. If you’ve read through all the lists you will have read them already several times.
        One is that of Nathaniel Baldock. He joined me three and a half years ago when I began the SphereView project – both of us thinking it would take only six months. Though it has taken much longer than expected he has pressed on by my side. He began as the project manager and ends this time as a dear friend. His steadfastness, creativity, communication skills and leadership have been a huge part of the success of this project. I am grateful.</Text>
        <Text style={styles.contentBody}>The other is that of my wife, Christine, who is a most remarkable person. She has undergirded this project with prayer, has provided gracious hospitality to many, has proofread thousands of pages of text and data, has served and encouraged me without end. There would be no SourceView or SphereView Bible without her love, patience and wisdom. Thank you, sweatheart!</Text>
        <Text style={styles.contentBody}>Finally, I have reseerved the final acknowledgment for the One to whom we all owe an eternal debt of gratitude. Thanks be to the God of the Bible who has come to encounter us time and again – not only in ages past but also in the present day. He who spoke continues to speak; He who led continues to lead; He who redeemed continues to redeem. It is because of Him and for Him that I and all the others whose names have been mentioned here have done what we have done. To Him be all the glory forever and ever. To Him we offer this app as a gift with hopes that it brings pleasure to His heart and is useful in His hands to accomplish His purposes here on planet earth.</Text>
        <Text style={styles.contentBody}>If any benefit is derived by you the reader from all th effort of this remarkable team, then thanks to all those who made it possible and praise be to God. If there are any errors, those are my responsibility and I welcome your communication so that we may be able to improve this app with subsequent iterations.</Text>
        <Text style={styles.contentBody}>May we all grow in cultivating a passion for the Word of God in order that we might more fully know, love and obey the God of the Word.</Text>
        <Text style={[styles.contentBody, {marginBottom: 0}]}>David Joel Hamilton</Text>
        <Text style={[styles.contentBody, {marginBottom: 0}]}>Developer of the SourceView™ and SphereView™ Bibles</Text>
        <Text style={styles.contentBody}>August, 2016</Text>
        <View style={styles.separator} />
        <Text style={styles.contentH2}>Acknowledgments for the First Edition Printed SourceView Bible</Text>
        <Text style={styles.contentBody}>This Bible would not have made it to print without the generous support of Greg Newman, Bob Norsworthy, and Wendy Viscuglia of the Newman Family Foundation, or the expert counsel of Roger Freet, who guided us through the publishing process.</Text>
        <Text style={styles.contentBody}>Materials used in the SourceView™ Bible include portions of the introductions, including titles and sub-titles, to each book of the Bible from YWAM’s Christian Growth Study Bible. The book introductions in the Christian Growth Study Bible were originally adapted by David Joel Hamilton (one of the YWAM CGSB Senior Content Editors) from original material made available from Zondervan by Dirk Buursma, Senior Editor-at-Large. The book titles and sub-titles were developed by David Joel Hamilton, Edgar C. Sherman, and Scott Tompkins. All these materials had the valuable editorial input of Dirk Buursma (Zondervan), C. Lynn Green (YWAM General Editor), Betty Barnett (YWAM Managing Editor), Maureen Menard, and Edgar C. Sherman (the other two YWAM Senior Content Editors), along with Sandra Tompkins and Scott Tompkins (YWAM Senior Editors).</Text>
        <Text style={styles.contentBody}>The book introductions, titles, and subtitles in the SourceView™ Bible have once again been adapted and expanded by David Joel Hamilton in conjunction with the indispensible editorial contributions of Lisa Orvis, Sandra Tompkins, and Scott Tompkins.</Text>
        <Text style={styles.contentBody}>The original SourceView™ Bible was produced by David Joel Hamilton using the first edition of the NLT. The current version using the NLTse (second edition) was made possible thanks to the skillful editorial contributions of Kay Benavraham, Laurel Cleary, Beau Durr, Andrew Greenplate, Christine Hamilton, Andrew Kooman, Crystal Laws, Lisa Orvis, Richlyn Poor, Carol Scott, and Linda Weller. Lisa Orvis served as the Managing Editor of this process.</Text>
        <Text style={styles.contentBody}>The SourceView™ Bible logo was created by Timothy S Hamilton. It represents the dynamic narrative found in the biblical text. The largest dialogue balloon comes from heaven and is in red, representing the voice of God. The other two balloons—blue and green—represent other speakers; green is the larger as it represents the words of the lead character(s) of any given book; blue is the smaller for it depicts the words of the supporting cast. The title is in black, the color of the Narrator who ties it all together.</Text>
        <Text style={styles.contentBody}>“Grateful acknowledgments are expressed to one and all. Without the gracious and diligent efforts of those mentioned above this innovative format of the Bible would not have been possible.</Text>
        <Text style={styles.contentBody}>We have all made various contributions to this project in hopes that you, the reader, will find in this new layout of the Word of God a freshness that draws you into God’s story with a renewed hunger to hear his message and apply his truth into your life and community. We trust you will be encouraged and challenged by the revelation of the biblical drama. We pray that through your acts of obedience in response to God’s story, his kingdom will be extended and his name will be glorified.</Text>
        <Text style={styles.contentBody}>It is ultimately to God that we express our greatest and most heart-felt thanks. If it were not for his gracious and inspired message through faithful men and women of old, there would be no fresh bread for us today. May God take joy in this effort to discover an innovative way to communicate his eternal Word in an effective and fruitful manner to this generation.</Text>
        <Text style={[styles.contentBody, {marginBottom: 0}]}>David Joel Hamilton</Text>
        <Text style={[styles.contentBody, {marginBottom: 0}]}>Developer of the SourceView™ and SphereView™ Bibles</Text>
        <Text style={styles.contentBody}>January, 2011</Text>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
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

export default Acknowledgments;
