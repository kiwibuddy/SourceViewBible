/* @flow */
'use strict';

import React, { Component } from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native'

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../Common';

import { NavigationBar, NavigationBarButton } from '../../Components/Navigation';
import { BACK } from '../../Navigation';

type Props = {
  title: string,
  navigate: Function,
};

const Copyright = (props: Props) => {
  return (
    <View style={styles.container}>
      <NavigationBar title={props.title}>
        <NavigationBarButton
          title={Localizable.t('back')}
          onPress={() => props.navigate(BACK)}
          style={{position: 'absolute', left: 0}}
        />
      </NavigationBar>
      <ScrollView style={styles.scrollView}>
        <View style={styles.aboutContainer}>
          <Text style={styles.contentBody}>Holy Bible, New Living Translation, copyright © 1996, 2004, 2007 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Inc., Carol Stream, Illinois 60188. All rights reserved.</Text>
          <Text style={styles.contentBody}>NLT, New Living Translation, and the New Living Translation logo are registered trademarks of Tyndale House Publishers, Inc. Used by permission. All rights reserved.</Text>
          <Text style={styles.contentBody}>The text of the Holy Bible, New Living Translation, may be quoted in any form (written, visual, electronic, or audio) up to and inclusive of five hundred (500) verses without express written permission of the publisher, provided that the verses quoted do not account for more than 25 percent of the work in which they are quoted, and provided that a complete book of the Bible is not quoted.</Text>
          <Text style={styles.contentBody}>When the Holy Bible, New Living Translation, is quoted, one of the following credit lines must appear on the copyright page or title page of the work:</Text>
          <Text style={styles.contentBody}>Scripture quotations marked (NLT) are taken from the Holy Bible, New Living Translation, copyright © 1996, 2004, 2007 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Inc., Carol Stream, Illinois 60188. All rights reserved.</Text>
          <Text style={styles.contentBody}>Scripture quotations are taken from the Holy Bible, New Living Translation, copyright ©1996, 2004, 2007 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Inc., Carol Stream, Illinois 60188. All rights reserved.</Text>
          <Text style={styles.contentBody}>Unless otherwise indicated, all Scripture quotations are taken from the Holy Bible, New Living Translation, copyright © 1996, 2004, 2007 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Inc., Carol Stream, Illinois 60188. All rights reserved.</Text>
          <Text style={styles.contentBody}>“When quotations from the NLT text are used in non-salable media, such as church bulletins, orders of service, newsletters, transparencies, or similar media, a complete copyright notice is not required, but the initials (NLT) must appear at the end of each quotation.</Text>
          <Text style={styles.contentBody}>“Quotations in excess of five hundred (500) verses or 25 percent of the work, or other permission requests, must be directed to and be approved in writing by Tyndale House Publishers, Inc., 351 Executive Drive, Carol Stream, IL 60188.</Text>
          <Text style={styles.contentBody}>Publication of any commentary or other Bible reference work produced for commercial sale that uses the New Living Translation requires written permission for use of the NLT text.</Text>
          <Text style={styles.contentBody}>Grateful acknowledgements are made to the Newman Family Foundation for their generous support of the SourceView™ Bible project and to Youth With A Mission (YWAM) for granting permission to use material found in the Christian Growth Study Bible, New International Version, copyright © 1997 by The Zondervan Corporation. (See Acknowledgements for details)</Text>
          <Text style={styles.contentBody}>SourceView™ Bible. Copyright © 2010 by David Joel Hamilton. All rights reserved. Printed in China by Codra Enterprises, Inc. No part of this book may be used or reproduced in any manner whatsoever without written permission except in the case of brief quotations embodied in critical articles and reviews. For information, contact: SourceView Publishing, LLC, 1499 Danville Boulevard, Suite 202, Alamo, CA 94507.</Text>
          <Text style={styles.contentBody}>SourceView Publishing Web site: http://www.sourceviewbible.com</Text>
          <Text style={styles.contentBody}>SourceView™ and its logo are trademarks of SourceView Publishing, LLC.</Text>
          <Text style={styles.contentBody}>FIRST EDITION</Text>
          <Text style={styles.contentBody}>Interior typesetting and design by John R. Kohlenberger III/Blue Heron Bookcraft, Battle Ground, WA.</Text>
          <Text style={styles.contentBody}>Library of Congress Cataloging-in-Publication Data is available upon request.</Text>
          <Text style={styles.contentBody}>ISBN 978-0-9831700-0-6</Text>
          <Text style={styles.contentBody}>(Codra) 10 9 8 7 6 5 4 3 2 1</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
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

export default Copyright;
