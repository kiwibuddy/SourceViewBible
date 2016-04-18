/*
 * emdros-lconfig.h.in
 *
 * Local configuration
 *
 * Ulrik Petersen
 * Created: 10/21-2001
 * Last update: 9/27-2014
 *
 */
/************************************************************************
 *
 *   Emdros - the database engine for analyzed or annotated text
 *   Copyright (C) 2001-2014  Ulrik Sandborg-Petersen
 *
 *   This program is free software; you can redistribute it and/or
 *   modify it under the terms of the GNU General Public License as
 *   published by the Free Software Foundation, license version 2.  
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *   General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, write to the Free Software
 *   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *   02111-1307 USA
 *
 *
 *   Special exception
 *   =================
 * 
 *   In addition, as a special exception, Ulrik Petersen, the
 *   copyright holder of Emdros, gives permission to link Emdros, in
 *   whole or in part, with the libraries which are normally
 *   distributed with:
 *   
 *   a) Sun's Java platform,
 *   b) Python, 
 *   c) Jython,
 *   d) Ruby, and/or 
 *   e) Perl 
 *   f) PostgreSQL
 *   g) OpenSSL
 *
 *   (or with modified versions of these), and to distribute linked
 *   combinations including both Emdros, in whole or in part, and one
 *   or more of the libraries normally distributed with (a)-(g) above.
 *
 *   Please note: This gives you special rights concerning the
 *   libraries which normally accompany the above pieces of software.
 *   It gives you no special rights concerning software that you write
 *   yourself.  You must obey the GNU General Public License in all
 *   respects for all of the code used other than the libraries
 *   normally distributed with (a)-(g) above.
 *
 *   If you modify this file, you may extend this exception to your
 *   version of the file, but you are not obligated to do so. If you
 *   do not wish to do so, delete this exception statement from your
 *   version.
 *
 *
 *   Other licensing forms
 *   =====================
 *
 *   If you wish to negotiate commercial licensing, please contact
 *   Ulrik Petersen at ulrikp[at]users.sourceforge.net.
 *
 *   Licensing can also be negotiated if your organization is an
 *   educational, non-profit, charity, missionary or similar
 *   organization.
 *
 *
 *   Website
 *   =======
 *
 *   Emdros has a website here:
 *
 *   http://emdros.org
 *
 *
 *
 **************************************************************************/


/*
 * This file is to be run through configure's AC_OUTPUT line.
 *
 */


#ifndef LCONFIG__H__
#define LCONFIG__H__

#define HAVE_WSTRING @HAVE_WSTRING@
#define HAVE_OSTREAM_OUT_WSTRING @HAVE_OSTREAM_OUT_WSTRING@

#ifndef USE_POSTGRESQL
#define USE_POSTGRESQL 0
#endif

#ifndef USE_MYSQL
#define USE_MYSQL 0
#endif

#ifndef USE_SQLITE2
#define USE_SQLITE2 0
#endif

#ifndef USE_SQLITE3
#define USE_SQLITE3 1
#endif

#ifndef USE_BPT
#define USE_BPT 1
#endif

#ifndef USE_BPT2
#define USE_BPT2 0
#endif

#ifndef LINUX
#define LINUX 0
#endif

#ifndef SUN
#define SUN 0
#endif

#define HAVE_ISTREAM 1
#define HAVE_OSTREAM 1

#define DEFAULT_BACKEND_ENUM kSQLite3

#ifndef USE_SYSTEM_SQLITE2
/** USE_SYSTEM_SQLITE2 must be zero if we are using the local SQLite2,
 * otherwise, it must be non-zero.
 *@internal
 */
#define USE_SYSTEM_SQLITE2 (1)
#endif

#ifndef USE_SYSTEM_SQLITE3
/** USE_SYSTEM_SQLITE3 must be zero if we are using the local SQLite3,
 * otherwise, it must be non-zero.
 *@internal
 */
#define USE_SYSTEM_SQLITE3 (1)
#endif


#endif /* LCONFIG__H__ */
